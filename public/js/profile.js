document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token found. Redirecting to login...");
    window.location.href = "index.html";
    return;
  }

  console.log("Token found. Fetching profile...");

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const roleField = document.getElementById("role");
  const myPostsContainer = document.getElementById("myPostsContainer");
  const postsHeader = document.getElementById("postsHeader");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");

  // Hide the edit modal by default
  if (editModal) editModal.style.display = "none";

  // Fetch profile data
  try {
    console.log("Sending request to /api/auth/profile...");
    const response = await fetch("/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch profile. Status:", response.status);
      throw new Error("Failed to fetch profile");
    }

    const data = await response.json();
    console.log("Profile data fetched successfully:", data);

    // Populate the fields with fetched data
    if (nameField) nameField.value = data.name || "";
    if (emailField) emailField.value = data.email || "";
    if (roleField) roleField.value = data.role || "";

    // Hide "My Posts" and "Create Post" for beneficiaries
    if (data.role === "beneficiary") {
      if (postsHeader) postsHeader.style.display = "none";
      if (myPostsContainer) myPostsContainer.style.display = "none";
    } else if (data.role === "donor") {
      console.log("Fetching donor posts...");
      fetchMyPosts(token);
    }
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    alert("Error fetching profile: " + error.message);
  }

  // Function to fetch donor posts
// Function to fetch and display user's posts
async function fetchMyPosts(token) {
  const myPostsContainer = document.getElementById("myPostsContainer");
  if (!myPostsContainer) return;

  try {
    const response = await fetch("/api/posts/my-posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();

    if (posts.length > 0) {
      myPostsContainer.innerHTML = ""; // Clear existing content
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
          <h3>${post.title}</h3>
          <p><strong>Description:</strong> ${post.description}</p>
          <p><strong>Quantity:</strong> ${post.quantity}</p>
          <p><strong>Food Type:</strong> ${post.foodType}</p>
          <p><strong>Dietary Category:</strong> ${post.dietaryCategory}</p>
          <p><strong>Contains Nuts:</strong> ${post.containsNuts ? "Yes" : "No"}</p>
          <p><strong>Ingredients:</strong> ${post.ingredients}</p>
          <p><strong>Additional Description:</strong> ${post.additionalDescription}</p>
          <p><strong>Expiry Date:</strong> ${new Date(post.expiryDate).toLocaleString()}</p>
          <p><strong>Storage Instructions:</strong> ${post.storageInstructions}</p>
          <p><strong>Serving Size:</strong> ${post.servingSize}</p>
          <p><strong>Preparation Date:</strong> ${new Date(post.preparationDate).toLocaleString()}</p>
          <p><strong>Allergen Info:</strong> ${post.allergenInfo}</p>
          <p><strong>Packaging Type:</strong> ${post.packagingType}</p>
          <p><strong>Reheating Instructions:</strong> ${post.reheatingInstructions}</p>
          <p><strong>Certification:</strong> ${post.certification}</p>
          <p><strong>Pickup Address:</strong> ${post.pickupAddress}</p>
          <p><strong>Landmark:</strong> ${post.landmark}</p>
          <p><strong>Contact Info:</strong> ${post.contactInfo}</p>
          <p><strong>Pickup Time Slot:</strong> ${post.pickupTimeSlot}</p>
          ${post.foodImage ? `<img src="/${post.foodImage}" alt="Food Image" style="max-width: 200px;"/>` : ""}
          <button onclick="editPost('${post._id}')">Edit</button>
          <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        myPostsContainer.appendChild(postElement);
      });
    } else {
      myPostsContainer.innerHTML = "<p>No posts created by you yet.</p>";
    }
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    alert("Error fetching your posts: " + error.message);
  }
}

