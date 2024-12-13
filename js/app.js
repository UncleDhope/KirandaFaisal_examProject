document.addEventListener("DOMContentLoaded", function() {
    // Initialize Backendless with your App ID and API Key
    Backendless.initApp('3F5EC324-51B0-4B5E-B38C-5A6A001FDBD1', 'D8709FF6-4A06-409B-9098-58D98011CA94');

    // Handle the registration form submission
    document.getElementById("registrationForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form from submitting normally

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Validate password match
        if (password !== confirmPassword) {
            iziToast.error({
                title: 'Error',
                message: 'Passwords do not match!',
                position: 'topRight'
            });
            return;
        }

        // Register the user with Backendless
        const user = new Backendless.User();
        user.email = email;
        user.password = password;
        user.name = name;

        Backendless.UserService.register(user)
            .then(function(registeredUser) {
                iziToast.success({
                    title: 'Success',
                    message: 'Account created successfully!',
                    position: 'topRight'
                });

                // Redirect to the login page after registration
                window.location.href = 'login.html';
            })
            .catch(function(error) {
                iziToast.error({
                    title: 'Error',
                    message: error.message,
                    position: 'topRight'
                });
            });
    });
});
