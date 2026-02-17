const products = [
    { id: 1, name: "MacBook Pro 14", category: "Laptop", price: 1999, rating: 5 },
    { id: 2, name: "Logitech MX Master", category: "Mouse", price: 99, rating: 4 },
    { id: 3, name: "Razer BlackWidow", category: "Keyboard", price: 140, rating: 4 },
    { id: 4, name: "RTX 4080 Super", category: "Graphics Card", price: 1200, rating: 5 },
    { id: 5, name: "Dell XPS 13", category: "Laptop", price: 1300, rating: 4 },
    { id: 6, name: "Gaming Mouse Pad", category: "Mouse", price: 25, rating: 3 },
    { id: 7, name: "Mechanical Blue Switches", category: "Keyboard", price: 85, rating: 5 },
    { id: 8, name: "GTX 1650", category: "Graphics Card", price: 180, rating: 2 }
];

//Πίνακας για το καλάθι
let cart = [];

const productsGrid = document.getElementById('productsGrid');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalElement = document.getElementById('cartTotal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const priceValueDisplay = document.getElementById('priceValue');
const sortSelect = document.getElementById('sortSelect');


//Εμφανίζουμε τα προϊόντα όταν φορώτσει η σελιδα
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
});


//Δημιουργία καταλόγων δυναμικά
function displayProducts(productsList) {
    productsGrid.innerHTML = '';
    
    //Αν δεν υπάρχουν προϊόντα
    if (productsList.length === 0) {
        productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Δεν βρέθηκαν προϊόντα.</p>';
        return;
    }

    productsList.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        //Δημιουργία των αστεριών βάσει του rating
        const stars = "★".repeat(product.rating) + "☆".repeat(5-product.rating);
        
        card.innerHTML = `
            <small>${product.category}</small>
            <h3>${product.name}</h3>
            <div class="product-rating">${stars}</div>
            <div class="product-price">${product.price}€</div>
            <button class="btn btn-primary" onclick="addToCart(${product.id})" style="margin-top:10px; width:100%">Προσθήκη</button>
        `;
        productsGrid.appendChild(card);
    });
}

// Συνάρτηση φίλτρου

function updateView() {
    let filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchInput.value.toLowerCase());
        const matchesCategory = categoryFilter.value === 'all' || p.category === categoryFilter.value;
        const matchesPrice = p.price <= priceFilter.value;
        return matchesSearch && matchesCategory && matchesPrice;
    });

    //Ταξινόμηση των αποτελεσμάτων
    const sortBy = sortSelect.value;
    if (sortBy === 'priceAsc') filtered.sort((a, b) => a.price - b.price);
    else if (sortBy === 'priceDesc') filtered.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else filtered.sort((a, b) => a.name.localeCompare(b.name));

    //Εμφάνιση του νέου αποτελέσματος
    displayProducts(filtered);
}

//Event Listeners για τα φίλτρα
[searchInput, categoryFilter, priceFilter, sortSelect].forEach(el => {
    el.addEventListener('input', () => {
        //Ενημέρωση της ένδειξης τιμής
        if(el.id === 'priceFilter') priceValueDisplay.innerText = priceFilter.value;
        updateView();
    });
});


//Προσθήκη προϊόντος στο καλάθι
window.addToCart = (id) => {
    const product = products.find(p => p.id === id);
    const cartItem = cart.find(item => item.id === id);

    if (cartItem) {
        cartItem.qty++; //Αν υπάρχει, +1 στην ποσότητα
    } else {
        cart.push({ ...product, qty: 1 }); //Αν δεν υπάρχει, προσθήκη με qty 1
    }
    renderCart(); //Επανασχεδιασμός του καλαθιού στο UI
};

//Αφαίρεση προϊόντος
window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    renderCart();
};

//Αλλαγή ποσότητας (+1 ή -1)
window.changeQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.qty += delta;
        //Αν η ποσότητα πάει στο 0 ή λιγότερο, αφαιρούμε το προϊόν
        if (item.qty < 1) removeFromCart(id);
        else renderCart();
    }
};

//Συνάρτηση που σχεδιάζει το καλάθι στο DOM και υπολογίζει το σύνολο
function renderCart() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.price * item.qty; //Υπολογισμός συνόλου
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div>
                <strong>${item.name}</strong><br>
                <small>${item.price}€ x ${item.qty}</small>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
                <button class="btn btn-danger" onclick="removeFromCart(${item.id})">Χ</button>
            </div>
        `;
        cartItemsContainer.appendChild(div);
    });

    // Εμφάνιση συνόλου
    cartTotalElement.innerText = total.toFixed(2) + "€";
}