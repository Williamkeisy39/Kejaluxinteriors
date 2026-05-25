require('dotenv').config();
const db = require('../db');

const STOP_WORDS = new Set([
    'a','an','and','are','about','as','at','again','against','be','by',
    'during','for','from','how','has','he','in','is','it','its','made',
    'of','on','that','the','to','very','was','were','who','when','what',
    'where','will','with','your',
]);

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

const seedProducts = [
    {
        product_name: 'Kejalux Luxe 3-Seater Sofa',
        product_price: 125000,
        category: 'sofa',
        subcategory: ['living room'],
        color: ['Sand', 'Walnut'],
        color_value: ['#d2b48c', '#6e4b3a'],
        width: 210,
        length: 95,
        height: 85,
        images: ['/uploads/seed-sofa.jpg'],
        description: 'A refined, deep-seat sofa with plush cushions and a solid hardwood frame. Perfect for modern living rooms.'
    },
    {
        product_name: 'Kejalux Cloud King Bed',
        product_price: 185000,
        category: 'bed',
        subcategory: ['bedroom'],
        color: ['Ivory', 'Charcoal'],
        color_value: ['#f1e8dc', '#3d3d3d'],
        width: 200,
        length: 210,
        height: 120,
        images: ['/uploads/635.jpg'],
        description: 'A luxurious king bed with a tall upholstered headboard and sturdy slatted base for premium comfort.'
    },
    {
        product_name: 'Kejalux Heritage Wardrobe',
        product_price: 98000,
        category: 'wardrobe',
        subcategory: ['bedroom', 'storage'],
        color: ['Walnut', 'Ebony'],
        color_value: ['#7b4a2d', '#1f1f1f'],
        width: 160,
        length: 60,
        height: 210,
        images: ['/uploads/68870.jpg'],
        description: 'A spacious three-door wardrobe with soft-close hardware and a clean, modern profile.'
    }
];

const upsertProduct = async (product) => {
    const existing = await db('products')
        .where('product_name', product.product_name)
        .first();

    if (existing) {
        console.log(`Skipping existing: ${product.product_name}`);
        return existing;
    }

    const [row] = await db('products')
        .insert(product)
        .returning('*');

    await updateInvertedIndex(
        row.id,
        row.product_name,
        row.color,
        row.description
    );

    console.log(`Inserted: ${row.product_name}`);
    return row;
};

const run = async () => {
    try {
        for (const product of seedProducts) {
            await upsertProduct(product);
        }
    } catch (err) {
        console.error('Seed failed:', err.message);
        process.exitCode = 1;
    } finally {
        await db.destroy();
    }
};

run();
