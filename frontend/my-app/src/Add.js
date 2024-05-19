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
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <label>
        Content:
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </label>
      <label>
        Image URL:
        <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </label>
      <label>
        Page:
        <select value={page} onChange={e => setPage(e.target.value)}>
          <option value="">Select a Page</option>
          <option value="Ma">Ma</option>
          <option value="Ca">Ca</option>
          <option value="Exempel">Exempel</option>
        </select>
      </label>
      <button type="submit">Create Post</button>
    </form>
  );
}

export default CreatePost;
