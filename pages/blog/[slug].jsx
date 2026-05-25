import { Badge, Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'phosphor-react';

import Meta from '../../components/meta/Meta';
import { blogPosts } from '../../data/blogPosts';

const BlogDetail = () => {
    const router = useRouter();
    const { slug } = router.query;
    const post = blogPosts.find((item) => item.slug === slug);

    if (!post) {
        return (
            <Box bg={'gray.50'} minH={'100vh'}>
                <Meta title={'Kejalux Journal | Article'} />
                <Flex
                    direction={'column'}
                    alignItems={'center'}
                    justifyContent={'center'}
                    minH={'60vh'}
                    px={{ base: 6, lg: 12 }}
                    textAlign={'center'}>
                    <Text fontSize={'2xl'} fontWeight={'bold'} color={'gray.900'}>
                        Article not found
                    </Text>
                    <Text color={'gray.600'} mt={2}>
                        The blog post you are looking for does not exist yet.
                    </Text>
                    <Link href={'/blog'}>
                        <Button mt={6} variant={'outline'}>
                            Back to Blog
                        </Button>
                    </Link>
                </Flex>
            </Box>
        );
    }

    return (
        <Box bg={'gray.50'} minH={'100vh'}>
            <Meta title={`${post.title} | Kejalux Journal`} />
            <Flex direction={'column'} alignItems={'center'} px={{ base: 6, lg: 16 }} py={{ base: 12, lg: 16 }} gap={10}>
                <Flex w={'full'} maxW={'4xl'} justifyContent={'flex-start'}>
                    <Button
                        size={'sm'}
                        variant={'ghost'}
                        leftIcon={<ArrowLeft size={16} />}
                        onClick={() => router.back()}>
                        Back
                    </Button>
                </Flex>
                <VStack spacing={4} textAlign={'center'} maxW={'3xl'}>
                    <Badge colorScheme={'orange'} variant={'subtle'}>
                        {post.category}
                    </Badge>
                    <Text fontSize={{ base: '3xl', lg: '4xl' }} fontWeight={'bold'} color={'gray.900'}>
                        {post.title}
                    </Text>
                    <HStack fontSize={'sm'} color={'gray.500'} spacing={4}>
                        <Text>{post.date}</Text>
                        <Text>{post.readTime}</Text>
                    </HStack>
                </VStack>

                <Box w={'full'} maxW={'4xl'}>
                    <Box position={'relative'} w={'full'} h={{ base: '240px', md: '360px' }} rounded={'2xl'} overflow={'hidden'}>
                        <Image src={post.image} alt={post.title} fill style={{ objectFit: 'cover' }} />
                    </Box>
                </Box>

                <VStack spacing={5} maxW={'3xl'} align={'start'} color={'gray.700'}>
                    {post.content.map((paragraph, index) => (
                        <Text key={index} fontSize={'md'} lineHeight={'tall'}>
                            {paragraph}
                        </Text>
                    ))}
                    <Link href={'/contact'}>
                        <Button variant={'solid'}>Book a Design Call</Button>
                    </Link>
                </VStack>
            </Flex>
        </Box>
    );
};

export default BlogDetail;
