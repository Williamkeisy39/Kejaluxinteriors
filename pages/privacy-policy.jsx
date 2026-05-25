import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import Meta from '../components/meta/Meta'

const PrivacyPolicy = () => {
    return (
        <Flex
            as={'section'}
            flexDirection={'column'}
            paddingX={{ base: 6, lg: 20 }}
            paddingY={{ base: 8, lg: 16 }}
            maxW={'4xl'}
            mx={'auto'}>
            <Meta title={'Privacy Policy | Kejalux Interiors'} />

            <Heading
                as={'h1'}
                fontSize={{ base: '2xl', lg: '3xl' }}
                fontWeight={'bold'}
                textColor={'black'}
                mb={6}>
                Privacy Policy
            </Heading>

            <VStack spacing={6} align={'start'}>
                <Text fontWeight={'medium'} textColor={'gray.800'}>
                    Last updated: January 2025
                </Text>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        1. Information We Collect
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        When you visit our website, create an account, or make a purchase, we may collect personal information including your name, email address, phone number, delivery address, and payment details. We also collect browsing data such as pages visited and products viewed to improve your shopping experience.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        2. How We Use Your Information
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        We use your information to process orders, manage your account, communicate order updates, provide customer support, send promotional offers (with your consent), and improve our website and services. We do not sell or rent your personal data to third parties.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        3. Data Security
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        We implement industry-standard security measures to protect your personal information. Passwords are encrypted, and sensitive data is transmitted via secure connections. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        4. Cookies
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        Our website uses cookies and similar technologies to remember your preferences, keep you logged in, and understand how you interact with our site. You can control cookie settings through your browser preferences.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        5. Third-Party Services
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        We may share limited information with trusted third-party service providers for payment processing and delivery services. These partners are required to protect your information and use it only for the specified purpose.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        6. Your Rights
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        You have the right to access, update, or delete your personal information at any time through your account settings. You can also opt out of marketing communications by contacting us or using the unsubscribe link in our emails.
                    </Text>
                </Box>

                <Box>
                    <Heading as={'h2'} fontSize={'xl'} mb={2} textColor={'black'}>
                        7. Contact Us
                    </Heading>
                    <Text textColor={'gray.700'} lineHeight={'tall'}>
                        If you have questions about this Privacy Policy, contact us at info@kejalux.com or call +254782223749.
                    </Text>
                </Box>
            </VStack>
        </Flex>
    )
}

export default PrivacyPolicy
