#!/usr/bin/env python3
"""Query Pinecone for brand information"""

import os
import sys
import json
from openai import OpenAI
from pinecone import Pinecone

OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY')
PINECONE_API_KEY = "pcsk_57bNWz_6YuM2wUFrVVSFobThmfSmdTFVoAM7o5C4w1C9G4T6Hyqv7sYtinpz4QBJs8fRyE"
PINECONE_INDEX = "spyder-brand"

openai_client = OpenAI(api_key=OPENAI_API_KEY)
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(PINECONE_INDEX)

def create_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
        dimensions=1536
    )
    return response.data[0].embedding

def query_pinecone(query_text, top_k=10, filter_dict=None):
    """Query Pinecone and return results"""
    embedding = create_embedding(query_text)

    results = index.query(
        vector=embedding,
        top_k=top_k,
        include_metadata=True,
        filter=filter_dict
    )

    return results

def main():
    if len(sys.argv) < 2:
        print("Usage: python query_pinecone.py 'your query here' [top_k]")
        sys.exit(1)

    query = sys.argv[1]
    top_k = int(sys.argv[2]) if len(sys.argv) > 2 else 10

    print(f"Query: {query}")
    print(f"Top K: {top_k}")
    print("=" * 60)

    results = query_pinecone(query, top_k)

    for i, match in enumerate(results.matches):
        print(f"\n--- Result {i+1} (Score: {match.score:.3f}) ---")
        print(f"Source: {match.metadata.get('source', 'N/A')}")
        print(f"Doc Type: {match.metadata.get('doc_type', 'N/A')}")
        print(f"Section: {match.metadata.get('section', 'N/A')[:80]}")
        print(f"Page: {match.metadata.get('page_num', 'N/A')}")
        print(f"Text: {match.metadata.get('text', 'N/A')[:500]}...")

if __name__ == "__main__":
    main()
