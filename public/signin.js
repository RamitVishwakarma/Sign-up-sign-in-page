document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    let errorMessage = "";

    if (!email || !password) {
      errorMessage = "All fields are required.";
    }

    if (errorMessage) {
      document.querySelector(".error-message").textContent = errorMessage;
      document.querySelector(".error-message").style.display = "block";
    } else {
      // this.submit();
      fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            // Display server-side error message
            document.querySelector(".error-message").textContent = data.message;
            document.querySelector(".error-message").style.display = "block";
          } else {
            // Handle successful response
            // alert("Signup successful! You can SignIn now");
            this.submit();
          }
        });
    }
  });
});
