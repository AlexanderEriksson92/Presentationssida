import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const ItemType = 'ELEMENT';

const DraggableElement = ({ id, type, content, index, moveElement }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ItemType,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveElement(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`draggable-box mb-4 ${isDragging ? 'dragging' : ''}`}
      style={{
        backgroundColor: '#F1F2FA',
        borderRadius: '5px',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      {type === 'image' && content && <img src={content} className="img-fluid" alt="Content" />}
      {type === 'text' && content && <p>{content}</p>}
      {type === 'list' && content && Array.isArray(content) && content.length > 0 && (
        <ul>
          {content.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
      {type === 'header' && content && <h2>{content}</h2>}
    </div>
  );
};

function CreatePost() {
  const [elements, setElements] = useState([]);
  const [page, setPage] = useState('Exempel'); // Default page
  const [existingPosts, setExistingPosts] = useState([]);
  const [newElementType, setNewElementType] = useState('');
  const [newElementContent, setNewElementContent] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(`http://localhost:3001/posts?page=${page}`);
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        // Sortera poster baserat på position
        data.sort((a, b) => a.position - b.position);
        setExistingPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [page]);

  const moveElement = (fromIndex, toIndex) => {
    const updatedElements = Array.from(elements);
    const [movedElement] = updatedElements.splice(fromIndex, 1);
    updatedElements.splice(toIndex, 0, movedElement);

    setElements(updatedElements);
  };

  const moveExistingElement = (fromIndex, toIndex) => {
    const updatedPosts = Array.from(existingPosts);
    const [movedPost] = updatedPosts.splice(fromIndex, 1);
    updatedPosts.splice(toIndex, 0, movedPost);

    setExistingPosts(updatedPosts);

    const newPositions = updatedPosts.map((post, index) => ({
      id: post.id,
      position: index,
    }));

    fetch('http://localhost:3001/update-positions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positions: newPositions }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Positions updated successfully:', data))
      .catch((error) => console.error('Failed to update positions:', error));
  };

  const handleAddElement = (type) => {
    setNewElementType(type);
    setNewElementContent('');
  };

  const handleSaveElement = () => {
    if (newElementContent && (Array.isArray(newElementContent) ? newElementContent.length > 0 : newElementContent.length > 0)) {
      const newElement = {
        id: Date.now(),
        type: newElementType,
        content: newElementType === 'list' ? newElementContent.split(',') : newElementContent,
      };
      setElements([...elements, newElement]);
      setNewElementType('');
      setNewElementContent('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const headerElement = elements.find(element => element.type === 'header');
    const title = headerElement ? headerElement.content : '';
    const contentWithoutHeader = elements.filter(element => element.type !== 'header');

    console.log('Submitting post with title:', title);
    console.log('Content without header:', contentWithoutHeader);

    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content: contentWithoutHeader, page })
      });
      if (!response.ok) throw new Error('Something went wrong');
      alert('Post created successfully!');
      setElements([]);
      setPage('Exempel');
      window.location.reload();  // Ladda om sidan
    } catch (error) {
      console.error('Failed to create post:', error);
      alert('Failed to create post.');
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="sidebar col-3">
            <div className="mb-3">
              <label htmlFor="page" className="form-label">Page:</label>
              <select id="page" className="form-select" value={page} onChange={e => setPage(e.target.value)}>
                <option value="">Select a Page</option>
                <option value="Home">Home</option>
                <option value="Exempel">Exempel</option>
                <option value="Presentationssida">Presentationssida</option>
              </select>
            </div>
            <div className="d-flex flex-wrap">
              <button className="btn btn-primary m-1 custom-button w-50" onClick={() => handleAddElement('image')}>Image</button>
              <button className="btn btn-secondary m-1 custom-button w-50" onClick={() => handleAddElement('text')}>Text</button>
              <button className="btn btn-dark m-1 custom-button w-50" onClick={() => handleAddElement('list')}>List</button>
              <button className="btn btn-info m-1 custom-button w-50" onClick={() => handleAddElement('header')}>Header</button>
            </div>
            <button className="btn btn-success btn-block custom-button mt-3" onClick={handleSubmit}>Save Post</button>
            {newElementType && (
              <div className="mt-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Enter ${newElementType === 'list' ? 'list items separated by commas' : newElementType} content`}
                  value={newElementContent}
                  onChange={(e) => setNewElementContent(e.target.value)}
                />
                <button className="btn btn-primary btn-block mt-3 custom-button" onClick={handleSaveElement}>Add {newElementType.charAt(0).toUpperCase() + newElementType.slice(1)}</button>
              </div>
            )}
          </div>
          <div className="col-9 offset-3">
            <div className="content-area mt-4">
              {existingPosts.length > 0 && (
                <div className="mb-4">
                  <h2>Existing Posts</h2>
                  {existingPosts.map((post, index) => (
                    <div key={post.id} className="mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h3>{post.title}</h3>
                      {post.text_content && (
                        <DraggableElement
                          key={`text-${post.id}`}
                          id={post.id}
                          type="text"
                          content={post.text_content}
                          index={index}
                          moveElement={moveExistingElement}
                        />
                      )}
                      {post.image_url && (
                        <DraggableElement
                          key={`image-${post.id}`}
                          id={post.id}
                          type="image"
                          content={post.image_url}
                          index={index}
                          moveElement={moveExistingElement}
                        />
                      )}
                      {post.list_content && (
                        <DraggableElement
                          key={`list-${post.id}`}
                          id={post.id}
                          type="list"
                          content={JSON.parse(post.list_content)}
                          index={index}
                          moveElement={moveExistingElement}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              {elements.length > 0 && (
                <div className="card mb-4 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                  <div className="card-body">
                    {elements.map((element, index) => (
                      <DraggableElement
                        key={element.id}
                        id={element.id}
                        type={element.type}
                        content={element.content}
                        index={index}
                        moveElement={moveElement}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}

export default CreatePost;
