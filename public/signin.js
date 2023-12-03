document.addEventListener("DOMContentLoaded", function () {
  document.querySelector("form").addEventListener("submit", function (event) {
    // Prevent form submission
    event.preventDefault();

    // const name = document.querySelector('input[name="name"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    // const confirmPassword = document.querySelector(
    //   'input[name="confirmPassword"]'
    // ).value;

    let errorMessage = "";

    if (!email || !password) {
      errorMessage = "All fields are required.";
    }

    if (errorMessage) {
      document.querySelector(".error-message").textContent = errorMessage;
      document.querySelector(".error-message").style.display = "block";
    } else {
      // If no errors, submit the form data
      this.submit();
    }
  });
});
