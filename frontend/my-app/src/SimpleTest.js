import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'bootstrap/dist/css/bootstrap.min.css';

function SimpleTest() {
const ItemType = 'CARD';

const initialItems = [
  { id: '1', content: 'Item 1' },
  { id: '2', content: 'Item 2' },
  { id: '3', content: 'Item 3' },
];

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
        <p>{content}</p>
      </div>
    </div>
  );
};

function SimpleTestWithReactDnd() {
  const [items, setItems] = useState(initialItems);

  const moveCard = (fromIndex, toIndex) => {
    const updatedItems = Array.from(items);
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mt-5">
        <h1>Simple Test with React DnD</h1>
        {items.map((item, index) => (
          <DraggableCard
            key={item.id}
            id={item.id}
            content={item.content}
            index={index}
            moveCard={moveCard}
          />
        ))}
      </div>
    </DndProvider>
  );
}

return <SimpleTestWithReactDnd />;
}

export default SimpleTest;
