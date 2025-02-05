document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html";
    return;
  }

  M.AutoInit();

  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const roleField = document.getElementById("role");
  const myPostsContainer = document.getElementById("myPostsContainer");
  const postsHeader = document.getElementById("postsHeader");

  try {
    const response = await fetch("/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");

    const data = await response.json();
    nameField.value = data.name || "";
    emailField.value = data.email || "";
    roleField.value = data.role || "";
    M.updateTextFields();

    if (data.role === "beneficiary") {
      postsHeader.style.display = "none";
      myPostsContainer.style.display = "none";
    } else if (data.role === "donor") {
      fetchMyPosts(token);
    }
  } catch (error) {
    alert("Error fetching profile: " + error.message);
  }

  async function fetchMyPosts(token) {
    try {
      const response = await fetch("/api/posts/my-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Failed to fetch posts");

      const posts = await response.json();
      myPostsContainer.innerHTML = posts.length
        ? ""
        : "<p class='center-align'>No posts created by you yet.</p>";

      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.className = "col s12 m6 l4";
        postElement.innerHTML = `
          <div class="card">
            <div class="card-content">
              <span class="card-title">${post.title}</span>
              <p><strong>Description:</strong> ${post.description}</p>
              <p><strong>Quantity:</strong> ${post.quantity}</p>
              <p><strong>Food Type:</strong> ${post.foodType}</p>
              ${post.foodImage ? `<img src="${post.foodImage}" class="responsive-img"/>` : ""}
            </div>
            <div class="card-action">
              <button class="btn-small yellow darken-2" onclick="editPost('${post._id}')">Edit</button>
              <button class="btn-small red" onclick="deletePost('${post._id}')">Delete</button>
            </div>
          </div>
        `;
        myPostsContainer.appendChild(postElement);
      });
    } catch (error) {
      alert("Error fetching posts: " + error.message);
    }
  }

  window.editPost = (postId) => {
    fetch(`/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((post) => {
        document.getElementById("editTitle").value = post.title || "";
        document.getElementById("editDescription").value = post.description || "";
        document.getElementById("editQuantity").value = post.quantity || "";
        document.getElementById("editFoodType").value = post.foodType || "Veg";
        M.updateTextFields();
        const editModal = M.Modal.getInstance(document.getElementById("editModal"));
        editModal.open();

        document.getElementById("editPostForm").onsubmit = async (e) => {
          e.preventDefault();
          const updatedPost = {
            title: document.getElementById("editTitle").value,
            description: document.getElementById("editDescription").value,
            quantity: document.getElementById("editQuantity").value,
            foodType: document.getElementById("editFoodType").value,
          };

          try {
            const response = await fetch(`/api/posts/${postId}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(updatedPost),
            });

            if (!response.ok) throw new Error("Failed to update post");

            alert("Post updated successfully!");
            editModal.close();
            fetchMyPosts(token);
          } catch (error) {
            alert("Error updating post: " + error.message);
          }
        };
      })
      .catch(() => alert("Error fetching post details"));
  };

  window.deletePost = async (postId) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to delete post");

        alert("Post deleted successfully!");
        fetchMyPosts(token);
      } catch (error) {
        alert("Error deleting post: " + error.message);
      }
    }
  };

  document.getElementById("profileForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const updatedProfile = {
      name: nameField.value,
      email: emailField.value,
    };

    try {
      await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedProfile),
      });
      alert("Profile updated successfully!");
    } catch {
      alert("Error updating profile.");
    }
  });
});
