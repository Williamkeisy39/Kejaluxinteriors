import { Badge, Box, Button, Flex, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

import Meta from '../../components/meta/Meta';
import { blogPosts } from '../../data/blogPosts';

const Blog = () => {
    return (
        <Box bg={'gray.50'} minH={'100vh'}>
            <Meta title={'Kejalux Journal | Interior Design & Furniture'} />
            <Flex
                direction={'column'}
                alignItems={'center'}
                paddingX={{ base: 6, lg: 12 }}
                paddingY={{ base: 12, lg: 16 }}
                gap={10}>
                <VStack spacing={3} textAlign={'center'} maxW={'2xl'}>
                    <Badge colorScheme={'orange'} variant={'subtle'}>Kejalux Journal</Badge>
                    <Text fontSize={{ base: '3xl', lg: '4xl' }} fontWeight={'bold'} color={'gray.900'}>
                        Design stories, furniture guides, and styling tips
                    </Text>
                    <Text color={'gray.600'}>
                        Explore the latest insights from Kejalux Interiors on furniture curation, interior styling, and home decor finishes.
                    </Text>
                </VStack>

                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w={'full'}>
                    {blogPosts.map((post) => (
                        <Box
                            key={post.slug}
                            bg={'white'}
                            rounded={'2xl'}
                            overflow={'hidden'}
                            boxShadow={'md'}
                            border={'1px solid'}
                            borderColor={'gray.100'}>
                            <Box position={'relative'} h={{ base: '200px', md: '220px' }} w={'full'}>
                                <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />
                            </Box>
                            <VStack align={'start'} spacing={3} p={6}>
                                <Badge colorScheme={'gold'} variant={'subtle'}>
                                    {post.category}
                                </Badge>
                                <Text fontWeight={'bold'} fontSize={'xl'} color={'gray.900'}>
                                    {post.title}
                                </Text>
                                <Text fontSize={'sm'} color={'gray.600'}>
                                    {post.excerpt}
                                </Text>
                                <HStack fontSize={'xs'} color={'gray.500'} spacing={4}>
                                    <Text>{post.date}</Text>
                                    <Text>{post.readTime}</Text>
                                </HStack>
                                <Link href={`/blog/${post.slug}`}>
                                    <Button variant={'outline'} size={'sm'}>
                                        Read Article
                                    </Button>
                                </Link>
                            </VStack>
                        </Box>
                    ))}
                </SimpleGrid>
            </Flex>
        </Box>
    );
};

export default Blog;
