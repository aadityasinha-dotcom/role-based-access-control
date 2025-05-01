// app/models/blog.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlogSchema = new Schema({
  title:     { type: String, required: true },
  content:   { type: String, required: true },
  author:    { type: Schema.Types.Mixed },   // now optional :contentReference[oaicite:6]{index=6}
  tags:      [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// Update updatedAt on modifications
BlogSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);

