import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      className="card mb-4 shadow-sm"
      style={{
        maxWidth: '800px',
        margin: '4em auto',
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="card-body">
        <h5 className="card-title">{content.title}</h5>
        <p className="card-text">{content.content}</p>
        {content.image_url && <img src={content.image_url} className="card-img-top" alt={content.title} />}
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
        <h1>Welcome to the Home Page</h1>
        <p>This is a simple example of a Home page.</p>
        <h2>Posts</h2>
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
