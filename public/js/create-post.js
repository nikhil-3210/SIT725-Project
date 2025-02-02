const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

// Function to show the toast notification
const showToast = (message) => {
  const toast = document.getElementById("toast");
  toast.textContent = message; // Set the message
  toast.className = "toast show"; // Add the "show" class
  setTimeout(() => {
    toast.className = toast.className.replace("show", ""); // Remove the "show" class after 3 seconds
  }, 3000);
};

document.getElementById("createPostForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);

  // Convert "Yes"/"No" to boolean for containsNuts
  const containsNuts = document.getElementById("containsNuts").value;
  formData.set("containsNuts", containsNutsValue);

  // Debugging: Log formData contents
  for (let [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData, // Send updated formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Server error occurred");
    }

    alert("Post created successfully!");
    document.getElementById("createPostForm").reset();
  } catch (error) {
    console.error("Error creating post:", error.message);
    alert("Failed to create post: " + error.message);
  }
});