import { getPostsForReview, Post } from "@/lib/airtable";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  let posts: Post[] = [];
  let error: string | null = null;

  try {
    posts = await getPostsForReview();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load posts";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-datacolor-dark">
          Posts Awaiting Review
        </h1>
        <p className="text-gray-500 mt-1">
          Review and approve content before publishing
        </p>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">
            Error loading posts
          </div>
          <div className="text-red-500 text-sm">{error}</div>
          <p className="text-gray-500 text-sm mt-4">
            Make sure AIRTABLE_API_KEY and AIRTABLE_BASE_ID are set in your
            environment variables.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h2 className="text-xl font-semibold text-datacolor-dark mb-2">
            No posts awaiting review
          </h2>
          <p className="text-gray-500">
            All caught up! Check back later for new content to review.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 text-sm text-gray-500">
            {posts.length} post{posts.length !== 1 ? "s" : ""} ready for review
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
