// Cart Manager
const Cart = {
    get: () => {
        return JSON.parse(localStorage.getItem('gotyxan_cart')) || [];
    },
    
    save: (cart) => {
        localStorage.setItem('gotyxan_cart', JSON.stringify(cart));
        Cart.updateCount();
    },
    
    add: (product) => {
        let cart = Cart.get();
        const existing = cart.find(item => item.id === product.id);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({...product, quantity: 1});
        }
        
        Cart.save(cart);
        return cart;
    },
    
    remove: (id) => {
        let cart = Cart.get();
        cart = cart.filter(item => item.id !== id);
        Cart.save(cart);
        return cart;
    },
    
    updateQuantity: (id, quantity) => {
        let cart = Cart.get();
        const item = cart.find(item => item.id === id);
        
        if (item) {
            if (quantity <= 0) {
                cart = cart.filter(item => item.id !== id);
            } else {
                item.quantity = quantity;
            }
        }
        
        Cart.save(cart);
        return cart;
    },
    
    clear: () => {
        localStorage.removeItem('gotyxan_cart');
        Cart.updateCount();
    },
    
    getCount: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },
    
    getTotal: () => {
        const cart = Cart.get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    updateCount: () => {
        const count = Cart.getCount();
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }
};

// Initialize on all pages
document.addEventListener('DOMContentLoaded', Cart.updateCount);