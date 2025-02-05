const loadNavbar = () => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const navbarHTML = `
    <nav class="navbar">
      <a href="posts.html" class="brand-logo">Logo</a>
      <ul>
        <li><a href="posts.html">Home</a></li>
        ${
          token && role === "donor"
            ? '<li><a href="createPost.html">Create Post</a></li>'
            : ""
        }
        ${token ? '<li><a href="profile.html">Profile</a></li>' : ""}
        <li><a href="blogs.html">Blogs</a></li>
        <li><a href="contact.html">Contact Us</a></li>
        ${
          token
            ? '<li><button id="logoutButton" class="logout-btn">Logout</button></li>'
            : ""
        }
      </ul>
    </nav>
  `;

  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  if (token) {
    document.getElementById("logoutButton")?.addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html";
    });
  }
};

document.addEventListener("DOMContentLoaded", loadNavbar);