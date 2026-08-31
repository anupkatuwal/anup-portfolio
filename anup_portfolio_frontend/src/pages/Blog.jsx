// src/pages/Blog.jsx — /blog and /blog/<slug>
// Posts live in BLOG_POSTS (src/data/content.js). A `body` entry starting with
// "## " renders as a subheading and "- " as a bullet; everything else is a
// paragraph.
import React from "react";
import { useContent } from "../context/ContentContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { BlogCard } from "../components/BlogCard";
import { formatDate, byNewest } from "../lib/posts";
import { useScrollReveal } from "../lib/useScrollReveal";

function PostBody({ body = [] }) {
  const blocks = [];
  let bullets = [];

  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="bullet-list post-list">
          {bullets.map((b) => <li key={b}>{b}</li>)}
        </ul>
      );
      bullets = [];
    }
  };

  body.forEach((raw) => {
    if (raw.startsWith("- ")) {
      bullets.push(raw.slice(2));
      return;
    }
    flush();
    if (raw.startsWith("## ")) {
      blocks.push(<h3 key={raw} className="post-h3">{raw.slice(3)}</h3>);
    } else {
      blocks.push(<p key={raw.slice(0, 40)} className="post-para">{raw}</p>);
    }
  });
  flush();
  return <>{blocks}</>;
}

function PostPage({ post }) {
  return (
    <article className="container paper">
      <nav className="crumb" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span>{" "}
        <a href="/blog">Blog</a> <span aria-hidden="true">/</span>{" "}
        <span>{post.title}</span>
      </nav>
      <header className="paper-head">
        <h1 className="paper-title">{post.title}</h1>
        <p className="paper-meta">
          {formatDate(post.date)} · {post.readingTime} read
        </p>
        {post.tags?.length > 0 && (
          <ul className="pill-list">
            {post.tags.map((t) => <li key={t} className="pill">{t}</li>)}
          </ul>
        )}
      </header>
      <div className="post-body"><PostBody body={post.body} /></div>
      <p className="paper-back"><a href="/blog">← All posts</a></p>
    </article>
  );
}

function PostIndex({ posts }) {
  return (
    <div className="container paper">
      <nav className="crumb" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Blog</span>
      </nav>
      <header className="paper-head">
        <p className="section-eyebrow">// notes on data, NLP and ethics</p>
        <h1 className="paper-title">Blog</h1>
        <p className="section-lead">
          Short pieces on the things that decide whether a data project works:
          cleaning, fairness metrics, and where features belong.
        </p>
      </header>
      <div className="blog-grid">
        {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
      </div>
    </div>
  );
}

export default function Blog() {
  const { BLOG_POSTS = [] } = useContent();
  useScrollReveal(BLOG_POSTS);
  const posts = [...BLOG_POSTS].sort(byNewest);
  const slug = window.location.pathname.replace(/\/+$/, "").split("/blog/")[1];
  const post = slug ? posts.find((p) => p.slug === slug) : null;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar path="/blog" />
      <main id="main" className="page">
        {slug && !post ? (
          <div className="container paper">
            <h1 className="paper-title">Post not found</h1>
            <p className="section-lead">That post doesn&apos;t exist (yet).</p>
            <p className="paper-back"><a href="/blog">← All posts</a></p>
          </div>
        ) : post ? (
          <PostPage post={post} />
        ) : (
          <PostIndex posts={posts} />
        )}
      </main>
      <Footer />
    </>
  );
}
