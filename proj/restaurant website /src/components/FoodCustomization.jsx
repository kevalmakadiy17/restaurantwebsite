import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import './FoodCustomization.css';

const FoodCustomization = ({ item, onClose, onAddToCart }) => {
  const [customization, setCustomization] = useState({
    spiceLevel: 'medium',
    ingredients: {},
    specialInstructions: '',
    quantity: 1
  });

  const handleIngredientToggle = (ingredient) => {
    setCustomization(prev => ({
      ...prev,
      ingredients: {
        ...prev.ingredients,
        [ingredient]: !prev.ingredients[ingredient]
      }
    }));
  };

  const handleQuantityChange = (change) => {
    setCustomization(prev => ({
      ...prev,
      quantity: Math.max(1, prev.quantity + change)
    }));
  };

  const handleSubmit = () => {
    onAddToCart({
      ...item,
      customization,
      quantity: customization.quantity
    });
    onClose();
  };

  return (
    <div className="customization-modal">
      <div className="customization-content">
        <div className="modal-header">
          <h2>Customize {item.name}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="customization-section">
          <h3>Quantity</h3>
          <div className="quantity-control">
            <button onClick={() => handleQuantityChange(-1)} className="quantity-button">
              <Minus size={20} />
            </button>
            <span className="quantity-display">{customization.quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="quantity-button">
              <Plus size={20} />
            </button>
          </div>
        </div>

        <div className="customization-section">
          <h3>Spice Level</h3>
          <div className="spice-levels">
            {['mild', 'medium', 'hot', 'extra hot'].map(level => (
              <button
                key={level}
                className={`spice-button ${customization.spiceLevel === level ? 'active' : ''}`}
                onClick={() => setCustomization(prev => ({ ...prev, spiceLevel: level }))}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="customization-section">
          <h3>Ingredients</h3>
          <div className="ingredients-list">
            {item.ingredients.map(ingredient => (
              <label key={ingredient} className="ingredient-item">
                <input
                  type="checkbox"
                  checked={customization.ingredients[ingredient] !== false}
                  onChange={() => handleIngredientToggle(ingredient)}
                />
                <span>{ingredient}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="customization-section">
          <h3>Special Instructions</h3>
          <textarea
            value={customization.specialInstructions}
            onChange={(e) => setCustomization(prev => ({ ...prev, specialInstructions: e.target.value }))}
            placeholder="Any special requests? (e.g., no onions, extra sauce)"
            className="special-instructions"
          />
        </div>

        <div className="modal-footer">
          <button onClick={handleSubmit} className="add-to-cart-button">
            Add to Cart (${(item.price * customization.quantity).toFixed(2)})
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCustomization; 