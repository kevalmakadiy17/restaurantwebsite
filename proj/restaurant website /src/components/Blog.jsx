import React, { useState } from 'react';
import { Calendar, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { BlogPost } from './BlogPost';

export const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  const blogPosts = [
    {
      id: 1,
      title: 'The Art of Fast Food: Behind Our Kitchen',
      excerpt: 'Take a peek behind the scenes and discover how we prepare your favorite meals with precision and care.',
      content: `
        <p>At FastFood Express, we believe that fast food doesn't mean compromising on quality. Our kitchen is a carefully orchestrated symphony of skilled chefs, state-of-the-art equipment, and premium ingredients, all working together to bring you the perfect meal.</p>
        
        <h3>Our Kitchen Philosophy</h3>
        <p>Every morning, our team arrives early to prep fresh ingredients. Our vegetables are cut daily, our meat is never frozen, and our buns are baked fresh throughout the day. This commitment to freshness is what sets us apart.</p>
        
        <h3>Quality Control</h3>
        <p>Each station in our kitchen is managed by a trained professional who ensures that every item meets our strict quality standards. From the temperature of our grills to the timing of our fries, everything is precisely monitored.</p>
        
        <h3>Innovation in Action</h3>
        <p>We've implemented smart kitchen technology that helps us track cooking times, manage inventory, and ensure consistent quality. This blend of traditional cooking expertise and modern technology allows us to serve you better and faster.</p>
        
        <h3>Training and Excellence</h3>
        <p>Our staff undergoes rigorous training to master our recipes and procedures. We believe that investing in our team's skills directly translates to better food and service for our customers.</p>
      `,
      image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80',
      author: 'Chef Michael',
      date: '2024-03-15',
      category: 'Behind the Scenes',
      readTime: '5 min read'
    },
    {
      id: 2,
      title: 'Sustainable Practices in Fast Food',
      excerpt: 'Learn about our commitment to environmental sustainability and how we\'re reducing our carbon footprint.',
      content: `
        <p>Sustainability isn't just a buzzword for us—it's a core part of our business model. We're committed to making our operations more environmentally friendly while maintaining the quality and convenience you expect.</p>
        
        <h3>Packaging Revolution</h3>
        <p>We've transitioned to 100% biodegradable packaging made from renewable resources. Our containers break down naturally, leaving no harmful residues in the environment.</p>
        
        <h3>Waste Reduction</h3>
        <p>Through careful inventory management and partnerships with local food banks, we've reduced our food waste by 60% in the past year. Any unavoidable food waste is composted and used in local community gardens.</p>
        
        <h3>Energy Efficiency</h3>
        <p>Our restaurants are equipped with energy-efficient appliances, LED lighting, and smart thermostats. We're also transitioning to renewable energy sources where possible.</p>
        
        <h3>Local Sourcing</h3>
        <p>By partnering with local farmers and suppliers, we've reduced our transportation emissions while supporting our local community. This also ensures fresher ingredients for our customers.</p>
      `,
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
      author: 'Sarah Green',
      date: '2024-03-10',
      category: 'Sustainability',
      readTime: '4 min read'
    },
    {
      id: 3,
      title: 'From Farm to Table: Our Ingredients Story',
      excerpt: 'Discover the journey of our ingredients from local farms to your plate.',
      content: `
        <p>The quality of our food starts with the quality of our ingredients. We take pride in working directly with farmers and producers who share our commitment to excellence.</p>
        
        <h3>Our Farming Partners</h3>
        <p>We've built strong relationships with local farmers who grow our vegetables and raise our livestock. These partnerships ensure we get the freshest ingredients while supporting sustainable farming practices.</p>
        
        <h3>Quality Selection</h3>
        <p>Our ingredients go through a rigorous selection process. We inspect every delivery for freshness, quality, and consistency. Only the best make it to our kitchens.</p>
        
        <h3>Storage and Handling</h3>
        <p>We maintain strict temperature controls and storage procedures to ensure ingredients remain fresh until they're ready to be used. Our inventory system ensures nothing stays in storage longer than necessary.</p>
        
        <h3>Daily Preparation</h3>
        <p>Every morning, our kitchen staff prepares fresh ingredients for the day. Vegetables are cut fresh, meat is properly portioned, and sauces are made from scratch using our secret recipes.</p>
      `,
      image: 'https://images.unsplash.com/photo-1595351298020-038700609878?auto=format&fit=crop&w=800&q=80',
      author: 'John Farmer',
      date: '2024-03-05',
      category: 'Ingredients',
      readTime: '6 min read'
    }
  ];

  if (selectedPost) {
    return <BlogPost post={selectedPost} onBack={() => setSelectedPost(null)} />;
  }

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-2xl font-bold mb-6">Latest from Our Blog</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="text-sm text-red-600 font-medium mb-2">{post.category}</div>
              <h3 className="text-xl font-bold mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedPost(post)}
                className="text-red-600 font-medium flex items-center gap-2 hover:gap-3 transition-all"
              >
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};