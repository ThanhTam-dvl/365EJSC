import React, { useState, useEffect } from "react";

export default function EffectFetch() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);

    fetch("https://jsonplaceholder.typicode.com/posts?_limit=5", { signal: ac.signal })
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(err => {
        if (err.name !== "AbortError") console.error(err);
      })
      .finally(() => setLoading(false));

    const id = setInterval(() => {
      // chỉ in log để minh hoạ effect chạy định kỳ
      console.log("Effect interval tick");
    }, 5000);

    return () => {
      ac.abort();
      clearInterval(id);
      console.log("Effect cleaned up");
    };
  }, []);

  return (
    <div>
      <h2>useEffect — Fetch & Cleanup</h2>
      {loading ? <p>Loading...</p> : null}
      <ul>
        {posts.map(p => (
          <li key={p.id}><strong>{p.title}</strong></li>
        ))}
      </ul>
      <small className="note">Mở console để thấy logs interval & cleanup.</small>
    </div>
  );
}
