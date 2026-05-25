require('dotenv').config();
const db = require('../db');

const updates = [
    {
        name: 'Kejalux Cloud King Bed',
        images: ['/uploads/635.jpg'],
    },
    {
        name: 'Kejalux Heritage Wardrobe',
        images: ['/uploads/68870.jpg'],
    }
];

const run = async () => {
    try {
        for (const item of updates) {
            const updated = await db('products')
                .where('product_name', item.name)
                .update({ images: item.images })
                .returning(['id', 'product_name']);

            if (updated && updated.length) {
                console.log(`Updated: ${item.name}`);
            } else {
                console.log(`Skipped (not found): ${item.name}`);
            }
        }
    } catch (err) {
        console.error('Update failed:', err.message);
        process.exitCode = 1;
    } finally {
        await db.destroy();
    }
};

run();
