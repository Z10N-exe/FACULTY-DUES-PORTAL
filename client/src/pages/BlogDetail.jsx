import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaCalendar, FaUser, FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';

const API = 'https://faculty-dues-api-72mv.onrender.com/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/blog/${id}`)
      .then(res => setPost(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Loading...</p></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-400">Post not found.</p></div>;

  const socialIcons = {
    twitter: FaTwitter,
    linkedin: FaLinkedin,
    instagram: FaInstagram,
    facebook: FaFacebook
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      {post.coverImage && (
        <div className="h-96 overflow-hidden bg-gray-100">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 py-12">
        <Link to="/blog" className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 text-sm font-medium">
          <FaArrowLeft /> Back to blog
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded">
              {post.category}
            </span>
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 border-b border-gray-200 pb-6">
            <span className="flex items-center gap-2">
              <FaUser className="text-xs" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <FaCalendar className="text-xs" />
              {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <div
          className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-12"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />

        {/* Social Links */}
        {post.socialLinks && Object.keys(post.socialLinks).some(key => post.socialLinks[key]) && (
          <div className="border-t border-gray-200 pt-8">
            <p className="text-sm font-semibold text-gray-900 mb-4">Share & Follow</p>
            <div className="flex gap-4">
              {Object.entries(post.socialLinks).map(([platform, url]) => {
                if (!url) return null;
                const Icon = socialIcons[platform];
                return (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-colors"
                    title={platform}
                  >
                    <Icon className="text-lg" />
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

export default BlogDetail;
