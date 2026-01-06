import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/airtable";
import PlatformIcon from "./PlatformIcon";
import FormatBadge from "./FormatBadge";

interface PostCardProps {
  post: Post;
}

function formatDate(dateString: string): string {
  if (!dateString) return "Not scheduled";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function PostCard({ post }: PostCardProps) {
  const platform = post.platforms?.[0] || "Unknown";
  const format = post.postFormat?.[0] || "Post";
  const hasImages = post.images && post.images.length > 0;

  return (
    <Link href={`/post/${post.id}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-datacolor-blue transition-all duration-200 cursor-pointer group">
        {/* Image preview area */}
        <div className="relative h-32 bg-gray-100">
          {hasImages ? (
            <Image
              src={post.images![0].thumbnails?.large?.url || post.images![0].url}
              alt={post.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-200">
              <svg
                className="w-8 h-8 text-gray-400 mb-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-xs text-gray-500 font-medium">No image yet</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <PlatformIcon platform={platform} />
            <FormatBadge format={format} />
          </div>

          <h3 className="font-semibold text-datacolor-dark text-base mb-2 group-hover:text-datacolor-blue transition-colors line-clamp-2">
            {post.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(post.scheduledFor)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
