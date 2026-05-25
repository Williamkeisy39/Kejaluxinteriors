const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const resolveImageUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_BASE}${url}`;
};

const normalizeProduct = (product) => {
    if (!product) return product;
    const images = Array.isArray(product.images)
        ? product.images.map(resolveImageUrl)
        : [];
    return { ...product, images };
};

const normalizeOrder = (order) => {
    if (!order) return order;
    const items = Array.isArray(order.items)
        ? order.items.map((item) => ({ ...item, img: resolveImageUrl(item.img) }))
        : [];
    return { ...order, items };
};

const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

const headers = (extra = {}) => {
    const h = { 'Content-Type': 'application/json', ...extra };
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
};

const handleRes = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Request failed');
    return data;
};

// Auth
export const apiSignup = (fullname, email, password) =>
    fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ fullname, email, password })
    }).then(handleRes);

export const apiLogin = (email, password) =>
    fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email, password })
    }).then(handleRes);

export const apiGetMe = () =>
    fetch(`${API_BASE}/api/auth/me`, { headers: headers() }).then(handleRes);

export const apiOAuthLogin = (provider, email, fullname, providerId) =>
    fetch(`${API_BASE}/api/auth/oauth`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ provider, email, fullname, providerId })
    }).then(handleRes);

// Products
export const apiGetProducts = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/api/products?${qs}`, { headers: headers() })
        .then(handleRes)
        .then((data) => ({
            ...data,
            products: Array.isArray(data.products) ? data.products.map(normalizeProduct) : []
        }));
};

export const apiGetProduct = (id) =>
    fetch(`${API_BASE}/api/products/${id}`, { headers: headers() })
        .then(handleRes)
        .then(normalizeProduct);

export const apiSearchProducts = (term) =>
    fetch(`${API_BASE}/api/products/search/${encodeURIComponent(term)}`, { headers: headers() })
        .then(handleRes)
        .then((results) => (Array.isArray(results) ? results.map(normalizeProduct) : []));

export const apiAddProduct = (formData) => {
    const token = getToken();
    const h = {};
    if (token) h['Authorization'] = `Bearer ${token}`;
    return fetch(`${API_BASE}/api/products`, {
        method: 'POST',
        headers: h,
        body: formData
    })
        .then(handleRes)
        .then(normalizeProduct);
};

export const apiDeleteProduct = (id) => {
    return fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: headers()
    }).then(handleRes);
};

// Cart
export const apiGetCart = () =>
    fetch(`${API_BASE}/api/cart`, { headers: headers() }).then(handleRes);

export const apiUpdateCart = (cart) =>
    fetch(`${API_BASE}/api/cart`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(cart)
    }).then(handleRes);

export const apiClearCart = () =>
    fetch(`${API_BASE}/api/cart`, {
        method: 'DELETE',
        headers: headers()
    }).then(handleRes);

// Wishlist
export const apiGetWishlist = () =>
    fetch(`${API_BASE}/api/wishlist`, { headers: headers() }).then(handleRes);

export const apiUpdateWishlist = (wishlist) =>
    fetch(`${API_BASE}/api/wishlist`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ wishlist })
    }).then(handleRes);

// Orders
export const apiGetOrders = () =>
    fetch(`${API_BASE}/api/orders`, { headers: headers() })
        .then(handleRes)
        .then((orders) => (Array.isArray(orders) ? orders.map(normalizeOrder) : []));

export const apiCreateOrder = (order) =>
    fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(order)
    })
        .then(handleRes)
        .then(normalizeOrder);

export const apiGetAllOrders = () =>
    fetch(`${API_BASE}/api/orders/all`, { headers: headers() })
        .then(handleRes)
        .then((orders) => (Array.isArray(orders) ? orders.map(normalizeOrder) : []));

export const apiUpdateOrderStatus = (orderId, status) =>
    fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ status })
    }).then(handleRes);
