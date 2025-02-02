const Post = require('../models/Post');

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("donor", "name email"); // Ensure donor details are included
    // Ensure the correct image path is sent
    const formattedPosts = posts.map(post => ({
      ...post._doc,
      foodImage: post.foodImage ? `${req.protocol}://${req.get("host")}${post.foodImage}` : null
    }));
    res.json(posts); // Send all post details to the client
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (Donors only)
exports.createPost = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.file);

  const {
    title,
    description,
    quantity,
    foodType,
    dietaryCategory,
    containsNuts,
    ingredients,
    additionalDescription,
    expiryDate,
    storageInstructions,
    servingSize,
    preparationDate,
    allergenInfo,
    packagingType,
    reheatingInstructions,
    certification,
    pickupAddress,
    landmark,
    contactInfo,
    pickupTimeSlot,
  } = req.body;

  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can create posts" });
    }

    const foodImage = req.file ? `/uploads/${req.file.filename}` : null; // Ensure correct path

    const post = await Post.create({
      donor: req.user.id,
      title,
      description,
      quantity,
      foodType,
      dietaryCategory,
      containsNuts: containsNuts === "true",
      ingredients,
      additionalDescription,
      expiryDate,
      storageInstructions,
      servingSize,
      preparationDate,
      allergenInfo,
      packagingType,
      reheatingInstructions,
      certification,
      pickupAddress,
      landmark,
      contactInfo,
      pickupTimeSlot,
      foodImage, // Store relative path
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.error("Error creating post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
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
    expiryDate,
    storageInstructions,
    servingSize,
    preparationDate,
    allergenInfo,
    packagingType,
    reheatingInstructions,
    certification,
    pickupAddress,
    landmark,
    contactInfo,
    pickupTimeSlot,
  } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure the logged-in user is the owner of the post
    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    // Update fields
    post.title = title || post.title;
    post.description = description || post.description;
    post.quantity = quantity || post.quantity;
    post.foodType = foodType || post.foodType;
    post.dietaryCategory = dietaryCategory || post.dietaryCategory;
    post.containsNuts = containsNuts !== undefined ? containsNuts : post.containsNuts;
    post.ingredients = ingredients || post.ingredients;
    post.additionalDescription = additionalDescription || post.additionalDescription;
    post.expiryDate = expiryDate || post.expiryDate;
    post.storageInstructions = storageInstructions || post.storageInstructions;
    post.servingSize = servingSize || post.servingSize;
    post.preparationDate = preparationDate || post.preparationDate;
    post.allergenInfo = allergenInfo || post.allergenInfo;
    post.packagingType = packagingType || post.packagingType;
    post.reheatingInstructions = reheatingInstructions || post.reheatingInstructions;
    post.certification = certification || post.certification;
    post.pickupAddress = pickupAddress || post.pickupAddress;
    post.landmark = landmark || post.landmark;
    post.contactInfo = contactInfo || post.contactInfo;
    post.pickupTimeSlot = pickupTimeSlot || post.pickupTimeSlot;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
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

    if (post.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this post" });
    }

    res.json(post);
  } catch (error) {
    console.error("Error fetching post by ID:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get posts by the logged-in user
// @route   GET /api/posts/my-posts
// @access  Private
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ donor: req.user.id }); // Fetch posts by the logged-in user
    res.json(posts); // Send all post details to the client
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};