const loadNavbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Get the user's role

  // Dynamically create navbar
  const navbarHTML = `
    <nav class="navbar">
      <ul>
        <li><a href="posts.html">Home</a></li>
        ${
          token && role === "donor"
            ? '<li><a href="createPost.html">Create Post</a></li>'
            : ""
        } <!-- Show Create Post for donors -->
        ${token ? '<li><a href="profile.html">Profile</a></li>' : ""}
        <li><a href="blogs.html">Blogs</a></li> <!-- New link for Blogs -->
        <li><a href="contact.html">Contact Us</a></li> <!-- New link for Contact Us -->
        ${
          token
            ? '<li><button id="logoutButton" class="logout-btn">Logout</button></li>'
            : ""
        }
      </ul>
    </nav>
  `;

  // Insert the navbar at the top of the body
  const body = document.body;
  body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Add logout functionality
  if (token) {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html"; // Redirect to login page
    };
    document.getElementById("logoutButton")?.addEventListener("click", logout);
  }
};

// Load the navbar when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadNavbar);