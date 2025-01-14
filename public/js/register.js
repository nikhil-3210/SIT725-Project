document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const roleInput = document.querySelector('input[name="role"]:checked');
  if (!roleInput) {
    alert("Please select a role (Donor or Beneficiary)");
    return;
  }
  const role = roleInput.value;

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("User registered successfully");
      window.location.href = "index.html";
    } else {
      alert(data.message || "Registration failed");
    }
  } catch (error) {
    console.error("Error during registration:", error.message);
    alert("An error occurred during registration");
  }
});