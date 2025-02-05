document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
  }

  const postsContainer = document.getElementById("postsContainer");
  
  const showLoader = () => {
    postsContainer.innerHTML = '<div class="loader"><div class="preloader-wrapper active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>';
  };

  const fetchPosts = async () => {
    showLoader();
    try {
      const response = await fetch("/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const posts = await response.json();
      postsContainer.innerHTML = "";

      if (posts.length > 0) {
        posts.forEach((post) => {
          const postElement = document.createElement("div");
          postElement.className = "bg-white p-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg";
          postElement.innerHTML = `
            <img src="${post.foodImage || './image.png'}" alt="Food Image" class="w-full h-48 object-cover rounded-md">
            <h2 class="text-xl font-semibold mt-2">${post.title}</h2>
            <p class="text-gray-700 text-sm mt-1"><strong>Description:</strong> ${post.description}</p>
            <p class="text-gray-700 text-sm"><strong>Quantity:</strong> ${post.quantity}</p>
            <p class="text-gray-700 text-sm"><strong>Food Type:</strong> ${post.foodType}</p>
            <p class="text-gray-700 text-sm"><strong>Dietary Category:</strong> ${post.dietaryCategory}</p>
            <p class="text-gray-700 text-sm"><strong>Contains Nuts:</strong> ${post.containsNuts ? "Yes" : "No"}</p>
            <p class="text-gray-700 text-sm"><strong>Expiry Date:</strong> ${new Date(post.expiryDate).toLocaleString()}</p>
            <p class="text-gray-700 text-sm"><strong>Pickup Address:</strong> ${post.pickupAddress}</p>
            <p class="text-gray-700 text-sm"><strong>Contact Info:</strong> ${post.contactInfo}</p>
            <button class="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">View Details</button>
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

  fetchPosts();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };

  const logoutButton = document.getElementById("logoutButton");
  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }
});