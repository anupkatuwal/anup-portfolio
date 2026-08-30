// src/components/BlogCard.jsx — one post preview, shared by the homepage
// teaser and the /blog index.
import React from "react";
import { formatDate } from "../lib/posts";

export function BlogCard({ post }) {
  return (
    <article className="card blog-card">
      <p className="blog-meta">{formatDate(post.date)} · {post.readingTime} read</p>
      <h3 className="card-title">
        <a href={`/blog/${post.slug}`}>{post.title}</a>
      </h3>
      <p className="card-text">{post.excerpt}</p>
      {post.tags?.length > 0 && (
        <ul className="pill-list">
          {post.tags.map((t) => <li key={t} className="pill">{t}</li>)}
        </ul>
      )}
      <p className="blog-more"><a href={`/blog/${post.slug}`}>Read post →</a></p>
    </article>
  );
}
