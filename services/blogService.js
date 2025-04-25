const mongoose = require("mongoose");
const Blog = require("../models/Blog");

async function getAllBlogs() {
  try {
    const blogs = await Blog.find({})
      .populate("author", "name")
      .sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    console.error("Error in backend blogService.getAllBlogs:", error);
    throw new Error("Failed to fetch blogs from database");
  }
}

async function createNewBlog(blogData, authorId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      const invalidIdError = new Error("Invalid author ID format");
      invalidIdError.status = 400;
      throw invalidIdError;
    }

    const newBlog = new Blog({
      title: blogData.title,
      content: blogData.content,
      author: authorId,
    });

    const savedBlog = await newBlog.save();
    return savedBlog;
  } catch (error) {
    console.error("Error in backend blogService.createNewBlog:", error);
    if (error.name === "ValidationError") {
      const validationError = new Error("Blog data validation failed");
      validationError.status = 400;
      validationError.details = error.errors;
      throw validationError;
    } else if (error.status === 400) {
      throw error;
    }
    throw new Error("Failed to save blog to database");
  }
}

async function getBackendBlogById(blogId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      const invalidIdError = new Error("Invalid blog ID format");
      invalidIdError.status = 400;
      throw invalidIdError;
    }
    const blog = await Blog.findById(blogId).populate("author", "name");
    return blog;
  } catch (error) {
    console.error(
      `Error in backend blogService.getBackendBlogById (${blogId}):`,
      error
    );
    if (error.kind === "ObjectId") {
      const notFoundError = new Error("Blog post not found");
      notFoundError.status = 404;
      throw notFoundError;
    } else if (error.status === 400) {
      throw error;
    }
    throw new Error("Failed to fetch blog from database");
  }
}

async function getBlogsByAuthor(authorId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      const invalidIdError = new Error("Invalid author ID format");
      invalidIdError.status = 400;
      throw invalidIdError;
    }

    const blogs = await Blog.find({ author: authorId })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    return blogs;
  } catch (error) {
    console.error(
      `Error in backend blogService.getBlogsByAuthor (${authorId}):`,
      error
    );
    if (error.status === 400) {
      throw error;
    }
    throw new Error("Failed to fetch blogs by author from database");
  }
}

async function updateBlog(blogId, updatedData) {
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      const invalidIdError = new Error("Invalid blog ID format");
      invalidIdError.status = 400;
      throw invalidIdError;
    }
    const blog = await Blog.findByIdAndUpdate(blogId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (blog) {
      const populatedBlog = await Blog.populate(blog, {
        path: "author",
        select: "name",
      });
      return populatedBlog;
    }

    return blog;
  } catch (error) {
    console.error(
      `Error in backend blogService.updateBlog (${blogId}):`,
      error
    );
    if (error.name === "ValidationError") {
      const validationError = new Error(
        "Blog data validation failed during update"
      );
      validationError.status = 400;
      validationError.details = error.errors;
      throw validationError;
    } else if (error.status === 400) {
      throw error;
    }
    throw new Error("Failed to update blog in database");
  }
}

async function deleteBlog(blogId) {
  try {
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      const invalidIdError = new Error("Invalid blog ID format");
      invalidIdError.status = 400;
      throw invalidIdError;
    }

    const blog = await Blog.findByIdAndDelete(blogId);

    return blog;
  } catch (error) {
    console.error(
      `Error in backend blogService.deleteBlog (${blogId}):`,
      error
    );
    if (error.status === 400) {
      throw error;
    }
    throw new Error("Failed to delete blog from database");
  }
}

module.exports = {
  getAllBlogs,
  getBackendBlogById,
  getBlogsByAuthor,
  createNewBlog,
  updateBlog,
  deleteBlog,
};
