// app/controllers/blog.controller.js
const Blog = require('../models/blogs.model');

// Create a new blog post (no author or auth required)
exports.create = async (req, res, next) => {
  try {
    const { title, content, tags } = req.body;
    const blog = await Blog.create({ title, content, tags });
    res.status(201).json(blog);
  } catch (err) {
    next(err);
  }
};

// Retrieve all blog posts
exports.findAll = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });                    // list all blogs :contentReference[oaicite:0]{index=0}
    res.json(blogs);
  } catch (err) {
    next(err);
  }
};

// Retrieve a single post by ID
exports.findOne = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Update a post by ID (anyone)
exports.update = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id },                       // no author filter :contentReference[oaicite:1]{index=1}
      req.body,
      { new: true, runValidators: true }
    );
    if (!blog) return res.status(404).json({ message: 'Not found' });
    res.json(blog);
  } catch (err) {
    next(err);
  }
};

// Delete a post by ID (anyone)
exports.delete = async (req, res, next) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id); // shorthand for findOneAndDelete :contentReference[oaicite:2]{index=2}
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    next(err);
  }
};

