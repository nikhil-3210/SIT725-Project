document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Save token and role in local storage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      // Redirect to posts page
      window.location.href = "posts.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    alert("An error occurred during login");
  }
});