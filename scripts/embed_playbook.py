#!/usr/bin/env python3
"""
Chunk and embed the playbook.md file into Pinecone
"""
import os
from pinecone import Pinecone
from openai import OpenAI

# Initialize clients
pc = Pinecone(api_key=os.environ.get('PINECONE_API_KEY'))
openai_client = OpenAI(api_key=os.environ.get('OPENAI_API_KEY'))

# Connect to index
index = pc.Index('spyder-brand')

# Read the playbook
playbook_path = os.path.expanduser('~/social-content-manager/docs/playbook.md')
with open(playbook_path, 'r') as f:
    content = f.read()

# Define sections to chunk
sections = [
    {
        'title': 'Brand Voice',
        'content': """## Brand Voice
- **Tone**: Expert but approachable, helpful not salesy, passionate about color accuracy
- **Personality**: The knowledgeable friend who happens to be a color science expert
- **Avoid**: Jargon without explanation, talking down to beginners, aggressive selling""",
        'section': 'brand_voice'
    },
    {
        'title': 'Content Pillars',
        'content': """## Content Pillars (stick to these ratios)
- Color Education (40%): Tips, tutorials, "did you know", myth-busting
- Product Value (25%): Features, use cases, customer results (not specs)
- Community (20%): User work, behind-the-scenes, photographer stories
- Industry News (15%): Trends, new tech, creative inspiration""",
        'section': 'content_pillars'
    },
    {
        'title': 'Platform Rules - Instagram',
        'content': """### Instagram
- Carousel posts get 3x engagement - use for tutorials
- First slide = hook, must stop the scroll
- 3-5 hashtags max (mix of broad + niche)
- Best times: Tue-Fri, 11am-1pm, 7-9pm
- Reels outperform static for reach""",
        'section': 'platform_rules'
    },
    {
        'title': 'Platform Rules - Twitter/X',
        'content': """### Twitter/X
- 280 chars but 70-100 performs best
- Threads for education (5-8 tweets)
- Visual tweets get 150% more retweets
- Engage in replies, quote tweet industry news
- Best times: Tue-Thu, 9-11am""",
        'section': 'platform_rules'
    },
    {
        'title': 'Platform Rules - Facebook',
        'content': """### Facebook
- Longer form OK (but front-load the hook)
- Native video > YouTube links
- Questions drive comments
- Best times: Tue-Fri, 9am-1pm""",
        'section': 'platform_rules'
    },
    {
        'title': 'Post Formulas That Work',
        'content': """## Post Formulas That Work

### PAS (Problem-Agitate-Solution)
"Your prints don't match your screen? [Problem] You've wasted hours tweaking settings and money on reprints. [Agitate] Monitor calibration takes 5 minutes and fixes this forever. [Solution]"

### Before/After
Show the transformation. Uncalibrated vs calibrated. Amateur vs pro result.

### Myth Buster
"MYTH: Factory calibration is good enough. TRUTH: Monitors drift 2-5% monthly..."

### Quick Tip
"Pro tip: Calibrate in the lighting you actually edit in. That sunny window? Close the blinds first."

### Behind the Scenes
Show real photographers using Spyder. Messy desks welcome.""",
        'section': 'post_formulas'
    },
    {
        'title': 'Hooks That Stop the Scroll',
        'content': """## Hooks That Stop the Scroll
- Question: "Can you spot what's wrong with this photo?"
- Statistic: "73% of photographers have never calibrated..."
- Controversial: "Expensive monitors are a waste of money (if you skip this step)"
- Story: "A wedding photographer called us in tears..."
- Challenge: "Take this 10-second color accuracy test\"""",
        'section': 'hooks'
    },
    {
        'title': 'CTAs by Goal',
        'content': """## CTAs by Goal
- **Engagement**: "Drop a 🎨 if you've been there"
- **Save**: "Save this for your next editing session"
- **Share**: "Tag a photographer who needs to see this"
- **Click**: "Link in bio for the full guide"
- **Subtle sell**: "See why 2M photographers trust Spyder\"""",
        'section': 'ctas'
    },
    {
        'title': 'Content Mix (weekly)',
        'content': """## Content Mix (weekly)
- 2 educational posts
- 1 product-adjacent post (not hard sell)
- 1 community/UGC post
- 1 engagement post (poll, question, hot take)
- 1-2 stories/ephemeral content""",
        'section': 'content_mix'
    },
    {
        'title': 'What NOT to Post',
        'content': """## What NOT to Post
- Spec sheets as graphics
- "Buy now" without value
- Stock photos (ever)
- Responding to competitors directly
- Unedited AI images
- Politics, religion, controversy outside color science""",
        'section': 'guidelines'
    },
    {
        'title': 'Hashtag Strategy',
        'content': """## Hashtag Strategy
**Always use:**
#ColorManagement #MonitorCalibration #SpyderX

**Rotate based on content:**
#PhotographyTips #PhotoEditing #Lightroom #Photoshop #PrintPhotography #ColorAccuracy #CreativeWorkflow

**Audience-specific:**
Photographers: #PortraitPhotography #LandscapePhotography #WeddingPhotographer
Videographers: #Colorist #VideoEditing #DaVinciResolve
Designers: #GraphicDesign #DigitalArt #CreativePro""",
        'section': 'hashtags'
    }
]

print(f"Processing {len(sections)} sections from playbook.md...")

# Process each section
vectors = []
for i, section in enumerate(sections):
    # Generate embedding
    response = openai_client.embeddings.create(
        input=section['content'],
        model="text-embedding-3-small"
    )

    embedding = response.data[0].embedding

    # Create vector with metadata
    vector_id = f"playbook-{section['section']}-{i}"
    vectors.append({
        'id': vector_id,
        'values': embedding,
        'metadata': {
            'source': 'playbook.md',
            'doc_type': 'playbook',
            'section': section['section'],
            'title': section['title'],
            'text': section['content']
        }
    })

    print(f"  ✓ Embedded: {section['title']}")

# Upsert to Pinecone
print(f"\nUpserting {len(vectors)} vectors to Pinecone index 'spyder-brand'...")
index.upsert(vectors=vectors)
print("✓ Successfully upserted all vectors!")

# Verify
stats = index.describe_index_stats()
print(f"\nIndex stats: {stats['total_vector_count']} total vectors")
