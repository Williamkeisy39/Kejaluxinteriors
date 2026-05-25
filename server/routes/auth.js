const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middleware/auth');

const signToken = (user) =>
    jwt.sign({ uid: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

const userToProfile = (u) => ({
    uid: u.id,
    email: u.email,
    displayName: u.fullname,
    cart: {
        totalItems: u.cart_total_items,
        totalPrice: Number(u.cart_total_price),
        items: u.cart_items || {},
    },
    wishlist: u.wishlist || [],
});

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password)
            return res.status(400).json({ message: 'All fields are required' });

        const exists = await db('users').where('email', email.toLowerCase()).first();
        if (exists) return res.status(409).json({ message: 'Email already in use' });

        const hashed = await bcrypt.hash(password, 12);
        const [user] = await db('users')
            .insert({ fullname, email: email.toLowerCase(), password: hashed })
            .returning('*');

        const token = signToken(user);
        res.status(201).json({ token, user: userToProfile(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });

        const user = await db('users').where('email', email.toLowerCase()).first();
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid email or password' });

        const token = signToken(user);
        res.json({ token, user: userToProfile(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/auth/me
router.get('/me', auth, async (req, res) => {
    try {
        const user = await db('users').where('id', req.user.uid).first();
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(userToProfile(user));
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/oauth — social login (Google/Apple)
router.post('/oauth', async (req, res) => {
    try {
        const { provider, email, fullname, providerId } = req.body;
        if (!email || !provider || !providerId)
            return res.status(400).json({ message: 'Missing OAuth data' });

        let user = await db('users').where('email', email.toLowerCase()).first();

        if (!user) {
            // Create a new user with a random password (they'll use OAuth)
            const randomPass = require('crypto').randomBytes(32).toString('hex');
            const hashed = await bcrypt.hash(randomPass, 12);
            const [newUser] = await db('users')
                .insert({
                    fullname: fullname || email.split('@')[0],
                    email: email.toLowerCase(),
                    password: hashed,
                    oauth_provider: provider,
                    oauth_id: providerId
                })
                .returning('*');
            user = newUser;
        }

        const token = signToken(user);
        res.json({ token, user: userToProfile(user) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
