const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db');
const auth = require('../middleware/auth');

// ── multer config ──
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const dir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename(req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── helpers ──
const STOP_WORDS = new Set([
    'a','an','and','are','about','as','at','again','against','be','by',
    'during','for','from','how','has','he','in','is','it','its','made',
    'of','on','that','the','to','very','was','were','who','when','what',
    'where','will','with','your',
]);

const rowToProduct = (r) => ({
    pid: r.id,
    productName: r.product_name,
    productPrice: Number(r.product_price),
    category: r.category,
    subcategory: r.subcategory || [],
    color: r.color || [],
    colorValue: r.color_value || [],
    width: Number(r.width),
    length: Number(r.length),
    height: Number(r.height),
    images: r.images || [],
    desc: r.description,
    createdAt: r.created_at,
});

const updateInvertedIndex = async (productId, productName, colors, desc) => {
    const tokens = (productName + ' ' + desc)
        .replace(/[\W_]+/g, ' ')
        .split(' ')
        .concat(colors || []);

    const uniqueTerms = new Set();
    tokens.forEach((t) => {
        const lower = t.toLowerCase().trim();
        if (lower && !STOP_WORDS.has(lower)) uniqueTerms.add(lower);
    });

    await Promise.all(
        Array.from(uniqueTerms).map(async (term) => {
            const existing = await db('search_index').where('term', term).first();
            if (existing) {
                const ids = existing.doc_ids || [];
                if (!ids.includes(productId)) {
                    await db('search_index')
                        .where('term', term)
                        .update({ doc_ids: db.raw("array_append(doc_ids, ?)", [productId]) });
                }
            } else {
                await db('search_index').insert({ term, doc_ids: [productId] });
            }
        })
    );
};

// GET /api/products?category=sofa&page=1&limit=20&minPrice=&maxPrice=&color=&subcategory=
router.get('/', async (req, res) => {
    try {
        const { category, page = 1, limit = 20, minPrice, maxPrice, color, subcategory } = req.query;
        let query = db('products');

        if (category) query = query.where('category', category);
        if (minPrice) query = query.where('product_price', '>=', Number(minPrice));
        if (maxPrice) query = query.where('product_price', '<=', Number(maxPrice));
        if (color) query = query.whereRaw('? = ANY(color)', [color]);
        if (subcategory) query = query.whereRaw('? = ANY(subcategory)', [subcategory]);

        const offset = (Number(page) - 1) * Number(limit);

        const [{ count }] = await query.clone().count('* as count');
        const total = Number(count);

        const rows = await query
            .orderBy('created_at', 'asc')
            .offset(offset)
            .limit(Number(limit));

        res.json({
            products: rows.map(rowToProduct),
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
            endOfData: offset + rows.length >= total,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/products/search/:term  — must be before /:id to avoid clash
router.get('/search/:term', async (req, res) => {
    try {
        const tokens = req.params.term.toLowerCase().split(' ');
        const idSets = await Promise.all(
            tokens.map(async (token) => {
                const row = await db('search_index').where('term', token).first();
                return row ? row.doc_ids : [];
            })
        );
        const allIds = [...new Set(idSets.flat())];
        if (allIds.length === 0) return res.json([]);

        const rows = await db('products').whereIn('id', allIds);
        res.json(rows.map(rowToProduct));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const row = await db('products').where('id', req.params.id).first();
        if (!row) return res.status(404).json({ message: 'Product not found' });
        res.json(rowToProduct(row));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/products  (admin – add product with images)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
    try {
        const b = req.body;
        const images = (req.files || []).map((f) => `/uploads/${f.filename}`);

        const [row] = await db('products')
            .insert({
                product_name: b.productName,
                product_price: Number(b.productPrice),
                category: b.category,
                subcategory: JSON.parse(b.subcategory || '[]'),
                color: JSON.parse(b.color || '[]'),
                color_value: JSON.parse(b.colorValue || '[]'),
                width: Number(b.width || 0),
                length: Number(b.length || 0),
                height: Number(b.height || 0),
                description: b.desc || '',
                images,
            })
            .returning('*');

        await updateInvertedIndex(
            row.id,
            row.product_name,
            row.color,
            row.description
        );

        res.status(201).json(rowToProduct(row));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/products/:id
router.delete('/:id', auth, async (req, res) => {
    try {
        const deleted = await db('products').where('id', req.params.id).del();
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        await db('search_index').whereRaw("? = ANY(doc_ids)", [req.params.id])
            .update({ doc_ids: db.raw("array_remove(doc_ids, ?)", [req.params.id]) });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
