import React from 'react';

export const ImageComponent = ({ src }) => {
  return <img src={src} alt="Added" className="img-fluid" />;
};

export const TextComponent = ({ text }) => {
  return <p>{text}</p>;
};

export const ListComponent = ({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
};

export const HeaderComponent = ({ text }) => {
  return <h2>{text}</h2>;
};
