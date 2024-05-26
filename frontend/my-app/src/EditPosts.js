import React, { useState, useEffect } from 'react';

function EditPosts() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      console.log('Fetched posts:', data); // Log posts
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewContent(post.content);
    setNewImageUrl(post.image_url);
  };

  const handleSave = async (id) => {
    if (!newTitle || !newContent) {
      console.error('Title and content are required');
      return;
    }
  
    const postData = {
      title: newTitle,
      content: newContent,
    };
  
    if (newImageUrl !== '') {
      postData.imageUrl = newImageUrl;
    }
  
    console.log('Saving post with id:', id); // Lägg till loggning för att verifiera sparningsprocessen
    console.log('Data being sent:', postData); // Logga data som skickas
  
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      if (!response.ok) throw new Error('Failed to update post');
  
      setPosts(posts.map(post => (post.id === id ? { ...post, ...postData, image_url: newImageUrl } : post)));
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleCancel = () => {
    setEditingPostId(null);
    setNewTitle('');
    setNewContent('');
    setNewImageUrl('');
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h1>Edit Posts</h1>
      <input
        type="text"
        placeholder="Search posts"
        className="form-control mb-4"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredPosts.length > 0 ? (
        filteredPosts.map(post => (
          <div key={post.id} className="card mb-4 shadow-sm">
            {editingPostId === post.id ? (
              <div className="card-body">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-control mb-2"
                />
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="form-control mb-2"
                />
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Image URL"
                />
                <button className="btn btn-success" onClick={() => handleSave(post.id)}>Save</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.content}</p>
                {post.image_url && <img src={post.image_url} className="card-img-top" alt={post.title} />}
                <button className="btn btn-primary" onClick={() => handleEdit(post)}>Edit</button>
                <button className="btn btn-danger" onClick={() => handleDelete(post.id)}>Delete</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}

export default EditPosts;
