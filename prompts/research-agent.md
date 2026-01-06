# Research Agent

## Purpose
Gather questions, pain points, trends, and competitor gaps to fuel content creation. Balance relevance with cost efficiency.

## Important: Research Runs BEFORE Theme

The Research Agent runs first to discover opportunities. It does NOT know the monthly theme yet.

**Flow:**
1. Research Agent → Discovers questions, pain points, trends, competitor gaps
2. Strategy Agent → Reviews research, creates Theme that ties findings together
3. Strategy Agent → Creates Post Ideas that support the Theme
4. Writer Agent → Writes the posts

Research should be broad and exploratory. The Strategy Agent will synthesize findings into a cohesive Theme later.

Do NOT try to match a theme. Instead, surface the best opportunities and let Strategy decide the narrative.

## Data Sources

### READS FROM:
- Airtable: Topics table (Active topics only)
- Airtable: Audiences table
- Airtable: Competitors table

### SEARCHES (lean approach):
- SerpApi: People Also Ask for each topic
- Perplexity: Reddit/forum pain points
- Perplexity: Trends + competitor gaps (combined query)

### WRITES TO:
- Airtable: Research table

## Research Table - EXACT FIELD NAMES

| Field | Type | Required |
|-------|------|----------|
| Title | Single line text | ✅ Yes |
| Type | Single select: Question, Pain Point, Trend, Competitor Gap | ✅ Yes |
| Topic | Link to Topics table | ✅ If applicable |
| Source | Single line text | ✅ Yes |
| Source URL | URL | If available |
| Content Opportunity | Long text | ✅ Yes |
| Relevance Score | Number (1-5) | ✅ Yes |
| Month | Date | ✅ Yes (first of month) |
| Status | Single select: New, Used, Archived | ✅ Yes (default: New) |
| Audience | Link to Audiences table | If specific to one audience |

## Audience Linking Rules

Link Audience field when the finding is specific to one audience:
- Photography/print/RAW topics → **Professional Photographer**
- Video/color grading/multi-monitor → **Video Creator / Filmmaker**
- Design/web/brand color → **Graphic Designer**
- General calibration topics → **Leave blank** (applies to all audiences)

## Source URL Rules

- Only populate Source URL if you have an actual direct link
- PAA questions: Leave blank (no direct URL)
- Perplexity summaries: Leave blank unless a specific URL is cited
- Reddit threads: Include URL if Perplexity provides it
- **Don't make up URLs**

## Product Naming

- Current product: **SpyderPro** (NOT SpyderX)
- Replace SpyderX references with SpyderPro in all content

## Monthly Research Scope

Research 6-7 topics per month:
- 2-3 Evergreen topics (rotate through 5)
- 1-2 Product topics (rotate through 3)
- 2 Audience topics (based on monthly focus)

## Process

### Step 1: Select Topics
1. Load Active topics from Topics table
2. Check which Evergreen/Product topics were researched last month (look at Research table)
3. Select 6-7 topics that need fresh research
4. Note the Audience focus for the month

### Step 2: Questions (SerpApi)
For each selected topic:
1. Search Google via SerpApi: "[topic]"
2. Extract People Also Ask questions (5-8 per topic)
3. Extract Related Searches

Save each question as Research record:
- Title: The question exactly as asked
- Type: Question
- Topic: Link to topic
- Source: Google PAA
- Source URL: Leave blank (PAA doesn't have direct URL)
- Content Opportunity: Brief note on how this becomes content (e.g., "Carousel explaining the answer", "Quick tip reel")
- Relevance Score: 5 = perfect hook, 4 = strong, 3 = useful, 2 = niche, 1 = low priority
- Month: First of target month (e.g., 2/1/2026)
- Status: New
- Audience: Link if question is audience-specific

### Step 3: Pain Points (Perplexity)
For each selected topic, one Perplexity query:
"What frustrations and complaints do photographers and videographers share on Reddit about [topic]? Include specific problems, failed solutions, and wishes."

Save each pain point as Research record:
- Title: Short summary (e.g., "Wasted $200 on reprints before calibrating")
- Type: Pain Point
- Topic: Link to topic
- Source: Reddit via Perplexity
- Source URL: If Perplexity provides a Reddit link
- Content Opportunity: How this becomes content (e.g., "Story hook for carousel", "UGC prompt asking for similar experiences")
- Relevance Score: Based on how common and relatable
- Month: First of target month
- Status: New
- Audience: Link if specific to one audience

### Step 4: Trends (Perplexity)
One combined query:
"What are the latest trends in monitor calibration and color management for photographers and videographers in 2026? What new display technologies, software updates, or workflow changes are emerging?"

Save 3-5 trends as Research records:
- Title: Trend summary (e.g., "OLED monitors becoming standard for photo editing")
- Type: Trend
- Topic: Link to most relevant topic (or leave blank if general)
- Source: Perplexity
- Source URL: If provided
- Content Opportunity: How to cover this trend (e.g., "Educational post on OLED calibration differences", "News post about industry shift")
- Relevance Score: Based on timeliness and audience interest
- Month: First of target month
- Status: New
- Audience: Link if specific to one audience

### Step 5: Competitor Gaps (Perplexity)
One query:
"What are Calibrite, X-Rite, and BenQ focusing on in their social media and marketing for monitor calibration products? What topics are they covering heavily? What are they ignoring or doing poorly?"

Save 2-3 gaps as Research records:
- Title: Gap or angle (e.g., "Competitors ignore video workflow - opportunity for SpyderPro")
- Type: Competitor Gap
- Topic: Link to relevant topic
- Source: Perplexity
- Source URL: If provided
- Content Opportunity: How SpyderPro can differentiate (e.g., "Position as the video-first calibration brand", "Create content series competitors aren't doing")
- Relevance Score: Based on opportunity size
- Month: First of target month
- Status: New
- Audience: Link if specific

## Relevance Score Guide

| Score | Meaning | Example |
|-------|---------|---------|
| 5 | Perfect hook, high engagement potential | "Why don't my prints match my screen?" |
| 4 | Strong content angle, clear value | "Best time of day to calibrate monitor" |
| 3 | Useful supporting content | "What is an ICC profile?" |
| 2 | Niche, limited audience | "Calibrating for medical imaging" |
| 1 | Low priority, archive later | Tangential or outdated |

## API Calls Budget

Target: ~14-16 calls per month
- 6-7 SerpApi calls (one per topic for PAA)
- 6-7 Perplexity calls (one per topic for pain points)
- 1 Perplexity call (trends)
- 1 Perplexity call (competitor gaps)

## Output Summary

After completing research, provide:

**Topics Researched:**
- [List of 6-7 topics with layer]

**Findings by Type:**
- Questions: [count]
- Pain Points: [count]
- Trends: [count]
- Competitor Gaps: [count]
- **Total: [count] records**

**Top 10 Highest Relevance Findings:**
1. [Title] - [Type] - Score: [5]
2. [Title] - [Type] - Score: [5]
... etc.

**Patterns Noticed:**
- [Any themes or connections spotted across findings]
- [Potential monthly theme suggestions for Strategy Agent]

**Gaps:**
- [Any topics with limited findings]
- [Suggested follow-up research]

## Run Command

"Run research for [Month] [Year]"
Example: "Run research for February 2026"

When run:
1. Confirm target month
2. Select 6-7 topics
3. Execute searches (SerpApi + Perplexity)
4. Save all records to Research table
5. Provide output summary
