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
  async function fetchMyPosts(token) {
    if (!myPostsContainer) return; // Skip if the container doesn't exist

    try {
      console.log("Sending request to /api/posts/my-posts...");
      const response = await fetch("/api/posts/my-posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch posts. Status:", response.status);
        throw new Error("Failed to fetch your posts");
      }

      const posts = await response.json();
      console.log("Posts fetched successfully:", posts);

      if (posts.length > 0) {
        myPostsContainer.innerHTML = ""; // Clear previous content
        posts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "post";
          postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.description}</p>
            <p><strong>Quantity:</strong> ${post.quantity}</p>
            <p><strong>Food Type:</strong> ${post.foodType}</p>
            <p><strong>Dietary Category:</strong> ${post.dietaryCategory}</p>
            <p><strong>Contains Nuts:</strong> ${post.containsNuts ? "Yes" : "No"}</p>
            <p><strong>Ingredients:</strong> ${post.ingredients}</p>
            <p><strong>Additional Description:</strong> ${post.additionalDescription}</p>
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

  // Edit Post functionality
  window.editPost = (postId) => {
    fetch(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch post details");
        }
        return response.json();
      })
      .then((post) => {
        document.getElementById("editTitle").value = post.title;
        document.getElementById("editDescription").value = post.description;
        document.getElementById("editQuantity").value = post.quantity;
        document.getElementById("editFoodType").value = post.foodType;
        document.getElementById("editDietaryCategory").value = post.dietaryCategory;
        document.getElementById("editContainsNuts").value = post.containsNuts ? "true" : "false";
        document.getElementById("editIngredients").value = post.ingredients;
        document.getElementById("editAdditionalDescription").value = post.additionalDescription;
        if (editModal) editModal.style.display = "block";
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
});