window.editPost = (postId) => {
  fetch(`/api/posts/${postId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch post details");
      }
      return response.json();
    })
    .then((post) => {
      console.log("Post data fetched:", post);

      // Populate modal fields with post data
      document.getElementById("editTitle").value = post.title || "";
      document.getElementById("editDescription").value = post.description || "";
      document.getElementById("editQuantity").value = post.quantity || "";
      document.getElementById("editFoodType").value = post.foodType || "Veg";
      document.getElementById("editDietaryCategory").value = post.dietaryCategory || "";
      document.getElementById("editContainsNuts").value = post.containsNuts ? "true" : "false";
      document.getElementById("editIngredients").value = post.ingredients || "";
      document.getElementById("editAdditionalDescription").value = post.additionalDescription || "";
      document.getElementById("editExpiryDate").value = post.expiryDate ? new Date(post.expiryDate).toISOString().slice(0, 16) : "";
      document.getElementById("editStorageInstructions").value = post.storageInstructions || "";
      document.getElementById("editServingSize").value = post.servingSize || "";
      document.getElementById("editPreparationDate").value = post.preparationDate ? new Date(post.preparationDate).toISOString().slice(0, 16) : "";
      document.getElementById("editAllergenInfo").value = post.allergenInfo || "";
      document.getElementById("editPackagingType").value = post.packagingType || "";
      document.getElementById("editReheatingInstructions").value = post.reheatingInstructions || "";
      document.getElementById("editCertification").value = post.certification || "";
      document.getElementById("editPickupAddress").value = post.pickupAddress || "";
      document.getElementById("editLandmark").value = post.landmark || "";
      document.getElementById("editContactInfo").value = post.contactInfo || "";
      document.getElementById("editPickupTimeSlot").value = post.pickupTimeSlot || "";

      // Display the modal
      const editModal = document.getElementById("editModal");
      if (editModal) {
        editModal.style.display = "block";
      } else {
        console.error("Edit modal not found");
      }

      // Handle form submission for saving changes
      document.getElementById("editPostForm").onsubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Capture updated values
        const updatedPost = {
          title: document.getElementById("editTitle").value,
          description: document.getElementById("editDescription").value,
          quantity: document.getElementById("editQuantity").value,
          foodType: document.getElementById("editFoodType").value,
          dietaryCategory: document.getElementById("editDietaryCategory").value,
          containsNuts: document.getElementById("editContainsNuts").value === "true",
          ingredients: document.getElementById("editIngredients").value,
          additionalDescription: document.getElementById("editAdditionalDescription").value,
          expiryDate: document.getElementById("editExpiryDate").value,
          storageInstructions: document.getElementById("editStorageInstructions").value,
          servingSize: document.getElementById("editServingSize").value,
          preparationDate: document.getElementById("editPreparationDate").value,
          allergenInfo: document.getElementById("editAllergenInfo").value,
          packagingType: document.getElementById("editPackagingType").value,
          reheatingInstructions: document.getElementById("editReheatingInstructions").value,
          certification: document.getElementById("editCertification").value,
          pickupAddress: document.getElementById("editPickupAddress").value,
          landmark: document.getElementById("editLandmark").value,
          contactInfo: document.getElementById("editContactInfo").value,
          pickupTimeSlot: document.getElementById("editPickupTimeSlot").value,
        };

        // Send the update request to the backend
        try {
          const response = await fetch(`/api/posts/${postId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedPost),
          });

          if (!response.ok) {
            throw new Error("Failed to update post");
          }

          alert("Post updated successfully!");
          document.getElementById("editModal").style.display = "none"; // Close modal
          fetchMyPosts(token); // Reload updated posts
        } catch (error) {
          console.error("Error updating post:", error.message);
          alert("Error updating post: " + error.message);
        }
      };
    })
    .catch((error) => {
      console.error("Error fetching post details:", error.message);
      alert("Error fetching post details");
    });
};
  // Close modal
  if (closeModal) {
    closeModal.onclick = () => {
      if (editModal) editModal.style.display = "none";
    };
  }

  // Delete Post functionality
  window.deletePost = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Failed to delete post");
        }

        alert("Post deleted successfully!");
        fetchMyPosts(token);
      } catch (error) {
        console.error("Error deleting post:", error.message);
        alert("Error deleting post: " + error.message);
      }
    }
  };
  
  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form submission default behavior
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Unauthorized. Please log in again.");
      return;
    }
  
    // Get updated values from the input fields
    const updatedProfile = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
    };
  
    try {
      const response = await fetch("/api/auth/profile", {
        method: "PUT", // Ensure this matches your backend route
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProfile),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
  
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Error updating profile: " + error.message);
    }
  });
});