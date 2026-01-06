const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const POSTS_TABLE_ID = "tblLmGVahsBF7uJlY";

const AIRTABLE_API_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${POSTS_TABLE_ID}`;

interface AirtableAttachment {
  id: string;
  url: string;
  filename: string;
  type?: string;
  thumbnails?: {
    small?: { url: string };
    large?: { url: string };
  };
}

export interface Post {
  id: string;
  title: string;
  status: string;
  contentStatus: string;
  platforms: string[];
  postFormat: string[];
  scheduledFor: string;
  contentInstagram?: string;
  contentTwitter?: string;
  contentFacebook?: string;
  hashtags?: string;
  slides: string[];
  slideCount?: number;
  videoType?: string;
  videoLength?: string;
  imageIdeas?: string;
  imagePrompts?: string;
  theme?: string[];
  contentPillar?: string[];
  contentType?: string[];
  images?: AirtableAttachment[];
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

function transformRecord(record: AirtableRecord): Post {
  const fields = record.fields;
  return {
    id: record.id,
    title: (fields["Title"] as string) || "",
    status: (fields["Status"] as string) || "",
    contentStatus: (fields["Content Status"] as string) || "",
    platforms: (fields["Platforms"] as string[]) || [],
    postFormat: (fields["Post Format"] as string[]) || [],
    scheduledFor: (fields["Scheduled For"] as string) || "",
    contentInstagram: fields["Content - Instagram"] as string | undefined,
    contentTwitter: fields["Content - Twitter"] as string | undefined,
    contentFacebook: fields["Content - Facebook"] as string | undefined,
    hashtags: fields["Hashtags"] as string | undefined,
    slides: [
      fields["Slide 1"],
      fields["Slide 2"],
      fields["Slide 3"],
      fields["Slide 4"],
      fields["Slide 5"],
      fields["Slide 6"],
      fields["Slide 7"],
      fields["Slide 8"],
    ].filter(Boolean) as string[],
    slideCount: fields["Slide Count"] as number | undefined,
    videoType: fields["Video Type"] as string | undefined,
    videoLength: fields["Video Length"] as string | undefined,
    imageIdeas: fields["Image Ideas"] as string | undefined,
    imagePrompts: fields["Image Prompts"] as string | undefined,
    theme: fields["Theme"] as string[] | undefined,
    contentPillar: fields["Content Pillar"] as string[] | undefined,
    contentType: fields["Content Type"] as string[] | undefined,
    images: fields["Images"] as AirtableAttachment[] | undefined,
  };
}

export async function getPostsForReview(): Promise<Post[]> {
  const filterFormula = encodeURIComponent(`{Content Status} = "Review"`);
  const sortField = encodeURIComponent("Scheduled For");

  const url = `${AIRTABLE_API_URL}?filterByFormula=${filterFormula}&sort[0][field]=${sortField}&sort[0][direction]=asc`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const data = await response.json();
  return data.records.map(transformRecord);
}

export async function getPostById(id: string): Promise<Post | null> {
  const url = `${AIRTABLE_API_URL}/${id}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Airtable API error: ${response.status}`);
  }

  const record = await response.json();
  return transformRecord(record);
}

export async function updatePostStatus(
  id: string,
  contentStatus: string,
  comment?: string
): Promise<void> {
  const fields: Record<string, string> = {
    "Content Status": contentStatus,
  };

  // Add comment to Revision Notes field if provided
  if (comment) {
    fields["Revision Notes"] = comment;
  }

  const response = await fetch(`${AIRTABLE_API_URL}/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${AIRTABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Airtable API error: ${JSON.stringify(error)}`);
  }
}
