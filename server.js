const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config({ path: "./backend/.env" });

const { createAccount, generateToken } = require("./services/createAccount");
const {
  getAllBlogs,
  createNewBlog,
  getBackendBlogById,
  getBlogsByAuthor,
  updateBlog,
  deleteBlog,
} = require("./services/blogService");
const { protect } = require("./middleware/authMiddleware");
const { admin } = require("./middleware/adminMiddleware");
const User = require("./models/User");

const PORT = 3000;
const app = express();
app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    const { user, token } = await createAccount({ name, email, password });

    res.status(201).json({
      message: "User account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    if (error.message === "Email address is already registered.") {
      res.status(400).json({ message: error.message });
    } else if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to create account." });
    }
  }
});

app.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({
        message: "Please provide name, email, and password for the admin user",
      });
  }

  try {
    const { user, token } = await createAccount({
      name,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin account created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    if (error.message === "Email address is already registered.") {
      res.status(400).json({ message: error.message });
    } else if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      res.status(400).json({ message: messages.join(", ") });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ message: error.message || "Failed to create admin account." });
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    const bcrypt = require("bcryptjs");

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/getBlogs", protect, async (req, res) => {
  try {
    const blogs = await getAllBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error in GET /api/getBlogs:", error.message);
    res.status(500).json({ message: error.message || "Failed to fetch blogs" });
  }
});

app.get("/api/blogs/:id", protect, async (req, res) => {
  try {
    const blogId = req.params.id;

    const blog = await getBackendBlogById(blogId);

    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ message: "Blog post not found" });
    }
  } catch (error) {
    console.error(
      `Error in GET /api/blogs/:id (${req.params.id}):`,
      error.message
    );
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch blog post" });
    }
  }
});

app.post("/api/addBlog", protect, admin, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content for the blog" });
  }

  try {
    const newBlog = await createNewBlog({ title, content }, req.user._id);

    res.status(201).json(newBlog);
  } catch (error) {
    if (error.status === 400 && error.details) {
      res.status(400).json({ message: error.message, details: error.details });
    } else {
      console.error("Error in POST /api/addBlog:", error.message);
      res
        .status(500)
        .json({ message: error.message || "Failed to create blog post" });
    }
  }
});

app.get("/api/admin/blogs", protect, admin, async (req, res) => {
  try {
    const adminBlogs = await getBlogsByAuthor(req.user._id);
    res.status(200).json(adminBlogs);
  } catch (error) {
    console.error("Error in GET /api/admin/blogs:", error.message);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch admin blogs" });
    }
  }
});

app.put("/api/blogs/:id", protect, admin, async (req, res) => {
  const blogId = req.params.id;
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ message: "Please provide title and content for the update" });
  }

  try {
    const blogToUpdate = await getBackendBlogById(blogId);

    if (!blogToUpdate) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blogToUpdate.author._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this blog" });
    }

    const updatedBlog = await updateBlog(blogId, { title, content });

    if (updatedBlog) {
      res.status(200).json(updatedBlog);
    } else {
      res
        .status(500)
        .json({ message: "Failed to update blog after authorization" });
    }
  } catch (error) {
    console.error(`Error in PUT /api/blogs/:id (${blogId}):`, error.message);
    if (error.status === 400) {
      res.status(400).json({ message: error.message, details: error.details });
    } else if (error.status === 404) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to update blog post" });
    }
  }
});

app.delete("/api/blogs/:id", protect, admin, async (req, res) => {
  const blogId = req.params.id;

  try {
    const blogToDelete = await getBackendBlogById(blogId);

    if (!blogToDelete) {
      return res.status(404).json({ message: "Blog post not found" });
    }

    if (blogToDelete.author._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this blog" });
    }

    const deletedBlog = await deleteBlog(blogId);

    if (deletedBlog) {
      res
        .status(200)
        .json({ message: "Blog post removed", deletedBlogId: deletedBlog._id });
    } else {
      res
        .status(500)
        .json({ message: "Failed to delete blog after authorization" });
    }
  } catch (error) {
    console.error(`Error in DELETE /api/blogs/:id (${blogId}):`, error.message);
    if (error.status === 400) {
      res.status(400).json({ message: error.message });
    } else if (error.status === 404) {
      res.status(404).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete blog post" });
    }
  }
});


const connect_DB_start_server = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || PORT, () =>
      console.log(`Server online on port ${process.env.PORT || PORT}`)
    );
  } catch (err) {
    console.log("Error during connecting db, exiting app");
    console.error(err);
    process.exit(1);
  }
};

connect_DB_start_server();
