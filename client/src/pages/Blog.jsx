import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaCalendar, FaTag } from 'react-icons/fa';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get(`${API}/blog`)
      .then(res => setPosts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [...new Set(posts.map(p => p.category))];
  const filtered = selectedCategory ? posts.filter(p => p.category === selectedCategory) : posts;

  return (
    <div className="min-h-screen bg-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Blog & <span className="text-green-600 italic">Insights</span>
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Stories, updates, and insights from the NACOS UNIPORT community.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        {loading ? (
          <p className="text-center text-gray-400">Loading posts...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(post => (
              <Link
                key={post._id}
                to={`/blog/${post._id}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {post.coverImage && (
                  <div className="h-48 overflow-hidden bg-gray-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {post.body.replace(/<[^>]*>/g, '')}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <FaCalendar className="text-xs" />
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    {post.tags?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FaTag className="text-xs" />
                        {post.tags[0]}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
