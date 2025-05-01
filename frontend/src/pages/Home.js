// src/pages/Home.js
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllBlogs } from '../models/Blog';
import '../styles/main.css';

export default function Home() {
  const { isLoggedIn } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch blogs if user is logged in
    if (isLoggedIn) {
      const fetchBlogs = async () => {
        setIsLoading(true);
        try {
          const data = await getAllBlogs();
          setBlogs(data);
        } catch (err) {
          setError('Failed to load blogs');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBlogs();
    }
  }, [isLoggedIn]);

  return (
    <div className="container page-content">
      <div className="home-container">
        <h1 className="home-title">Welcome to the Blog Platform</h1>
        
        {!isLoggedIn ? (
          <p className="home-subtitle">Use the nav links to sign up, log in, or log out.</p>
        ) : isLoading ? (
          <p>Loading blogs...</p>
        ) : error ? (
          <p className="text-error">{error}</p>
        ) : (
          <div className="blogs-container">
            <h2 className="blogs-section-title">Latest Blog Posts</h2>
            
            {blogs.length === 0 ? (
              <p>No blogs available yet.</p>
            ) : (
              <div className="blog-cards">
                {blogs.map(blog => (
                  <div key={blog.id} className="blog-card">
                    <h3 className="blog-card-title">{blog.title}</h3>
                    <div className="blog-card-meta">
                      {/* <span className="blog-card-author">By {blog.author}</span> */}
                      <span className="blog-card-date">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="blog-card-content">{blog.content.substring(0, 150)}...</p>
                    {/* <button className="btn-link">Read More</button> */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
