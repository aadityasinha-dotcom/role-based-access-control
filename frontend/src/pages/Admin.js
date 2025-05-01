// src/pages/Admin.js
import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAllBlogs, createBlog, updateBlog, deleteBlog } from '../models/Blog';
import '../styles/main.css';

export default function Admin() {
  const { currentUser, isLoggedIn, isAdmin } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Check if user is admin - in a real app, you'd have proper role-based authorization

  // Load blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
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
  }, []);

  // Redirect if not admin
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (isLoggedIn && !isAdmin) {
    return <Navigate to="/" />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedBlog) {
        // Update existing blog
        const updated = await updateBlog(selectedBlog.id, formData);
        setBlogs(blogs.map(blog => blog.id === updated.id ? updated : blog));
        setError('');
      } else {
        // Create new blog
        const newBlog = await createBlog({
          ...formData,
          author: currentUser.name || 'Admin'
        });
        setBlogs([...blogs, newBlog]);
        setError('');
      }
      
      // Reset form
      setFormData({ title: '', content: '' });
      setIsEditing(false);
      setSelectedBlog(null);
    } catch (err) {
      setError('Failed to save blog');
      console.error(err);
    }
  };

  const handleEdit = (blog) => {
    setIsEditing(true);
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        await deleteBlog(id);
        setBlogs(blogs.filter(blog => blog.id !== id));
        
        // Reset form if the deleted blog was being edited
        if (selectedBlog && selectedBlog.id === id) {
          setFormData({ title: '', content: '' });
          setIsEditing(false);
          setSelectedBlog(null);
        }
        <Navigate to="/admin" />
      } catch (err) {
        setError('Failed to delete blog');
        console.error(err);
      }
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setSelectedBlog(null);
    setFormData({ title: '', content: '' });
  };

  if (isLoading) {
    return <div className="container page-content">Loading...</div>;
  }

  return (
    <div className="container page-content">
      <div className="admin-container">
        <h1 className="admin-title">Blog Administration</h1>
        
        {error && <p className="form-error">{error}</p>}
        
        <div className="admin-layout">
          <div className="blog-form-container">
            <h2 className="section-title">{isEditing ? 'Edit Blog' : 'Create New Blog'}</h2>
            
            <form onSubmit={handleSubmit} className="blog-form">
              <div className="form-group">
                <label htmlFor="title" className="form-label">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content" className="form-label">Content</label>
                <textarea
                  id="content"
                  name="content"
                  className="form-input blog-textarea"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="8"
                  required
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Update Blog' : 'Create Blog'}
                </button>
                
                {isEditing && (
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="blog-list-container">
            <h2 className="section-title">Manage Blogs</h2>
            
            {blogs.length === 0 ? (
              <p>No blogs available.</p>
            ) : (
              <div className="blog-list">
                {blogs.map(blog => (
                  <div key={blog.id} className="blog-item">
                    <div className="blog-item-content">
                      <h3 className="blog-item-title">{blog.title}</h3>
                      <p className="blog-item-meta">
                        By {blog.author} on {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="blog-item-actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => handleEdit(blog)}
                        aria-label="Edit blog"
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        onClick={() => handleDelete(blog._id)}
                        aria-label="Delete blog"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
