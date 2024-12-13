document.addEventListener("DOMContentLoaded", function() {
    // Initialize Backendless
    Backendless.initApp("DE166C9D-B683-4D72-906F-5576009B25A2", "B1B0AF8D-B1F7-40EB-81E4-A8D71BC52C11");

    // Function to handle user session
    function updateUserSession() {
        const authElement = document.querySelector(".header__top__right__auth");
        if (!authElement) {
            console.error("Element not found: .header__top__right__auth");
            return;
        }

        Backendless.UserService.getCurrentUser()
            .then(currentUser => {
                if (currentUser) {
                    authElement.innerHTML = `<i class="fa fa-user"></i> ${currentUser.name} | <a href="#" id="logout-link">Logout</a>`;
                    document.getElementById("logout-link").addEventListener("click", function(event) {
                        event.preventDefault();
                        Backendless.UserService.logout()
                            .then(() => {
                                iziToast.success({
                                    title: 'Success',
                                    message: 'Logged out successfully!',
                                    position: 'topRight'
                                });
                                setTimeout(() => {
                                    window.location.href = 'index.html';
                                }, 2000);
                            })
                            .catch(error => {
                                iziToast.error({
                                    title: 'Error',
                                    message: error.message,
                                    position: 'topRight'
                                });
                            });
                    });
                } else {
                    authElement.innerHTML = `<a href="login.html"><i class="fa fa-user"></i> Login</a>`;
                }
            })
            .catch(error => {
                if (error.code === 3064 || error.message.includes("Not existing user token")) {
                    iziToast.error({
                        title: 'Session Expired',
                        message: 'Please log in again to continue.',
                        position: 'topRight'
                    });
                    window.location.href = 'login.html';
                } else {
                    console.error("Error fetching current user:", error);
                }
            });
    }

    // Update header based on user login status
    updateUserSession();

    // Shopping Cart Functionality
    function updateCartTotals() {
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.shoping__cart__item');
        const cartTableBody = document.querySelector('.shoping__cart__table tbody');
        const emptyCartMessage = document.getElementById('empty-cart-message');

        cartItems.forEach(item => {
            const priceElement = item.querySelector('.shoping__cart__price');
            const quantityElement = item.querySelector('.quantity input');
            const totalElement = item.querySelector('.shoping__cart__total');
            const price = parseFloat(priceElement.textContent.replace('UGX', '').replace(',', ''));
            const quantity = parseInt(quantityElement.value);
            const total = price * quantity;

            totalElement.textContent = `UGX ${total.toLocaleString()}`;
            subtotal += total;
        });

        document.querySelector('.shoping__checkout ul li span').textContent = `UGX ${subtotal.toLocaleString()}`;

        if (cartItems.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartTableBody.style.display = 'none';
        } else {
            emptyCartMessage.style.display = 'none';
            cartTableBody.style.display = 'table-row-group';
        }
    }

    document.querySelectorAll('.quantity input').forEach(input => {
        input.addEventListener('change', function() {
            if (parseInt(this.value) < 1) {
                this.value = 1;
            }
            updateCartTotals();
        });
    });

    document.querySelectorAll('.shoping__cart__item__close').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            row.remove();
            updateCartTotals();
        });
    });

    updateCartTotals();
});
