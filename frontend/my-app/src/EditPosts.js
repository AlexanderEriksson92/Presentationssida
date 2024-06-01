import React, { useState, useEffect } from 'react';
import { useLogin } from './LoginCheck';

function EditPosts() {
  const { user } = useLogin();
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPostId, setEditingPostId] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newTextContent, setNewTextContent] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newListContent, setNewListContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPostId(post.id);
    setNewTitle(post.title);
    setNewTextContent(post.text_content);
    setNewImageUrl(post.image_url);
    setNewListContent(post.list_content ? JSON.parse(post.list_content).join(',') : '');
  };

  const handleSave = async (id) => {
    if (!newTitle) {
      console.error('Title is required');
      return;
    }
    const postData = {
      title: newTitle,
      text_content: newTextContent,
      image_url: newImageUrl,
      list_content: newListContent ? JSON.stringify(newListContent.split(',')) : '',
    };

    try {
      const apikey = user?.token?.apikey; // Hämtar endast API-nyckeln
      if (!apikey) {
        throw new Error('No API key found in user context');
      }

      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apikey}` 
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) throw new Error('Failed to update post');

      setPosts(posts.map(post => (post.id === id ? { ...post, ...postData } : post)));
      setEditingPostId(null);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Är du säker på att du vill radera detta inlägg?');
    if (!confirmDelete) return;

    try {
      const apikey = user?.token?.apikey; // Hämtar endast API-nyckeln
      if (!apikey) {
        throw new Error('No API key found in user context');
      }

      const response = await fetch(`http://localhost:3001/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apikey}` // Använder API-nyckeln här
        }
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
    setNewTextContent('');
    setNewImageUrl('');
    setNewListContent('');
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.text_content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (post.image_url && post.image_url.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (post.list_content && JSON.parse(post.list_content).some(item => item.toLowerCase().includes(searchTerm.toLowerCase())))
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
                  placeholder="Title"
                />
                <textarea
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Text content"
                />
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="form-control mb-2"
                  placeholder="Image URL"
                />
                <input
                  type="text"
                  value={newListContent}
                  onChange={(e) => setNewListContent(e.target.value)}
                  className="form-control mb-2"
                  placeholder="List items (comma separated)"
                />
                <button className="btn btn-success mr-2" onClick={() => handleSave(post.id)}>Save</button>
                <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
              </div>
            ) : (
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.text_content}</p>
                {post.image_url && <img src={post.image_url} className="card-img-top" alt={post.title} />}
                {post.list_content && (
                  <ul className="card-text">
                    {JSON.parse(post.list_content).map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
                <button className="btn btn-primary m-1" onClick={() => handleEdit(post)}>Edit</button>
                <button className="btn btn-danger m-1" onClick={() => handleDelete(post.id)}>Delete</button>
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
