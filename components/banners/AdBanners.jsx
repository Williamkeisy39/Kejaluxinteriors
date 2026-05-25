import { Badge, Box, Button, Flex, HStack, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { resolveImageUrl } from '../../utils/api';

import interiorOne from '../../public/interiorsone.jpg';
import interiorTwo from '../../public/interiorstwo.jpg';
import interiorThree from '../../public/interiorsthree.jpg';

const bannerCards = [
    {
        title: 'Interior Design Refresh',
        subtitle: 'Mood-led palettes, custom layouts, and furniture that fits your space.',
        cta: 'Book a Design Call',
        href: '/contact',
        tag: 'Design Service',
        image: interiorOne
    },
    {
        title: 'Office & Business Fit-outs',
        subtitle: 'Elevate client-facing spaces with premium desks, lounges, and storage.',
        cta: 'Get a Quote',
        href: '/contact',
        tag: 'Commercial',
        image: interiorTwo
    },
    {
        title: 'Outdoor Retreats',
        subtitle: 'Weather-ready pallet designs crafted for patios, cafes, and gardens.',
        cta: 'Explore Pieces',
        href: '/products',
        tag: 'Outdoor Living',
        image: interiorThree
    }
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const sectionReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

const AdBanners = () => {
    const [banners, setBanners] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/banners`)
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data)) setBanners(data);
            })
            .catch(() => {});
    }, []);

    const bannerItems = useMemo(() => {
        if (!banners.length) return bannerCards;

        const mapped = bannerCards.map((card, index) => {
            const banner = banners[index];
            return {
                ...card,
                image: banner?.image_url ? resolveImageUrl(banner.image_url) : card.image
            };
        });

        const extras = banners.slice(bannerCards.length).map((banner, index) => ({
            title: `Design Feature ${index + 1}`,
            subtitle: 'Custom interiors curated for modern Kenyan homes and commercial spaces.',
            cta: 'Get a Quote',
            href: '/contact',
            tag: 'Interior Design',
            image: resolveImageUrl(banner.image_url)
        }));

        return [...mapped, ...extras];
    }, [banners]);

    return (
        <Flex
            as={motion.section}
            variants={sectionReveal}
            initial={'hidden'}
            whileInView={'visible'}
            viewport={{ once: true, amount: 0.2 }}
            paddingX={{ base: 6, lg: 12 }}
            paddingY={{ base: 10, lg: 16 }}
            direction={'column'}
            alignItems={'center'}
            gap={6}>
            <VStack spacing={2} textAlign={'center'}>
                <Text
                    fontWeight={'bold'}
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    textColor={'gray.900'}>
                    Interior Design Highlights
                </Text>
                <Text
                    fontWeight={'medium'}
                    fontSize={'sm'}
                    textColor={'gray.600'}
                    maxW={'lg'}>
                    Curated adverts showcasing design services and collections tailored for Kenyan spaces.
                </Text>
            </VStack>

            <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3 }}
                spacing={6}
                w={'full'}>
                {bannerItems.map((banner) => (
                    <Box
                        key={banner.title}
                        position={'relative'}
                        minH={{ base: '220px', lg: '260px' }}
                        rounded={'2xl'}
                        overflow={'hidden'}
                        border={'1px solid'}
                        borderColor={'gray.100'}
                        boxShadow={'lg'}>
                        <Image
                            src={banner.image}
                            alt={banner.title}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        <Box
                            position={'absolute'}
                            inset={0}
                            bg={'linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.2) 100%)'}
                        />
                        <Flex
                            position={'relative'}
                            h={'full'}
                            p={6}
                            direction={'column'}
                            justifyContent={'space-between'}>
                            <Badge
                                alignSelf={'flex-start'}
                                bg={'whiteAlpha.800'}
                                color={'gray.800'}
                                px={3}
                                py={1}
                                rounded={'full'}
                                textTransform={'uppercase'}
                                fontSize={'xs'}>
                                {banner.tag}
                            </Badge>
                            <VStack alignItems={'flex-start'} spacing={3}>
                                <Text
                                    fontSize={{ base: 'xl', lg: '2xl' }}
                                    fontWeight={'bold'}
                                    color={'white'}>
                                    {banner.title}
                                </Text>
                                <Text fontSize={'sm'} color={'whiteAlpha.800'}>
                                    {banner.subtitle}
                                </Text>
                            </VStack>
                            <HStack>
                                <Link href={banner.href}>
                                    <Button
                                        size={'sm'}
                                        bg={'white'}
                                        color={'gray.900'}
                                        _hover={{ bg: 'gold.400', color: 'white' }}>
                                        {banner.cta}
                                    </Button>
                                </Link>
                            </HStack>
                        </Flex>
                    </Box>
                ))}
            </SimpleGrid>
        </Flex>
    );
};

export default AdBanners;
