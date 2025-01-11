const token = localStorage.getItem('token');

// Redirect to login if the user is not logged in
if (!token) {
  window.location.href = 'index.html';
}

// Fetch all posts
const fetchPosts = async () => {
  try {
    const response = await fetch("/api/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch posts");
    }
    const posts = await response.json();
    const postsContainer = document.getElementById("postsContainer");
    postsContainer.innerHTML = ""; // Clear existing posts

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
        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = "<p>No posts available at the moment.</p>";
    }
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    alert(error.message || "Failed to load posts");
  }
};

document.addEventListener("DOMContentLoaded", fetchPosts);

// Logout functionality
const logout = () => {
  localStorage.removeItem('token'); // Clear token from localStorage
  window.location.href = 'index.html'; // Redirect to login page
};

document.getElementById('logoutButton').addEventListener('click', logout);

// Fetch all posts on page load
fetchPosts();