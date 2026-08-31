// src/components/BlogSection.jsx — the two most recent posts on the homepage.
import React from "react";
import { Section } from "./Section";
import { useContent } from "../context/ContentContext";
import { BlogCard } from "./BlogCard";
import { byNewest } from "../lib/posts";

export function BlogSection() {
  const { BLOG_POSTS = [] } = useContent();
  if (!BLOG_POSTS.length) return null;
  const recent = [...BLOG_POSTS].sort(byNewest).slice(0, 2);

  return (
    <Section id="blog" title="From the blog" eyebrow="// writing">
      <p className="section-lead">
        Notes on data cleaning, AI ethics and feature engineering.
      </p>
      <div className="blog-grid">
        {recent.map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
      <p className="blog-more"><a href="/blog">All posts →</a></p>
    </Section>
  );
}
