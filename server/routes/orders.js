const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const rowToOrder = (r) => ({
    pid: r.id,
    orderId: r.id,
    uid: r.user_id,
    status: r.status,
    totalPrice: Number(r.total_price),
    phone: r.phone,
    email: r.email,
    fullname: r.fullname,
    state: r.state,
    city: r.city,
    items: r.items || [],
    date: r.created_at,
});

// GET /api/orders — current user's orders
router.get('/', auth, async (req, res) => {
    try {
        const rows = await db('orders')
            .where('user_id', req.user.uid)
            .orderBy('created_at', 'desc');
        res.json(rows.map(rowToOrder));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/orders — create order
router.post('/', auth, async (req, res) => {
    try {
        const { totalPrice, phone, email, fullname, state, city, items } = req.body;
        const [row] = await db('orders')
            .insert({
                user_id: req.user.uid,
                total_price: totalPrice,
                phone,
                email,
                fullname,
                state,
                city,
                items: JSON.stringify(items),
            })
            .returning('*');
        res.status(201).json(rowToOrder(row));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/orders/all — admin: all orders
router.get('/all', auth, adminOnly, async (req, res) => {
    try {
        const rows = await db('orders').orderBy('created_at', 'desc');
        res.json(rows.map(rowToOrder));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PATCH /api/orders/:id/status — admin: update status
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
    try {
        const { status } = req.body;
        await db('orders').where('id', req.params.id).update({ status });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
