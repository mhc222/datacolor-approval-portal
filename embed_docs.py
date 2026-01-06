#!/usr/bin/env python3
"""
PDF to Pinecone Embedding Pipeline
Extracts text from PDFs, chunks by sections, creates embeddings, stores in Pinecone
"""

import os
import re
import hashlib
from pypdf import PdfReader
from openai import OpenAI
from pinecone import Pinecone

# Configuration
OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
PINECONE_API_KEY = "pcsk_57bNWz_6YuM2wUFrVVSFobThmfSmdTFVoAM7o5C4w1C9G4T6Hyqv7sYtinpz4QBJs8fRyE"
PINECONE_INDEX = "spyder-brand"

# Initialize clients
openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)

def extract_text_from_pdf(pdf_path):
    """Extract text from PDF, preserving page structure"""
    reader = PdfReader(pdf_path)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text() or ""
        if text.strip():
            pages.append({
                "page_num": i + 1,
                "text": text
            })
    return pages

def intelligent_chunk(pages, max_chunk_size=1500, overlap=200):
    """
    Chunk text intelligently by detecting section headers and natural breaks.
    Aims to keep related content together.
    """
    chunks = []

    # Section header patterns (common in brand guidelines)
    header_patterns = [
        r'^#{1,3}\s+.+',  # Markdown headers
        r'^[A-Z][A-Z\s]{3,50}$',  # ALL CAPS HEADERS
        r'^\d+\.\s+[A-Z]',  # Numbered sections like "1. Introduction"
        r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3}:',  # Title Case Headers with colon
        r'^(?:Chapter|Section|Part)\s+\d+',  # Chapter/Section markers
    ]

    current_chunk = ""
    current_section = "Introduction"
    chunk_index = 0

    for page_data in pages:
        page_num = page_data["page_num"]
        text = page_data["text"]

        # Split by paragraphs (double newline or significant whitespace)
        paragraphs = re.split(r'\n\s*\n|\n(?=[A-Z])', text)

        for para in paragraphs:
            para = para.strip()
            if not para:
                continue

            # Check if this paragraph is a section header
            is_header = False
            for pattern in header_patterns:
                if re.match(pattern, para[:100] if len(para) > 100 else para, re.MULTILINE):
                    is_header = True
                    # Save current chunk before starting new section
                    if current_chunk.strip() and len(current_chunk) > 100:
                        chunks.append({
                            "chunk_index": chunk_index,
                            "section": current_section,
                            "text": current_chunk.strip(),
                            "page_num": page_num
                        })
                        chunk_index += 1
                        # Keep overlap from previous chunk
                        overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else ""
                        current_chunk = overlap_text
                    current_section = para[:100].strip()
                    break

            # Add paragraph to current chunk
            if len(current_chunk) + len(para) > max_chunk_size:
                # Save current chunk
                if current_chunk.strip() and len(current_chunk) > 100:
                    chunks.append({
                        "chunk_index": chunk_index,
                        "section": current_section,
                        "text": current_chunk.strip(),
                        "page_num": page_num
                    })
                    chunk_index += 1
                # Start new chunk with overlap
                overlap_text = current_chunk[-overlap:] if len(current_chunk) > overlap else ""
                current_chunk = overlap_text + "\n\n" + para
            else:
                current_chunk += "\n\n" + para

    # Don't forget the last chunk
    if current_chunk.strip() and len(current_chunk) > 100:
        chunks.append({
            "chunk_index": chunk_index,
            "section": current_section,
            "text": current_chunk.strip(),
            "page_num": pages[-1]["page_num"] if pages else 1
        })

    return chunks

def create_embedding(text):
    """Create embedding using OpenAI text-embedding-3-small"""
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
        dimensions=1536
    )
    return response.data[0].embedding

def generate_id(source, chunk_index):
    """Generate a unique ID for the vector"""
    content = f"{source}_{chunk_index}"
    return hashlib.md5(content.encode()).hexdigest()

def process_document(pdf_path, doc_type):
    """Process a single PDF and upload to Pinecone"""
    filename = os.path.basename(pdf_path)
    print(f"\n{'='*60}")
    print(f"Processing: {filename}")
    print(f"Doc Type: {doc_type}")
    print(f"{'='*60}")

    # Extract text
    print("  Extracting text from PDF...")
    pages = extract_text_from_pdf(pdf_path)
    print(f"  Extracted {len(pages)} pages")

    # Chunk intelligently
    print("  Chunking by sections...")
    chunks = intelligent_chunk(pages)
    print(f"  Created {len(chunks)} chunks")

    # Create embeddings and upload
    print("  Creating embeddings and uploading to Pinecone...")
    vectors = []

    for i, chunk in enumerate(chunks):
        # Create embedding
        embedding = create_embedding(chunk["text"])

        # Prepare vector with metadata
        vector_id = generate_id(filename, chunk["chunk_index"])
        metadata = {
            "source": filename,
            "doc_type": doc_type,
            "chunk_index": chunk["chunk_index"],
            "section": chunk["section"][:200],  # Truncate long section names
            "page_num": chunk["page_num"],
            "text": chunk["text"][:1000]  # Store truncated text for reference
        }

        vectors.append({
            "id": vector_id,
            "values": embedding,
            "metadata": metadata
        })

        # Upload in batches of 50
        if len(vectors) >= 50:
            index.upsert(vectors=vectors)
            print(f"    Uploaded batch ({i+1}/{len(chunks)} chunks)")
            vectors = []

    # Upload remaining vectors
    if vectors:
        index.upsert(vectors=vectors)

    print(f"  Completed: {len(chunks)} chunks embedded and uploaded")
    return len(chunks)

def main():
    docs_dir = os.path.expanduser("~/social-content-manager/docs")

    # Document configurations (ordered by size - smallest first)
    documents = [
        {
            "filename": "Datacolor_Spyder Pro Upgrade_Creative Brief_102625_v2-Final.pdf",
            "doc_type": "creative_brief"
        },
        {
            "filename": "Datacolor SpyderPro Fact Sheet-Final-EN-USD.pdf",
            "doc_type": "product_info"
        },
        {
            "filename": "Datacolor_Guidelines_EN_2019.pdf",
            "doc_type": "brand_guidelines"
        },
        {
            "filename": "CAI Brand Guidelines.pdf",
            "doc_type": "brand_guidelines"
        }
    ]

    total_chunks = 0

    for doc in documents:
        pdf_path = os.path.join(docs_dir, doc["filename"])
        if os.path.exists(pdf_path):
            chunks = process_document(pdf_path, doc["doc_type"])
            total_chunks += chunks
        else:
            print(f"  File not found: {doc['filename']}")

    print(f"\n{'='*60}")
    print(f"COMPLETE: {total_chunks} total chunks embedded in '{PINECONE_INDEX}'")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
