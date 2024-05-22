import React, { useState, useEffect } from 'react';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts?page=Home');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Welcome to the Home Page</h1>
      <p>This is a simple example of a Home page.</p>
      <h2>Posts</h2>
      <div>
        {posts.map((post) => (
          <div className="card mb-4 shadow-sm no-border" key={post.id} style={{ maxWidth: '800px', margin: '4em auto' }}>
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

export default Home;