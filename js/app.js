// Initialize Backendless with your App ID and API Key
Backendless.initApp('3F5EC324-51B0-4B5E-B38C-5A6A001FDBD1', 'D8709FF6-4A06-409B-9098-58D98011CA94');

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  
  // Handle Registration Form Submission
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent normal form submission

      // Get form values for registration
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Validate the inputs
      if (!name || !email || !password || !confirmPassword) {
        iziToast.error({
          title: 'Error',
          message: 'Please fill in all fields.',
          position: 'topRight'
        });
        return;
      }

      if (password !== confirmPassword) {
        iziToast.error({
          title: 'Error',
          message: 'Passwords do not match.',
          position: 'topRight'
        });
        return;
      }

      // Create a new user object to send to Backendless
      const user = new Backendless.User();
      user.name = name;
      user.email = email;
      user.password = password;

      // Register the user in Backendless
      Backendless.UserService.register(user)
        .then(function (registeredUser) {
          iziToast.success({
            title: 'Success',
            message: 'Registration successful!',
            position: 'topRight'
          });

          // Redirect to login page after 2 seconds
          setTimeout(() => {
            window.location.href = 'login.html'; // Redirect to login page
          }, 2000);
        })
        .catch(function (error) {
          iziToast.error({
            title: 'Error',
            message: error.message,
            position: 'topRight'
          });
        });
    });
  }

  // Handle Login Form Submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent normal form submission

      // Get form values for login
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      // Validate the inputs
      if (!email || !password) {
        iziToast.error({
          title: 'Error',
          message: 'Please fill in both email and password.',
          position: 'topRight'
        });
        return;
      }

      // Log the user in using Backendless UserService
      Backendless.UserService.login(email, password)
        .then(function (loggedInUser) {
          iziToast.success({
            title: 'Success',
            message: 'You have logged in successfully!',
            position: 'topRight'
          });

          // Redirect to homepage (index.html) after successful login
          setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to homepage
          }, 2000);
        })
        .catch(function (error) {
          iziToast.error({
            title: 'Error',
            message: error.message,
            position: 'topRight'
          });
        });
    });
  }
});
