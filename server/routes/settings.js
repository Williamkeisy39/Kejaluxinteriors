const router = require('express').Router();
const db = require('../db');
const auth = require('../middleware/auth');
const adminOnly = require('../middleware/admin');

const parseSettingValue = (value) => {
    if (typeof value !== 'string') return value;
    try {
        return JSON.parse(value);
    } catch (err) {
        return value;
    }
};

// GET /api/settings/:key — get a setting by key
router.get('/:key', async (req, res) => {
    try {
        const row = await db('settings').where('key', req.params.key).first();
        if (!row) return res.status(404).json({ message: 'Setting not found' });
        res.json(parseSettingValue(row.value));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT /api/settings/:key — update a setting (admin only)
router.put('/:key', auth, adminOnly, async (req, res) => {
    try {
        const { value } = req.body;
        const exists = await db('settings').where('key', req.params.key).first();
        if (exists) {
            await db('settings').where('key', req.params.key).update({ value, updated_at: new Date() });
        } else {
            await db('settings').insert({ key: req.params.key, value });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
