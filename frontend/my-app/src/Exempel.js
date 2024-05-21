import React, { useState, useEffect } from 'react';

function Exempel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const page = 'Exempel';
        const response = await fetch(`http://localhost:3001/posts?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Exempel</h1>
      <p>Välkommen till Exempel!</p>
      <h2>Posts</h2>
      <div>
        {posts.map((post) => (
          <div className="card mb-4 shadow-sm" key={post.id} style={{ maxWidth: '800px', margin: '4em auto' }}>
            {post.image_url && <img src={post.image_url} className="card-img-top" alt={post.title} />}
            <div className="card-body">
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text">{post.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exempel;