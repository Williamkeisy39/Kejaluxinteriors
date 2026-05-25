import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import Meta from '../components/meta/Meta'

const Terms = () => {
    return (
        <Flex
            as={'section'}
            flexDirection={'column'}
            paddingX={{ base: 6, lg: 20 }}
            paddingY={{ base: 8, lg: 16 }}
            maxW={'4xl'}
            mx={'auto'}>
            <Meta title={'Terms & Conditions | Kejalux Interiors'} />

            <Heading
                as={'h1'}
                fontSize={{ base: '2xl', lg: '3xl' }}
                fontWeight={'bold'}
                textColor={'black'}
                mb={6}>
                Terms and Conditions
            </Heading>

            <VStack spacing={6} align={'start'}>
                <Text fontWeight={'medium'} textColor={'gray.800'}>
                    Last updated: January 2025
                </Text>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        1. General
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        By accessing and using the Kejalux Interiors website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        2. Products and Pricing
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        All products displayed on our website are subject to availability. Prices are listed in Kenyan Shillings (KSh) and include applicable taxes unless stated otherwise. We reserve the right to update pricing at any time without prior notice. Product images are for illustration purposes; actual items may vary slightly in color or texture.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        3. Orders and Payment
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        Once an order is placed, you will receive a confirmation. Payment must be completed before dispatch. We accept mobile payments (M-Pesa), bank transfers, and supported card payments. Orders may be cancelled before dispatch by contacting us directly.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        4. Delivery
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        We deliver within Nairobi and surrounding areas. Delivery timelines vary based on product availability and your location. Estimated delivery times will be communicated upon order confirmation. Delivery fees may apply depending on the distance and order size.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        5. Returns and Refunds
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        If you receive a damaged or defective product, contact us within 48 hours of delivery with photos of the damage. We will arrange a replacement or refund at our discretion. Custom-made or made-to-order items are not eligible for returns unless defective. Refunds are processed within 7-14 business days.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        6. Warranty
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        Our furniture comes with a limited warranty covering manufacturing defects for 6 months from the date of delivery. Normal wear and tear, misuse, or damage caused by the customer is not covered under warranty.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        7. Intellectual Property
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        All content on this website including text, images, logos, and designs is the property of Kejalux Interiors and is protected by copyright laws. Reproduction without written consent is prohibited.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        8. Limitation of Liability
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        Kejalux Interiors shall not be liable for indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability shall not exceed the purchase price of the product in question.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        9. Contact
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        For questions regarding these terms, reach us at info@kejalux.com or WhatsApp +254782223749.
                    </Text>
                </Box>
            </VStack>
        </Flex>
    )
}

export default Terms
