import { getPostById } from "@/lib/airtable";
import { notFound } from "next/navigation";
import Link from "next/link";
import PlatformIcon from "@/components/PlatformIcon";
import FormatBadge from "@/components/FormatBadge";
import PostActions from "@/components/PostActions";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: { id: string };
}

function formatDate(dateString: string): string {
  if (!dateString) return "Not scheduled";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostById(params.id);

  if (!post) {
    notFound();
  }

  const platform = post.platforms?.[0] || "Unknown";
  const format = post.postFormat?.[0] || "Post";
  const isCarousel = format === "Carousel";
  const isVideo = format === "Video" || format === "Reel";
  const isThread = format === "Thread";

  // Get the right content based on platform
  const content =
    platform === "Instagram"
      ? post.contentInstagram
      : platform === "Twitter"
        ? post.contentTwitter
        : post.contentFacebook;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-datacolor-blue mb-6 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Gallery
      </Link>

      {/* Title */}
      <h1 className="text-3xl font-bold text-datacolor-dark mb-6">
        {post.title}
      </h1>

      {/* Metadata Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <PlatformIcon platform={platform} size="lg" />
            <span className="font-medium text-datacolor-dark">{platform}</span>
          </div>
          <div className="h-6 w-px bg-gray-200"></div>
          <FormatBadge format={format} />
          <div className="h-6 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
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

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
          {platform === "Twitter" && isThread ? "First Tweet" : "Caption"}
        </h2>
        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-800 leading-relaxed">
          {content || "No content available"}
        </div>

        {/* Hashtags for Instagram */}
        {platform === "Instagram" && post.hashtags && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Hashtags</h3>
            <div className="text-datacolor-blue">{post.hashtags}</div>
          </div>
        )}
      </div>

      {/* Slides Section for Carousel */}
      {isCarousel && post.slides.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
            Carousel Slides ({post.slideCount || post.slides.length})
          </h2>
          <div className="space-y-4">
            {post.slides.map((slide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-datacolor-blue text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    Slide {index + 1}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-gray-800 pl-9">
                  {slide}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Script Section for Video/Reel */}
      {isVideo && post.slides.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
            Video Script ({post.slideCount || post.slides.length} scenes)
          </h2>

          {/* Video metadata */}
          {(post.videoType || post.videoLength) && (
            <div className="flex gap-4 mb-4 text-sm">
              {post.videoType && (
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full">
                  {post.videoType}
                </span>
              )}
              {post.videoLength && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                  {post.videoLength}
                </span>
              )}
            </div>
          )}

          <div className="space-y-4">
            {post.slides.map((slide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    Scene {index + 1}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-gray-800 pl-9">
                  {slide}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thread Section */}
      {isThread && post.slides.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
            Thread ({post.slideCount || post.slides.length} tweets)
          </h2>
          <div className="space-y-4">
            {post.slides.map((slide, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-black text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-500">
                    Tweet {index + 1}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-gray-800 pl-9">
                  {slide}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image Ideas Section */}
      {post.imageIdeas && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
            Image Ideas
          </h2>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 whitespace-pre-wrap text-gray-800">
            {post.imageIdeas}
          </div>
        </div>
      )}

      {/* Image Prompts Section */}
      {post.imagePrompts && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-datacolor-dark mb-4">
            Image Prompts (AI Generation)
          </h2>
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 whitespace-pre-wrap text-gray-800 text-sm font-mono">
            {post.imagePrompts}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <PostActions postId={post.id} />
    </div>
  );
}
