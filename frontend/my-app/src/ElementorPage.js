import React, { useState } from 'react';
import {
  ImageComponent,
  TextComponent,
  ListComponent,
  HeaderComponent
} from './ContentComponents';

const ElementorPage = () => {
  const [elements, setElements] = useState([]);
  const [title, setTitle] = useState('');
  const [page, setPage] = useState('');

  const addElement = (type) => {
    let element = { type, content: '' };

    switch (type) {
      case 'image':
        element.content = prompt('Enter image URL:');
        break;
      case 'text':
        element.content = prompt('Enter text:');
        break;
      case 'list':
        element.content = prompt('Enter list items separated by commas:').split(',');
        break;
      case 'header':
        element.content = prompt('Enter header text:');
        break;
      default:
        break;
    }

    if (element.content && element.content.length > 0) {
      setElements([...elements, element]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = elements.map((element, index) => ({
      ...element,
      id: index
    }));

    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, page })
      });
      if (!response.ok) throw new Error('Something went wrong');
      alert('Post created successfully!');
      setTitle('');
      setPage('');
      setElements([]);
    } catch (error) {
      alert('Failed to create post.');
    }
  };

  return (
    <div className="container">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter post title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Enter page content"
            value={page}
            onChange={(e) => setPage(e.target.value)}
            required
          />
        </div>
        
        <button type="button" className="btn btn-primary me-2" onClick={() => addElement('image')}>Add Image</button>
        <button type="button" className="btn btn-secondary me-2" onClick={() => addElement('text')}>Add Text</button>
        <button type="button" className="btn btn-success me-2" onClick={() => addElement('list')}>Add List</button>
        <button type="button" className="btn btn-info me-2" onClick={() => addElement('header')}>Add Header</button>

        <div className="mt-4">
          {elements.map((element, index) => {
            if (!element.content || (Array.isArray(element.content) && element.content.length === 0)) {
              return null;
            }

            switch (element.type) {
              case 'image':
                return (
                  <div className="card mb-3" key={index}>
                    <div className="card-body">
                      <ImageComponent src={element.content} />
                    </div>
                  </div>
                );
              case 'text':
                return (
                  <div className="card mb-3" key={index}>
                    <div className="card-body">
                      <TextComponent text={element.content} />
                    </div>
                  </div>
                );
              case 'list':
                return (
                  <div className="card mb-3" key={index}>
                    <div className="card-body">
                      <ListComponent items={element.content} />
                    </div>
                  </div>
                );
              case 'header':
                return (
                  <div className="card mb-3" key={index}>
                    <div className="card-body">
                      <HeaderComponent text={element.content} />
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
        <button type="submit" className="btn btn-primary mt-3">Create Post</button>
      </form>
    </div>
  );
};

export default ElementorPage;