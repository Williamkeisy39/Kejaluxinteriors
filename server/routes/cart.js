const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/cart
router.get('/', auth, async (req, res) => {
    try {
        const user = await db('users').where('id', req.user.uid).first();
        res.json({
            totalItems: user.cart_total_items,
            totalPrice: Number(user.cart_total_price),
            items: user.cart_items || {},
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/cart — replace the whole cart
router.put('/', auth, async (req, res) => {
    try {
        const { totalItems, totalPrice, items } = req.body;
        await db('users').where('id', req.user.uid).update({
            cart_total_items: totalItems,
            cart_total_price: totalPrice,
            cart_items: JSON.stringify(items),
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/cart — clear cart
router.delete('/', auth, async (req, res) => {
    try {
        await db('users').where('id', req.user.uid).update({
            cart_total_items: 0,
            cart_total_price: 0,
            cart_items: JSON.stringify({}),
        });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
