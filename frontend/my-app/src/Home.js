import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Importerar CSS-filen

const ItemType = 'CARD';

const DraggableCard = ({ id, content, index, moveCard }) => {
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
        moveCard(draggedItem.index, index);
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
        padding: '60px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="card-body">
        {content.title && <h3 className="card-title" style={{ marginBottom: '20px' }}>{content.title}</h3>}
        {content.text_content && <p className="card-text">{content.text_content}</p>}
        {content.image_url && <img src={content.image_url} className="img-fluid mb-3" alt={content.title} />}
        {content.list_content && (
          <ul className="card-text">
            {JSON.parse(content.list_content).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3001/posts?page=Home');
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

  const moveCard = (fromIndex, toIndex) => {
    const updatedPosts = Array.from(posts);
    const [movedPost] = updatedPosts.splice(fromIndex, 1);
    updatedPosts.splice(toIndex, 0, movedPost);

    const newPosts = updatedPosts.map((post, index) => ({
      ...post,
      position: index,
    }));

    setPosts(newPosts);

    fetch('http://localhost:3001/update-positions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ positions: newPosts.map(({ id, position }) => ({ id, position })) }),
    })
      .then((response) => response.json())
      .then((data) => console.log('Positions updated successfully:', data))
      .catch((error) => console.error('Failed to update positions:', error));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mt-5">
        <h1>Välkommen till Startsidan</h1>
        <p>Denna webbplats är skapad av Alexander Eriksson</p>
        {posts.map((post, index) => (
          <DraggableCard
            key={post.id}
            id={post.id}
            content={post}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </div>
    </DndProvider>
  );
}

export default Home;
