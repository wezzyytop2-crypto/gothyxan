// Cart functionality
const CART_KEY = 'gotyxan_cart';

class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount();
    }
    
    loadCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }
    
    saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(this.items));
        this.updateCartCount();
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.items.push({
                ...product,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showNotification(`${product.name} added to cart`);
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }
    
    clear() {
        this.items = [];
        this.saveCart();
    }
    
    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.getItemCount();
        countElements.forEach(el => {
            el.textContent = count;
        });
    }
    
    showNotification(message) {
        // Simple notification
        if (typeof alert !== 'undefined') {
            alert(message);
        }
    }
}

// Global cart instance
const cart = new Cart();

// Global functions
window.addToCart = (product) => {
    cart.addItem(product);
};

window.updateQuantity = (productId, quantity) => {
    cart.updateQuantity(productId, quantity);
    if (typeof loadCart === 'function') loadCart();
};

window.removeFromCart = (productId) => {
    cart.removeItem(productId);
    if (typeof loadCart === 'function') loadCart();
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});