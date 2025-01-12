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

    if (!response.ok) throw new Error("Failed to fetch posts");

    const posts = await response.json();
    const container = document.getElementById("postsContainer");
    container.innerHTML = ""; // Clear existing posts

    if (posts.length > 0) {
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "post";
        postElement.innerHTML = `
          <h2>${post.title}</h2>
          <p>${post.description}</p>
          <p><strong>Quantity:</strong> ${post.quantity}</p>
          <p><em>Posted by: ${post.donor?.name || "Unknown"}</em></p>
        `;
        container.appendChild(postElement);
      });
    } else {
      container.innerHTML = "<p>No posts available at the moment.</p>";
    }
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    alert("Error fetching posts");
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