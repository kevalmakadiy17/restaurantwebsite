import React from 'react';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';

export const BlogPost = ({ post, onBack }) => {
  return (
    <div className="container mx-auto py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-red-600 hover:text-red-700 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Blog
      </button>

      <article className="max-w-4xl mx-auto">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-lg shadow-md mb-8"
        />

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="text-sm text-red-600 font-medium mb-2">{post.category}</div>
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span>{new Date(post.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-8 pt-8 border-t">
            <h3 className="font-bold text-lg mb-4">Share this article</h3>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Share on Facebook
              </button>
              <button className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
                Share on Twitter
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                Share on LinkedIn
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};