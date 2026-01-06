# Datacolor Spyder Content Approval Portal

A Next.js application for reviewing and approving social media content before publishing.

## Features

- **Gallery View**: Browse all posts awaiting review, sorted by scheduled date
- **Post Detail View**: View full post content including:
  - Platform-specific content (Instagram, Twitter, Facebook)
  - Carousel slides
  - Video scripts with timestamps
  - Thread tweets
  - Image ideas and AI generation prompts
- **Approval Actions**: Approve posts or request revisions with comments
- **Datacolor Branding**: Clean, professional design with Datacolor brand colors

## Setup

### 1. Install Dependencies

```bash
cd approval-portal
npm install
```

### 2. Configure Environment Variables

Edit `.env.local` and add your Airtable API key:

```
AIRTABLE_API_KEY=your_airtable_api_key_here
AIRTABLE_BASE_ID=appCtqIYV7DsDeSb0
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

## Usage

### For Content Reviewers

1. Visit the home page to see all posts with "Ready for Review" status
2. Click a post card to view full details
3. Review the content, slides, and image prompts
4. Add optional feedback in the comments field
5. Click **Approve** or **Request Revision**

### Post Status Flow

```
Draft → Ready for Review → Approved / Revision Requested
```

## Airtable Integration

The portal reads from and writes to the Posts table:

**Reads:**
- Title, Platform, Post Format, Scheduled For
- Content - Instagram/Twitter/Facebook
- Hashtags, Slides 1-8, Slide Count
- Video Type, Video Length
- Image Ideas, Image Prompts

**Writes:**
- Content Status (Approved / Revision Requested)
- Revision Notes (from comments)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Airtable API

## Branding

- Primary: #00A3E0 (Datacolor Blue)
- Secondary: #1A1A1A (Dark)
- Accent: #F7941D (Orange for CTAs)

---

Powered by JSB Media
