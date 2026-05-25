import Head from 'next/head'

const Meta = ({ title, keywords, description }) => {
    return (
        <Head>
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='keywords' content={keywords} />
            <meta name='description' content={description} />
            <meta charSet='utf-8' />
            <link rel='icon' type='image/png' href='/kejaluxfv.png' />
            <title>{title}</title>
        </Head>
    )
}

Meta.defaultProps = {
    title: 'Kejalux Interiors | Premium Furniture & Interior Decor',
    keywords: 'furniture, interior decor, business furniture, outdoor pallet furniture, office furniture, sofa, bed, wardrobe, shelves, TV console, pallet furniture, Kejalux',
    description: 'Kejalux Interiors — premium interior decor, business furniture, outdoor pallet furniture, and custom-made furniture solutions in Kenya.'
}

export default Meta