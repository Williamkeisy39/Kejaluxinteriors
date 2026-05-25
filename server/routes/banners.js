const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = path.join(__dirname, '..', 'uploads', 'banners');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename(req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/banners — list all banners
router.get('/', async (req, res) => {
    try {
        const rows = await db('banners').orderBy('sort_order', 'asc');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/banners — upload a new banner
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'Image is required' });
        const image_url = `/uploads/banners/${req.file.filename}`;
        const maxOrder = await db('banners').max('sort_order as max').first();
        const sort_order = (maxOrder?.max || 0) + 1;
        const [row] = await db('banners').insert({ image_url, sort_order }).returning('*');
        res.status(201).json(row);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/banners/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const banner = await db('banners').where('id', req.params.id).first();
        if (!banner) return res.status(404).json({ message: 'Banner not found' });
        // Delete file
        const filePath = path.join(__dirname, '..', banner.image_url);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        await db('banners').where('id', req.params.id).del();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
