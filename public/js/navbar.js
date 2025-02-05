const loadNavbar = () => {
  // Inject Materialize CSS and JS if not already present
  if (!document.getElementById("materialize-css")) {
    const cssLink = document.createElement("link");
    cssLink.id = "materialize-css";
    cssLink.rel = "stylesheet";
    cssLink.href = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css";
    document.head.appendChild(cssLink);
  }

  if (!document.getElementById("materialize-js")) {
    const jsScript = document.createElement("script");
    jsScript.id = "materialize-js";
    jsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js";
    jsScript.defer = true;
    document.head.appendChild(jsScript);
  }

  // Ensure Material Icons are loaded
  if (!document.getElementById("material-icons")) {
    const iconLink = document.createElement("link");
    iconLink.id = "material-icons";
    iconLink.rel = "stylesheet";
    iconLink.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
    document.head.appendChild(iconLink);
  }

  // Get user details from localStorage
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Dynamically create navbar
  const navbarHTML = `
    <nav class="blue darken-3">
      <div class="nav-wrapper container">
        <a href="posts.html" class="brand-logo">SHARE-A-Bite</a>
        <a href="#" data-target="mobile-nav" class="sidenav-trigger">
          <i class="material-icons">menu</i>
        </a>
        <ul class="right hide-on-med-and-down">
          <li><a href="posts.html">Home</a></li>
          ${token && role === "donor" ? '<li><a href="createPost.html">Create Post</a></li>' : ""}
          ${token ? '<li><a href="profile.html">Profile</a></li>' : ""}
          <li><a href="blogs.html">Blogs</a></li>
          <li><a href="contact.html">Contact Us</a></li>
          ${token ? '<li><button id="logoutButton" class="btn-small red lighten-1">Logout</button></li>' : ""}
        </ul>
      </div>
    </nav>

    <!-- Mobile Sidebar Navigation -->
    <ul class="sidenav" id="mobile-nav">
      <li><a href="posts.html">Home</a></li>
      ${token && role === "donor" ? '<li><a href="createPost.html">Create Post</a></li>' : ""}
      ${token ? '<li><a href="profile.html">Profile</a></li>' : ""}
      <li><a href="blogs.html">Blogs</a></li>
      <li><a href="contact.html">Contact Us</a></li>
      ${token ? '<li><button id="logoutButtonMobile" class="btn-small red">Logout</button></li>' : ""}
    </ul>
  `;

  // Insert navbar at the top of the body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Initialize sidenav when DOM is fully loaded
  document.addEventListener("DOMContentLoaded", () => {
    const elems = document.querySelectorAll(".sidenav");
    M.Sidenav.init(elems);
  });

  // Logout functionality
  if (token) {
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      window.location.href = "index.html"; // Redirect to login page
    };
    document.getElementById("logoutButton")?.addEventListener("click", logout);
    document.getElementById("logoutButtonMobile")?.addEventListener("click", logout);
  }
};

// Load the navbar when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", loadNavbar);
