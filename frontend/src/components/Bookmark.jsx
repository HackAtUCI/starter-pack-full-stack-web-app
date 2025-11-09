// Bookmark.jsx
import React, { useState, useEffect, useRef } from "react";

const STORAGE_KEY = "my_bookmarks_v1";

const defaultBookmarks = [
  // optional starter bookmarks; remove if you want empty by default
  { id: 1, title: "Example", url: "https://example.com", fav: false },
];

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : defaultBookmarks;
    } catch {
      return defaultBookmarks;
    }
  });
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const urlRef = useRef();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch {}
  }, [bookmarks]);

  function addBookmark(e) {
    e.preventDefault();
    const trimmedUrl = url.trim();
    const trimmedTitle = title.trim() || trimmedUrl;
    if (!trimmedUrl) {
      urlRef.current?.focus();
      return;
    }
    const normalizedUrl = normalizeUrl(trimmedUrl);
    const newBm = {
      id: Date.now(),
      title: trimmedTitle,
      url: normalizedUrl,
      fav: false,
    };
    setBookmarks((s) => [newBm, ...s]);
    setTitle("");
    setUrl("");
  }

  function normalizeUrl(value) {
    try {
      const u = new URL(value);
      return u.href;
    } catch {
      return "https://" + value;
    }
  }

  function removeBookmark(id) {
    setBookmarks((s) => s.filter((b) => b.id !== id));
  }

  function toggleFav(id) {
    setBookmarks((s) => s.map((b) => (b.id === id ? { ...b, fav: !b.fav } : b)));
  }

  return (
    <div className="bm-root" aria-live="polite">
      <form className="bm-form" onSubmit={addBookmark}>
        <input
          className="bm-input"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-label="Bookmark title"
        />
        <input
          ref={urlRef}
          className="bm-input"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          aria-label="Bookmark URL"
        />
        <button type="submit" className="bm-add">
          Add
        </button>
      </form>

      <div className="bm-list-wrap">
        <h2 className="bm-heading">Bookmarks</h2>

        {bookmarks.length === 0 ? (
          <p className="bm-empty">No bookmarks yet.</p>
        ) : (
          <ul className="bm-list">
            {bookmarks.map((b) => (
              <li key={b.id} className={`bm-item ${b.fav ? "fav" : ""}`}>
                <div className="bm-left">
                  <button
                    onClick={() => toggleFav(b.id)}
                    aria-label={b.fav ? "Unfavorite" : "Favorite"}
                    className="bm-fav-btn"
                    title={b.fav ? "Unfavorite" : "Favorite"}
                  >
                    {b.fav ? "★" : "☆"}
                  </button>

                  <div className="bm-meta">
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bm-link"
                    >
                      {b.title}
                    </a>
                    <div className="bm-url">{b.url}</div>
                  </div>
                </div>

                <div className="bm-actions">
                  <button
                    onClick={() => window.open(b.url, "_blank", "noopener")}
                    className="bm-visit"
                    aria-label={`Open ${b.title}`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => removeBookmark(b.id)}
                    className="bm-del"
                    aria-label={`Delete ${b.title}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
