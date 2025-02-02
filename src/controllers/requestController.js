const Request = require("../models/Request");
const Post = require("../models/Post");

// @desc    Create a request for food
// @route   POST /api/requests
// @access  Private (Beneficiary only)
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.status(403).json({ message: "Only beneficiaries can request food" });
    }

    const { postId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Food post not found" });
    }

    const request = await Request.create({
      post: postId,
      beneficiary: req.user.id,
      donor: post.donor,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error("Error creating request:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get requests for donor
// @route   GET /api/requests/donor
// @access  Private (Donor only)
exports.getRequestsForDonor = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can view requests" });
    }

    const requests = await Request.find({ donor: req.user.id })
      .populate("beneficiary", "name email")
      .populate("post", "title");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching requests:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get request status for beneficiary
// @route   GET /api/requests/beneficiary
// @access  Private (Beneficiary only)
exports.getRequestsForBeneficiary = async (req, res) => {
  try {
    if (req.user.role !== "beneficiary") {
      return res.status(403).json({ message: "Only beneficiaries can view request status" });
    }

    const requests = await Request.find({ beneficiary: req.user.id }).populate("post", "title");

    res.json(requests);
  } catch (error) {
    console.error("Error fetching request status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update request status (Accept/Reject)
// @route   PUT /api/requests/:id
// @access  Private (Donor only)
exports.updateRequestStatus = async (req, res) => {
  try {
    if (req.user.role !== "donor") {
      return res.status(403).json({ message: "Only donors can update request status" });
    }

    const { status } = req.body;
    if (!["Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.donor.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Request ${status.toLowerCase()} successfully` });
  } catch (error) {
    console.error("Error updating request status:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};