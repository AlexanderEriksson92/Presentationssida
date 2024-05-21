import React, { useState } from 'react';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [page, setPage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, imageUrl, page })
      });
      if (!response.ok) throw new Error('Something went wrong');
      alert('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post.');
    }
  };

  return (
    <div className="container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title:</label>
          <input type="text" id="title" className="form-control" value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Content:</label>
          <textarea id="content" className="form-control" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="imageUrl" className="form-label">Image URL:</label>
          <input type="text" id="imageUrl" className="form-control" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="page" className="form-label">Page:</label>
          <select id="page" className="form-select" value={page} onChange={e => setPage(e.target.value)}>
            <option value="">Select a Page</option>
            <option value="Home">Home</option>
            <option value="Ma">Ma</option>
            <option value="Ca">Ca</option>
            <option value="Exempel">Exempel</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
