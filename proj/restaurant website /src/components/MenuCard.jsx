import React from 'react';
import './MenuCard.css';

const MenuCard = ({ item }) => {
  return (
    <div className="menu-card">
      <div className="menu-card-image">
        <img 
          src={item.imageUrl} 
          alt={item.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = menuImages.default;
          }}
        />
      </div>
      <div className="menu-card-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="menu-card-footer">
          <span className="price">${item.price.toFixed(2)}</span>
          <button className="add-to-cart">Add to Cart</button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard; 