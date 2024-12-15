// Initialize Backendless with your App ID and API Key
Backendless.initApp('3F5EC324-51B0-4B5E-B38C-5A6A001FDBD1', 'D8709FF6-4A06-409B-9098-58D98011CA94');

document.addEventListener("DOMContentLoaded", function () {
  // Handle Registration Form Submission
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
    registrationForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent normal form submission

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

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

      const user = new Backendless.User();
      user.name = name;
      user.email = email;
      user.password = password;

      Backendless.UserService.register(user)
        .then(function (registeredUser) {
          iziToast.success({
            title: 'Success',
            message: 'Registration successful!',
            position: 'topRight'
          });

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

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      if (!email || !password) {
        iziToast.error({
          title: 'Error',
          message: 'Please fill in both email and password.',
          position: 'topRight'
        });
        return;
      }

      Backendless.UserService.login(email, password)
        .then(function (loggedInUser) {
          iziToast.success({
            title: 'Success',
            message: 'You have logged in successfully!',
            position: 'topRight'
          });

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


// Initialize PayPal Buttons
paypal.Buttons({
  // Set up the transaction details
  createOrder: function (data, actions) {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: '60.00', // Total amount in USD (convert UGX to USD)
          },
          description: 'Purchase of groceries',
        },
      ],
    });
  },

  // Finalize the transaction after buyer approval
  onApprove: function (data, actions) {
    return actions.order.capture().then(function (details) {
      console.log('Transaction completed by ' + details.payer.name.given_name);

      // Show success message
      iziToast.success({
        title: 'Payment Successful',
        message: 'Thank you for your order, ' + details.payer.name.given_name + '!',
        position: 'topRight',
      });

      // Handle order success logic (e.g., save transaction to Backendless)
      fetch(
        'https://api.backendless.com/3F5EC324-51B0-4B5E-B38C-5A6A001FDBD1/D8709FF6-4A06-409B-9098-58D98011CA94/services/PaymentService/processPayment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderID: data.orderID,
            details: details,
          }),
        }
      )
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Error processing payment:', error));
    });
  },

  // Handle payment errors
  onError: function (err) {
    console.error(err);
    iziToast.error({
      title: 'Payment Failed',
      message: 'There was an error processing your payment. Please try again.',
      position: 'topRight',
    });
  },
}).render('#paypal-button-container'); // Renders the button in your container


