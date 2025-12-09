document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    
    if (checkoutForm) {
        // Инициализация формы
        loadSavedFormData();
        
        // Сохранение данных формы при изменении
        checkoutForm.addEventListener('input', saveFormData);
        
        // Обработка отправки формы
        checkoutForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (cart.items.length === 0) {
                alert('Корзина пуста!');
                return;
            }
            
            // Проверка выбора способа оплаты
            const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
            
            if (paymentMethod === 'card') {
                // Для Stripe - обрабатывается в stripe.js
                return;
            } else {
                // Для наличных
                processCashPayment();
            }
        });
    }
});

function saveFormData() {
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        payment: document.querySelector('input[name="payment"]:checked').value
    };
    
    localStorage.setItem('checkout_form_data', JSON.stringify(formData));
}

function loadSavedFormData() {
    const savedData = localStorage.getItem('checkout_form_data');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('name').value = formData.name || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('address').value = formData.address || '';
        
        if (formData.payment) {
            document.querySelector(`input[value="${formData.payment}"]`).checked = true;
            togglePaymentFields(formData.payment);
        }
    }
}

function processCashPayment() {
    const formData = {
        customer: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        },
        items: cart.items,
        total: cart.getTotal(),
        paymentMethod: 'cash',
        orderDate: new Date().toISOString(),
        orderId: 'GOTYXAN-' + Date.now()
    };
    
    // Сохранение заказа
    saveOrder(formData);
    
    // Очистка корзины
    cart.clear();
    
    // Перенаправление на страницу успеха
    window.location.href = 'order-success.html?order=' + formData.orderId;
}

function saveOrder(orderData) {
    const orders = JSON.parse(localStorage.getItem('gotyxan_orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('gotyxan_orders', JSON.stringify(orders));
}