import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Bell, Star } from 'lucide-react';
import './Header.css';

const Header = ({ cartItems, user, onLogout, onSearch }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <h1>Gourmet Delight</h1>
          </Link>
        </div>

        <div className="search-container">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <Search size={20} />
            </button>
          </form>
        </div>

        <nav className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/menu" className="nav-link">Menu</Link>
          <Link to="/reservations" className="nav-link">Reservations</Link>
          <Link to="/rewards" className="nav-link">Rewards</Link>
          <Link to="/reviews" className="nav-link">Reviews</Link>
          {user ? (
            <>
              <Link to="/profile" className="nav-link">
                <User size={20} />
                <span>Profile</span>
              </Link>
              <Link to="/orders" className="nav-link">
                <ShoppingCart size={20} />
                <span>Cart ({cartItems})</span>
              </Link>
              <button onClick={onLogout} className="nav-link logout">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-link">Login</Link>
          )}
        </nav>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
};

export default Header;