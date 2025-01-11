const token = localStorage.getItem('token');

if (!token) {
  window.location.href = 'index.html';
}

// Function to show the toast notification
const showToast = (message) => {
  const toast = document.getElementById('toast');
  toast.textContent = message; // Set the message
  toast.className = 'toast show'; // Add the "show" class
  setTimeout(() => {
    toast.className = toast.className.replace('show', ''); // Remove the "show" class after 3 seconds
  }, 3000);
};

document.getElementById('createPostForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const quantity = document.getElementById('quantity').value;

  const response = await fetch('/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description, quantity }),
  });

  if (response.ok) {
    showToast('Item listed successfully!'); // Show toast notification
    // Clear the form fields
    document.getElementById('createPostForm').reset();
  } else {
    const result = await response.json();
    showToast(result.message || 'Failed to create post'); // Show error message
  }
});