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

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Unauthorized. Please log in again.");
    return;
  }

  // Creating FormData to handle both text fields and file uploads
  const formData = new FormData(e.target);

  // Ensure "containsNuts" is converted to a boolean
  formData.set("containsNuts", formData.get("containsNuts") === "Yes");

  try {
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData, // Send formData to the backend
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