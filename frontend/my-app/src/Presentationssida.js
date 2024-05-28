import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Presentationssida = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts?page=Presentationssida');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        // Sortera poster baserat på position
        data.sort((a, b) => a.position - b.position);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Presentationssida</h1>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div key={post.id} className="card mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3>{post.title}</h3>
            {post.text_content && <p>{post.text_content}</p>}
            {post.image_url && <img src={post.image_url} className="img-fluid" alt={post.title} />}
            {post.list_content && (
              <ul>
                {JSON.parse(post.list_content).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        ))
      ) : (
        <p>Inga inlägg att visa.</p>
      )}
    </div>
  );
};

export default Presentationssida;
