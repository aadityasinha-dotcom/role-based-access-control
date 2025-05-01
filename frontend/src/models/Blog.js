// src/models/Blog.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/blogs';

// Returns a promise that resolves to an array of all blogs
export const getAllBlogs = () => {
  return axios
    .get(API_URL)
    .then(response => response.data);
};

// Returns a promise that resolves to a single blog by its ID (or null)
export const getBlogById = (id) => {
  return axios
    .get(`${API_URL}/${id}`)
    .then(response => response.data)
    .catch(err => {
      if (err.response && err.response.status === 404) {
        return null;
      }
      return Promise.reject(err);
    });
};

// Creates a new blog, returns a promise resolving to the created blog
export const createBlog = (blogData) => {
  return axios
    .post(API_URL, blogData)
    .then(response => response.data);
};

// Updates an existing blog by ID, returns a promise resolving to the updated blog
export const updateBlog = (id, blogData) => {
  return axios
    .put(`${API_URL}/${id}`, blogData)
    .then(response => response.data);
};

// Deletes a blog by ID, returns a promise resolving to a success object
export const deleteBlog = (id) => {
  return axios
    .delete(`${API_URL}/${id}`)
    .then(response => response.data);
};

