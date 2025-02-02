const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  createRequest,
  getRequestsForDonor,
  getRequestsForBeneficiary,
  updateRequestStatus,
} = require("../controllers/requestController");

const router = express.Router();

router.post("/", protect, createRequest); // Beneficiary requests food
router.get("/donor", protect, getRequestsForDonor); // Donor views requests
router.get("/beneficiary", protect, getRequestsForBeneficiary); // Beneficiary views status
router.put("/:id", protect, updateRequestStatus); // Donor updates request status

module.exports = router;