// ==================== AUTH ====================
const authDiv = document.getElementById('auth');
const appDiv = document.getElementById('app');

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

function showLogin() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

function register() {
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    if (!name || !email || !password) {
        alert('Preencha todos os campos!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.find(user => user.email === email)) {
        alert('Email já cadastrado!');
        return;
    }

    users.push({ name, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Cadastro realizado com sucesso!');
    showLogin();
}

function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        alert('Email ou senha inválidos!');
        return;
    }

    localStorage.setItem('loggedUser', JSON.stringify(user));
    authDiv.classList.add('hidden');
    appDiv.classList.remove('hidden');
    fetchProducts();
    renderCart();
}

function logout() {
    localStorage.removeItem('loggedUser');
    authDiv.classList.remove('hidden');
    appDiv.classList.add('hidden');
}

// ==================== PRODUCTS & CART ====================
const productList = document.getElementById('product-list');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const cartSection = document.getElementById('cart');

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function fetchProducts() {
    fetch('https://fakestoreapi.com/products')
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
        });
}

function renderProducts(products) {
    productList.innerHTML = '';
    products.forEach(product => {
        const div = document.createElement('div');
        div.className = 'product';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>R$ ${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price})">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(div);
    });
}

function addToCart(id, title, price) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ id, title, price, quantity: 1 });
    }
    saveCart();
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <h4>${item.title}</h4>
            <p>R$ ${item.price.toFixed(2)} x ${item.quantity}</p>
            <button onclick="removeFromCart(${item.id})">Remover</button>
        `;
        cartItems.appendChild(div);
    });
    cartTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    renderCart();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function toggleCart() {
    cartSection.classList.toggle('hidden');
}

function checkout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    alert('Compra realizada com sucesso!');
    cart = [];
    saveCart();
    renderCart();
}

// ==================== AUTO LOGIN ====================
window.onload = function() {
    const user = JSON.parse(localStorage.getItem('loggedUser'));
    if (user) {
        authDiv.classList.add('hidden');
        appDiv.classList.remove('hidden');
        fetchProducts();
        renderCart();
    }
};
