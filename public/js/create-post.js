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

document
  .getElementById("createPostForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const quantity = document.getElementById("quantity").value;
    const foodType = document.getElementById("foodType").value; // Ensure this field exists
    const dietaryCategory = document.getElementById("dietaryCategory").value;
    const containsNuts =
      document.getElementById("containsNuts").value === "yes";
    const ingredients = document.getElementById("ingredients").value;
    const additionalDescription = document.getElementById(
      "additionalDescription"
    ).value;

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          description,
          quantity,
          foodType,
          dietaryCategory,
          containsNuts,
          ingredients,
          additionalDescription,
        }),
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
