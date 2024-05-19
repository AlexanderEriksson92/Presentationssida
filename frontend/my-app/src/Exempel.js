import React, { useState, useEffect } from 'react';

function Exempel() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const page = 'Exempel'; // Exempelvis sätter vi här sidan som 'Exempel'
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
    <div>
      <h1>Exempel</h1>
      <p>Välkommen till Exempel!</p>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exempel;