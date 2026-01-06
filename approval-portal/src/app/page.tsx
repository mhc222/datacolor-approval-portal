"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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

interface Post {
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

function getPlatformIcon(platform: string): string {
  const p = platform.toLowerCase();
  if (p.includes("instagram")) return "📸";
  if (p.includes("twitter") || p.includes("x")) return "𝕏";
  if (p.includes("facebook")) return "📘";
  if (p.includes("linkedin")) return "💼";
  if (p.includes("tiktok")) return "🎵";
  return "📱";
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

function getContentForPlatform(post: Post): string {
  const platform = post.platforms?.[0]?.toLowerCase() || "";
  if (platform.includes("instagram")) return post.contentInstagram || "";
  if (platform.includes("twitter")) return post.contentTwitter || "";
  if (platform.includes("facebook")) return post.contentFacebook || "";
  return post.contentInstagram || post.contentTwitter || post.contentFacebook || "";
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [revisionComment, setRevisionComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch("/api/posts");
      if (!response.ok) throw new Error("Failed to fetch posts");
      const data = await response.json();
      setPosts(data);
      if (data.length > 0) {
        setSelectedPost(data[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove() {
    if (!selectedPost) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/posts/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedPost.id, status: "Approved" }),
      });
      if (!response.ok) throw new Error("Failed to approve post");
      // Remove from list and select next
      const newPosts = posts.filter((p) => p.id !== selectedPost.id);
      setPosts(newPosts);
      setSelectedPost(newPosts[0] || null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to approve post");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRequestRevision() {
    if (!selectedPost) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/posts/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedPost.id,
          status: "Needs Revision",
          comment: revisionComment,
        }),
      });
      if (!response.ok) throw new Error("Failed to request revision");
      // Remove from list and select next
      const newPosts = posts.filter((p) => p.id !== selectedPost.id);
      setPosts(newPosts);
      setSelectedPost(newPosts[0] || null);
      setShowModal(false);
      setRevisionComment("");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to request revision");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          <div className="red-bar"></div>
          <span className="brand-text">datacolor</span>
        </div>
        <span className="header-subtitle">Content Approval</span>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Posts for Review</h2>
            <div className="count">
              {posts.length} post{posts.length !== 1 ? "s" : ""} pending
            </div>
          </div>
          <div className="post-list">
            {loading ? (
              <div className="loading">Loading posts...</div>
            ) : error ? (
              <div className="empty-state">
                <div className="icon">⚠️</div>
                <h2>Error loading posts</h2>
                <p>{error}</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🎉</div>
                <h2>All caught up!</h2>
                <p>No posts awaiting review</p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className={`post-item ${selectedPost?.id === post.id ? "selected" : ""}`}
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="post-title">
                    <span className="platform-icon">
                      {getPlatformIcon(post.platforms?.[0] || "")}
                    </span>
                    {post.title}
                  </div>
                  <div className="post-meta">
                    <span className="format-badge">{post.postFormat?.[0] || "Post"}</span>
                    <span>{formatDate(post.scheduledFor)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Content Panel */}
        <div className="content-panel">
          {selectedPost ? (
            <>
              <div className="content-scroll">
                <div className="content-card">
                  <div className="content-header">
                    <h1>{selectedPost.title}</h1>
                    <div className="meta">
                      <span>
                        {getPlatformIcon(selectedPost.platforms?.[0] || "")}{" "}
                        {selectedPost.platforms?.join(", ") || "No platform"}
                      </span>
                      <span>📅 {formatDate(selectedPost.scheduledFor)}</span>
                      <span>📋 {selectedPost.postFormat?.[0] || "Post"}</span>
                    </div>
                  </div>
                  <div className="content-body">
                    {/* Images */}
                    {selectedPost.images && selectedPost.images.length > 0 && (
                      <div className="content-section">
                        <h3>Images</h3>
                        <div className="image-grid">
                          {selectedPost.images.map((img, idx) => (
                            <Image
                              key={img.id || idx}
                              src={img.thumbnails?.large?.url || img.url}
                              alt={`Image ${idx + 1}`}
                              width={300}
                              height={300}
                              style={{ objectFit: "cover" }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    {getContentForPlatform(selectedPost) && (
                      <div className="content-section">
                        <h3>Caption</h3>
                        <div className="text-content">
                          {getContentForPlatform(selectedPost)}
                        </div>
                      </div>
                    )}

                    {/* Slides (for carousels) */}
                    {selectedPost.slides && selectedPost.slides.length > 0 && (
                      <div className="content-section">
                        <h3>Slides</h3>
                        <div className="slides-container">
                          {selectedPost.slides.map((slide, idx) => (
                            <div key={idx} className="slide-item">
                              <div className="slide-number">Slide {idx + 1}</div>
                              <div className="slide-content">{slide}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Hashtags */}
                    {selectedPost.hashtags && (
                      <div className="content-section">
                        <h3>Hashtags</h3>
                        <div className="hashtags">
                          {selectedPost.hashtags.split(/\s+/).map((tag, idx) => (
                            <span key={idx} className="hashtag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Image Ideas */}
                    {selectedPost.imageIdeas && (
                      <div className="content-section">
                        <h3>Image Ideas</h3>
                        <div className="text-content">{selectedPost.imageIdeas}</div>
                      </div>
                    )}

                    {/* Image Prompts */}
                    {selectedPost.imagePrompts && (
                      <div className="content-section">
                        <h3>Image Prompts</h3>
                        <div className="text-content">{selectedPost.imagePrompts}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="action-bar">
                <button
                  className="btn btn-outline"
                  onClick={() => setShowModal(true)}
                  disabled={submitting}
                >
                  Request Revision
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleApprove}
                  disabled={submitting}
                >
                  {submitting ? "..." : "Approve"}
                </button>
              </div>
            </>
          ) : (
            <div className="content-scroll">
              <div className="empty-state">
                <div className="icon">📋</div>
                <h2>No post selected</h2>
                <p>Select a post from the sidebar to preview</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">Powered by JSB Media</footer>

      {/* Revision Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Request Revision</h2>
            </div>
            <div className="modal-body">
              <textarea
                placeholder="Add notes about what needs to be changed..."
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                autoFocus
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleRequestRevision}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
