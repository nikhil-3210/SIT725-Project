const token = localStorage.getItem("token");

// Redirect to login if the user is not logged in
if (!token) {
  window.location.href = "index.html";
}

// Fetch all posts
const fetchPosts = async () => {
  try {
    const response = await fetch("/api/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }

    const posts = await response.json();
    const postsContainer = document.getElementById("postsContainer");

    if (posts.length > 0) {
      postsContainer.innerHTML = ""; // Clear existing content
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
          <!-- Display Donor's Name -->
          <p><strong>Posted By:</strong> ${post.donor?.name || "Anonymous Donor"}</p>
        `;
        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = "<p>No posts available at the moment.</p>";
    }
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    alert("Error fetching posts: " + error.message);
  }
};

// Fetch posts on page load
document.addEventListener("DOMContentLoaded", fetchPosts);

// Logout functionality
const logout = () => {
  localStorage.removeItem("token"); // Clear token from localStorage
  window.location.href = "index.html"; // Redirect to login page
};

// Attach logout functionality only if the button exists
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", logout);
}