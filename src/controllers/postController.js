const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('donor', 'name email');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Donors only)
exports.createPost = async (req, res) => {
  const {
    title,
    description,
    quantity,
    foodType,
    dietaryCategory,
    containsNuts,
    ingredients,
    additionalDescription,
  } = req.body;

  console.log("Received payload:", req.body); // Debug log

  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can create posts" });
    }

    const post = await Post.create({
      donor: req.user.id,
      title,
      description,
      quantity,
      foodType,
      dietaryCategory,
      containsNuts,
      ingredients,
      additionalDescription,
    });

    console.log("Post created successfully:", post); // Debug log
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error.message); // Debug log
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get posts by the logged-in user
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ donor: req.user.id }); // Ensure `donor` matches the logged-in user
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
exports.updatePost = async (req, res) => {
  const {
    title,
    description,
    quantity,
    foodType,
    dietaryCategory,
    containsNuts,
    ingredients,
    additionalDescription,
  } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the logged-in user is the owner of the post
    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    post.title = title || post.title;
    post.description = description || post.description;
    post.quantity = quantity || post.quantity;
    post.foodType = foodType || post.foodType;
    post.dietaryCategory = dietaryCategory || post.dietaryCategory;
    post.containsNuts = containsNuts ?? post.containsNuts; // Allow boolean values
    post.ingredients = ingredients || post.ingredients;
    post.additionalDescription = additionalDescription || post.additionalDescription;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Ensure the logged-in user is the owner of the post
    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: req.params.id }); // Replacing `remove` with `deleteOne`

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a post by ID
// @route   GET /api/posts/:id
// @access  Private
exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    console.log("Fetched post details:", post); // Debug log

    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this post" });
    }
    res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};