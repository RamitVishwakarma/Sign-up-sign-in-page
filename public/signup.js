document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    // Prevent default form submission
    event.preventDefault();

    const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector(
      'input[name="confirmPassword"]'
    ).value;

    let errorMessage = "";

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      errorMessage = "All fields are required.";
    } else if (password !== confirmPassword) {
      errorMessage = "Passwords do not match.";
    }

    if (errorMessage) {
      // Display error message without sending request to server
      document.querySelector(".error-message").textContent = errorMessage;
      document.querySelector(".error-message").style.display = "block";
    } else {
      // If no client-side errors, send data to server
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            // Display server-side error message
            document.querySelector(".error-message").textContent = data.message;
            document.querySelector(".error-message").style.display = "block";
          } else {
            // Handle successful response
            alert("Signup successful! You can SignIn now");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });
});
