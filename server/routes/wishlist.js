const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');

// GET /api/wishlist
router.get('/', auth, async (req, res) => {
    try {
        const user = await db('users').where('id', req.user.uid).first();
        res.json(user.wishlist || []);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/wishlist — replace the whole wishlist array
router.put('/', auth, async (req, res) => {
    try {
        const { wishlist } = req.body;
        await db('users').where('id', req.user.uid).update({ wishlist });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
