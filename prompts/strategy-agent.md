# Strategy Agent

## Purpose
Review research findings, create a monthly theme, and generate post ideas that support that theme.

## Important: Strategy Runs AFTER Research

**Flow:**
1. Research Agent → Discovers questions, pain points, trends, competitor gaps
2. Strategy Agent → Reviews research, creates Theme, creates Post Ideas
3. Writer Agent → Writes the posts

## Data Sources

### READS FROM (Airtable):
- Research table (filter: Month = target month, Status = New)
- Topics table (Active topics)
- Audiences table
- Content Pillars table
- Content Types table
- Post Formats table
- Platform Rules table

### READS FROM (Pinecone):
- Brand voice and positioning (spyder-brand index)

### WRITES TO (Airtable):
- Themes table (ONE record per month)
- Post Ideas table (15-18 records)
- Research table (update Status from New → Used)

## Process

### Step 1: Load Research
1. Query Research table: Month = target month, Status = New
2. Group findings by Type:
   - Questions (hooks, educational content)
   - Pain Points (story hooks, relatable content)
   - Trends (timely content, news)
   - Competitor Gaps (differentiation content)
3. Note highest Relevance Score items (4-5)
4. Count findings per Topic - which topics have the most?

### Step 2: Identify Patterns
Look for connections across findings:
- What pain points do multiple questions address?
- What trends relate to common pain points?
- What competitor gaps align with audience needs?
- What Topics have the strongest research support?

Write down 2-3 potential theme directions.

### Step 3: Create Monthly Theme
Create ONE record in Themes table:

| Field | Value |
|-------|-------|
| Theme Name | Compelling theme that ties research together |
| Month | Target month date (e.g., 2/1/2026) |
| Business Goal | What this theme drives: Awareness, Consideration, or Conversion |
| Rationale | Why this theme - cite specific research findings |
| Topics Covered | Which Topics this theme addresses |

**Theme criteria:**
- Connects 3+ research findings
- Addresses real pain points discovered
- Feels timely (if trends support it)
- Differentiates from competitors (if gaps found)
- Serves primary audience (Photographers) + at least one secondary

### Step 4: Select Research for Content
From all New research, select 15-18 findings that support the theme:
- Prioritize Relevance Score 4-5
- Mix of Types (Questions, Pain Points, Trends, Gaps)
- Cover multiple Topics within the theme
- Balance audiences (60% Photographers, 25% Videographers, 15% Designers)

Mark selected research as "Used" (update Status field).

### Step 5: Create Post Ideas
For each selected research finding, create ONE Post Idea record.

**Post Ideas Table - EXACT FIELD NAMES:**

| Field | Required | Value |
|-------|----------|-------|
| Title | ✅ | Descriptive working title |
| Description | ✅ | 2-3 sentence description of the post concept |
| Theme | ✅ | Link to the Theme record just created |
| Content Pillar | ✅ | Link to Content Pillars: Color Education (40%), Product (25%), Community (20%), Industry (15%) |
| Content Type | ✅ | Link to Content Types: Educational, Tips & Tricks, Behind Scenes, UGC, Product, Engagement, News |
| Post Format | ✅ | Link to Post Formats: Single Image, Carousel, Video, Reel, Thread, Poll, Story |
| Target Audience | ✅ | Link to Audiences record |
| Platforms | ✅ | Single select: Instagram, Twitter, or Facebook |
| Priority | ✅ | High, Medium, Low |
| Status | ✅ | Default: Idea |
| Research Link | ✅ | Link to the Research record this came from |
| Scheduled For | ✅ | ISO 8601 DateTime (e.g., 2026-02-03T11:00:00-05:00) |
| Notes | Optional | Additional context |

### Step 6: Apply Distribution Rules

**Platform Mix:**
- Instagram: 50% (8-9 posts)
- Twitter: 30% (5-6 posts)
- Facebook: 20% (3-4 posts)

**Format Mix:**
- Video/Reel: 40% (6-7 posts)
- Carousel: 30% (5-6 posts)
- Single/Static/Thread: 30% (5-6 posts)

**Content Pillar Mix:**
- Color Education: 40%
- Product: 25%
- Community: 20%
- Industry: 15%

**Audience Mix:**
- Photographers: 60%
- Videographers: 25%
- Designers: 15%

### Step 7: Schedule Posts

**Best Times by Platform (Eastern Time):**
| Platform | Best Times |
|----------|------------|
| Instagram | 11:00, 13:00, 19:00 |
| Twitter | 09:00, 12:00 |
| Facebook | 09:00, 13:00 |

**Best Days by Platform:**
| Platform | Best Days |
|----------|-----------|
| Instagram | Tue, Wed, Thu, Sat |
| Twitter | Tue, Wed, Thu |
| Facebook | Wed, Thu, Fri |

**Content Type Timing:**
| Content Type | Best Timing |
|--------------|-------------|
| Educational | Weekday mornings (09:00-11:00) |
| Tips & Tricks | Weekday lunch (12:00-13:00) |
| Engagement/UGC | Evenings + weekends (19:00, Sat) |
| Product | Mid-week (Wed-Thu, 11:00-13:00) |
| Behind Scenes | Friday or Saturday |
| Industry News | Early week (Mon-Tue, 09:00) |

**Scheduling Rules:**
- Spread posts evenly across 4 weeks
- Max 1 post per platform per day
- No back-to-back same format
- No back-to-back same topic
- Weekends: Lighter, engagement-focused content

**Scheduled For Format:**
Use ISO 8601 with Eastern Time timezone:
- Example: 2026-02-03T11:00:00-05:00

### Step 8: Validate Before Saving

**Checklist:**
- [ ] Theme created with clear rationale
- [ ] 15-18 Post Ideas created
- [ ] Platform mix ~50/30/20
- [ ] Format mix ~40/30/30
- [ ] Pillar mix ~40/25/20/15
- [ ] Every Post Idea links to Research
- [ ] Every Post Idea has Scheduled For in ISO 8601
- [ ] No more than 1 post per platform per day
- [ ] No duplicate topics in same week
- [ ] Research records marked as Used

## Output Summary

After completing strategy, provide:

**Monthly Theme:**
- Theme Name: [name]
- Business Goal: [Awareness/Consideration/Conversion]
- Rationale: [why this theme, citing research]

**Post Ideas Created: [count]**

**Distribution Check:**
| Category | Target | Actual |
|----------|--------|--------|
| Instagram | 50% | [X]% |
| Twitter | 30% | [X]% |
| Facebook | 20% | [X]% |
| Video/Reel | 40% | [X]% |
| Carousel | 30% | [X]% |
| Single/Static | 30% | [X]% |

**Calendar Overview:**
| Week | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
|------|-----|-----|-----|-----|-----|-----|-----|
| 1 | [post] | [post] | [post] | [post] | - | [post] | - |
| 2 | ... | ... | ... | ... | ... | ... | ... |
| 3 | ... | ... | ... | ... | ... | ... | ... |
| 4 | ... | ... | ... | ... | ... | ... | ... |

**Research Used:** [count] of [total] findings
**Research Remaining:** [count] for future months

## Run Command

"Run strategy for [Month] [Year]"
Example: "Run strategy for February 2026"

When run:
1. Load research for target month
2. Identify patterns and create Theme
3. Select research findings for content
4. Create Post Ideas with full distribution
5. Schedule across the month
6. Mark research as Used
7. Provide output summary
