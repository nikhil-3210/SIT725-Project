document.getElementById("contactForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default page reload

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    try {
        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, message }),
        });

        const data = await response.json();
        document.getElementById("responseMessage").innerText = data.message;

        if (response.ok) {
            document.getElementById("contactForm").reset();
        }
    } catch (error) {
        console.error("Error submitting contact form:", error);
        document.getElementById("responseMessage").innerText = "Error submitting form. Please try again.";
    }
});