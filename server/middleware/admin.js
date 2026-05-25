const normalizeEmails = (value) => (value || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

const adminEmails = normalizeEmails(process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL);

module.exports = function adminOnly(req, res, next) {
    const userEmail = req.user?.email?.toLowerCase();

    if (!userEmail) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (adminEmails.length === 0 || !adminEmails.includes(userEmail)) {
        return res.status(403).json({ message: 'Admin access required' });
    }

    return next();
};
