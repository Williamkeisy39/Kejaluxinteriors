import { Box, Button, Flex, FormControl, FormLabel, Heading, HStack, Icon, Input, Link, SimpleGrid, Text, Textarea, VStack, useToast } from '@chakra-ui/react';
import { At, MapPinLine, WhatsappLogo } from 'phosphor-react';
import { useState } from 'react';
import Meta from '../components/meta/Meta';

const Contact = () => {
    const toast = useToast();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('https://formspree.io/f/mredabjk', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(form)
            });

            if (!response.ok) {
                throw new Error('Form submission failed');
            }

            toast({
                title: 'Thanks for reaching out!',
                description: 'We received your message and will get back to you shortly.',
                status: 'success',
                duration: 4000,
                isClosable: true
            });
            setForm({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast({
                title: 'Message not sent',
                description: 'Please try again in a moment or reach us via WhatsApp.',
                status: 'error',
                duration: 4000,
                isClosable: true
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box bg={'gray.50'} minH={'100vh'}>
            <Meta title={'Contact Us | Kejalux Interiors'} />
            <Flex
                direction={'column'}
                alignItems={'center'}
                paddingX={{ base: 6, lg: 12 }}
                paddingY={{ base: 12, lg: 16 }}
                gap={10}>
                <VStack spacing={3} textAlign={'center'} maxW={'2xl'}>
                    <Heading size={'xl'} textColor={'gray.900'}>Let’s Design Your Space</Heading>
                    <Text color={'gray.600'}>
                        Tell us about your project and we’ll recommend the right interior solutions for your home or business.
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10} w={'full'}>
                    <Box
                        bg={'white'}
                        rounded={'2xl'}
                        shadow={'sm'}
                        p={{ base: 6, md: 8 }}>
                        <form onSubmit={handleSubmit}>
                            <VStack spacing={4} align={'stretch'}>
                                <FormControl isRequired>
                                    <FormLabel>Name</FormLabel>
                                    <Input
                                        name={'name'}
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder={'Your full name'}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Email</FormLabel>
                                    <Input
                                        type={'email'}
                                        name={'email'}
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder={'you@example.com'}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Phone</FormLabel>
                                    <Input
                                        name={'phone'}
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder={'+254 7XX XXX XXX'}
                                    />
                                </FormControl>
                                <FormControl isRequired>
                                    <FormLabel>Project Details</FormLabel>
                                    <Textarea
                                        name={'message'}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder={'Tell us about the space, style, and timeline...'}
                                        rows={5}
                                    />
                                </FormControl>
                                <Button type={'submit'} size={'lg'} isLoading={isSubmitting}>
                                    Send Message
                                </Button>
                            </VStack>
                        </form>
                    </Box>

                    <VStack
                        align={'stretch'}
                        spacing={6}
                        bg={'white'}
                        rounded={'2xl'}
                        shadow={'sm'}
                        p={{ base: 6, md: 8 }}>
                        <Text fontWeight={'bold'} fontSize={'lg'} textColor={'gray.900'}>
                            Contact Details
                        </Text>
                        <Text color={'gray.600'}>
                            Prefer a quick response? Reach us directly or start a WhatsApp conversation.
                        </Text>
                        <VStack align={'flex-start'} spacing={4}>
                            <HStack>
                                <Icon as={MapPinLine} color={'gold.500'} />
                                <Text>Nairobi, Kenya</Text>
                            </HStack>
                            <HStack>
                                <Icon as={At} color={'gold.500'} />
                                <Text>info@kejalux.com</Text>
                            </HStack>
                            <HStack>
                                <Icon as={WhatsappLogo} color={'gold.500'} />
                                <Text>+254782223749</Text>
                            </HStack>
                        </VStack>
                        <Button
                            as={Link}
                            href={'https://wa.me/254782223749'}
                            target={'_blank'}
                            size={'lg'}
                            variant={'outline'}>
                            Chat on WhatsApp
                        </Button>
                    </VStack>
                </SimpleGrid>
            </Flex>
        </Box>
    );
};

export default Contact;
