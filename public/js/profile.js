const token = localStorage.getItem("token");

if (!token) {
  // Redirect to login page if not authenticated
  if (window.location.pathname !== "/index.html") {
    window.location.href = "index.html";
  }
} else if (window.location.pathname === "/profile.html") {
  // Fetch user profile and posts only on the profile page
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const user = await response.json();
      document.getElementById("name").value = user.name;
      document.getElementById("email").value = user.email;
      document.getElementById("role").value = user.role;
    } catch (error) {
      console.error("Error fetching profile:", error.message);
      alert(error.message || "Failed to fetch profile");
    }
  };

  const fetchMyPosts = async () => {
    try {
      const response = await fetch("/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch your posts");

      const posts = await response.json();
      const container = document.getElementById("myPostsContainer");
      container.innerHTML = "";

      if (posts.length > 0) {
        posts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "post";
          postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            <p><strong>Quantity:</strong> ${post.quantity}</p>
            <button onclick="openEditModal('${post._id}')">Edit</button>
            <button onclick="deletePost('${post._id}')">Delete</button>
          `;
          container.appendChild(postElement);
        });
      } else {
        container.innerHTML = "<p>No posts created by you yet.</p>";
      }
    } catch (error) {
      console.error("Error fetching your posts:", error.message);
      alert("Error fetching your posts");
    }
  };

  document.addEventListener("DOMContentLoaded", fetchProfile);
  document.addEventListener("DOMContentLoaded", fetchMyPosts);
}

// Fetch user's profile data
const fetchProfile = async () => {
  try {
    const response = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch profile");
    }

    const user = await response.json();

    // Populate profile form fields
    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("role").value = user.role;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    alert(error.message || "Failed to fetch profile");
  }
};

// Update user's profile data
const updateProfile = async (event) => {
  event.preventDefault(); // Prevent form submission reload

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name, email }), // Send updated data
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update profile");
    }

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating profile:", error.message);
    alert(error.message || "Failed to update profile");
  }
};

// Fetch user's posts
const fetchMyPosts = async () => {
  try {
    const response = await fetch("/api/posts/my-posts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch your posts");
    }

    const posts = await response.json();
    const container = document.getElementById("myPostsContainer");
    container.innerHTML = ""; // Clear existing posts

    if (posts.length > 0) {
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.description}</p>
          <p><strong>Quantity:</strong> ${post.quantity}</p>
          <button onclick="openEditModal('${post._id}')">Edit</button>
          <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        container.appendChild(postElement);
      });
    } else {
      container.innerHTML = "<p>No posts created by you yet.</p>";
    }
  } catch (error) {
    console.error("Error fetching your posts:", error.message);
    alert(error.message || "Failed to fetch your posts");
  }
};

// Call fetchMyPosts when the page loads
document.addEventListener("DOMContentLoaded", fetchMyPosts);
document.addEventListener("DOMContentLoaded", fetchProfile);

// Add event listener to the Update Profile button
document
  .getElementById("profileForm")
  .addEventListener("submit", updateProfile);

// Open Edit Modal
// Open Edit Modal
const openEditModal = async (postId) => {
  try {
    const response = await fetch(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
      const post = await response.json();

      // Populate modal fields with post data
      document.getElementById("editTitle").value = post.title;
      document.getElementById("editDescription").value = post.description;
      document.getElementById("editQuantity").value = post.quantity;

      // Store postId for submission
      document.getElementById("editPostForm").dataset.postId = postId;

      // Show the modal
      document.getElementById("editModal").style.display = "block";
    } else {
      const error = await response.json();
      alert(error.message || "Failed to fetch post details");
    }
  } catch (error) {
    console.error("Error fetching post details:", error.message);
    alert("Failed to fetch post details");
  }
};
// Update Post
const updatePost = async (event) => {
  event.preventDefault(); // Prevent form submission reload

  const postId = document.getElementById("editPostForm").dataset.postId; // Get the postId stored in the form
  const title = document.getElementById("editTitle").value;
  const description = document.getElementById("editDescription").value;
  const quantity = document.getElementById("editQuantity").value;

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ title, description, quantity }), // Send updated data
    });

    if (response.ok) {
      alert("Post updated successfully!");
      fetchMyPosts(); // Reload user's posts
      document.getElementById("editModal").style.display = "none"; // Close the modal
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to update the post");
    }
  } catch (error) {
    console.error("Error updating post:", error.message);
    alert(error.message || "Failed to update the post");
  }
};
// Close Edit Modal
document.getElementById("closeModal").onclick = () => {
  document.getElementById("editModal").style.display = "none";
};

// Attach the `updatePost` function to the "Save" button in the modal
document.getElementById("editPostForm").addEventListener("submit", updatePost);
// Delete a post
const deletePost = async (postId) => {
  if (!confirm("Are you sure you want to delete this post?")) return;

  try {
    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });

    if (response.ok) {
      alert("Post deleted successfully!");
      fetchMyPosts(); // Reload user's posts
    } else {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete the post");
    }
  } catch (error) {
    console.error("Error deleting post:", error.message);
    alert(error.message || "Failed to delete the post");
  }
};

// Logout functionality
const logout = () => {
  localStorage.removeItem("token"); // Clear token from localStorage
  localStorage.removeItem("role"); // Clear role from localStorage
  window.location.href = "index.html"; // Redirect to login page
};

document.getElementById("logoutButton").addEventListener("click", logout);
