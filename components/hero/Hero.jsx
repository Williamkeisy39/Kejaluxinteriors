import { Badge, Box, Button, Flex, HStack, Icon, Stack, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Truck, ShieldCheck, Star } from "phosphor-react";

import interiorOne from '../../public/interiorsone.jpg'
import interiorTwo from '../../public/interiorstwo.jpg'
import interiorThree from '../../public/interiorsthree.jpg'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
        opacity: 1,
        y: 0,
        transition: { delay: 0.3 + i * 0.15, duration: 0.6, ease: 'easeOut' }
    })
}

const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { delay: 0.8, duration: 0.7, ease: 'easeOut' }
    }
}

const sectionReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
}

const FeaturePill = ({ icon, text }) => (
    <HStack
        bg={'whiteAlpha.800'}
        backdropFilter={'blur(8px)'}
        rounded={'full'}
        px={{ base: 3, md: 4 }}
        py={{ base: 1.5, md: 2 }}
        spacing={2}
        shadow={'sm'}
        border={'1px solid'}
        borderColor={'gray.100'}>
        <Icon as={icon} boxSize={4} color={'gold.500'} weight={'fill'} />
        <Text fontSize={{ base: 'xs', md: 'sm' }} fontWeight={'semibold'} color={'gray.700'}>
            {text}
        </Text>
    </HStack>
)

const featureIcons = [Truck, ShieldCheck, Star];
const localHeroImages = [interiorOne, interiorTwo, interiorThree];

const Hero = () => {
    const [content, setContent] = useState({
        badge: "Kenya's Finest Furniture",
        headline: "Elevate Every Room with Kejalux",
        subtitle: "Interior decor, business furniture, and outdoor pallet pieces — handcrafted for comfort, built to last.",
        ctaPrimary: "Explore Collection",
        ctaSecondary: "Get a Quote",
        features: ["Free Delivery in Nairobi", "6-Month Warranty", "Custom Orders"]
    });
    const [banners, setBanners] = useState([]);
    const [activeImage, setActiveImage] = useState(0);

    const heroImages = banners.length
        ? banners.map((banner) => {
            if (!banner?.image_url) return null;
            return banner.image_url.startsWith('http')
                ? banner.image_url
                : `${API_URL}${banner.image_url}`;
        }).filter(Boolean)
        : localHeroImages;

    useEffect(() => {
        fetch(`${API_URL}/api/settings/hero`)
            .then(r => r.json())
            .then(data => { if (data && data.badge) setContent(data); })
            .catch(() => {});

        fetch(`${API_URL}/api/banners`)
            .then(r => r.json())
            .then(data => { if (Array.isArray(data)) setBanners(data); })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (heroImages.length <= 1) return;
        const timer = setInterval(() => {
            setActiveImage((prev) => (prev + 1) % heroImages.length);
        }, 5500);
        return () => clearInterval(timer);
    }, [heroImages.length]);

    return (
        <Flex
            as={motion.section}
            variants={sectionReveal}
            initial={'hidden'}
            whileInView={'visible'}
            viewport={{ once: true, amount: 0.25 }}
            position={'relative'}
            minHeight={{ base: '80vh', lg: '92vh' }}
            overflow={'hidden'}
            bg={'gray.50'}>

            {/* Background image */}
            <Box
                position={'absolute'}
                inset={0}
                zIndex={0}>
                {heroImages.map((image, index) => {
                    const key = typeof image === 'string' ? image : image.src;
                    return (
                        <Box
                            key={key}
                            position={'absolute'}
                            inset={0}
                            opacity={index === activeImage ? 1 : 0}
                            transform={index === activeImage ? 'translateX(0)' : 'translateX(6%)'}
                            transition={'opacity 1.4s ease, transform 1.4s ease'}>
                            <Image
                                src={image}
                                alt={`Kejalux hero showcase ${index + 1}`}
                                priority={index === 0}
                                fill
                                style={{ objectFit: 'cover', objectPosition: 'center' }}
                            />
                        </Box>
                    );
                })}
                <Box
                    position={'absolute'}
                    inset={0}
                    bg={'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.12) 100%)'}
                />
            </Box>

            {/* Content */}
            <Flex
                position={'relative'}
                zIndex={1}
                w={'full'}
                paddingX={{ base: 6, md: 10, lg: 16 }}
                paddingY={{ base: 16, lg: 0 }}
                alignItems={'center'}
                justifyContent={'flex-start'}>

                <VStack
                    alignItems={{ base: 'stretch', md: 'flex-start' }}
                    maxWidth={{ base: '100%', md: '600px', lg: '560px' }}
                    w={'full'}
                    spacing={6}
                    bg={'whiteAlpha.800'}
                    backdropFilter={'blur(10px)'}
                    px={{ base: 6, md: 8 }}
                    py={{ base: 6, md: 7 }}
                    rounded={'2xl'}
                    border={'1px solid'}
                    borderColor={'whiteAlpha.700'}
                    boxShadow={'xl'}>

                    <Badge
                        as={motion.div}
                        variants={fadeUp}
                        custom={0}
                        initial={'hidden'}
                        animate={'visible'}
                        bg={'gray.900'}
                        color={'white'}
                        px={4}
                        py={1.5}
                        rounded={'full'}
                        fontSize={'xs'}
                        fontWeight={'bold'}
                        letterSpacing={'wider'}
                        textTransform={'uppercase'}>
                        {content.badge}
                    </Badge>

                    <Text
                        as={motion.h1}
                        variants={fadeUp}
                        custom={1}
                        initial={'hidden'}
                        animate={'visible'}
                        fontWeight={'black'}
                        fontSize={{ base: '3xl', sm: '4xl', md: '5xl', lg: '6xl' }}
                        textColor={'gray.900'}
                        lineHeight={'1.1'}
                        letterSpacing={'tight'}>
                        {content.headline.includes('Kejalux') ? (
                            <>
                                {content.headline.split('Kejalux')[0]}
                                <Text as={'span'} color={'gold.500'}>Kejalux</Text>
                                {content.headline.split('Kejalux')[1]}
                            </>
                        ) : content.headline}
                    </Text>

                    <Text
                        as={motion.p}
                        variants={fadeUp}
                        custom={2}
                        initial={'hidden'}
                        animate={'visible'}
                        textColor={'gray.600'}
                        maxWidth={'lg'}
                        fontSize={{ base: 'md', lg: 'lg' }}
                        lineHeight={'tall'}
                        fontWeight={'normal'}>
                        {content.subtitle}
                    </Text>

                    <Stack
                        as={motion.div}
                        variants={fadeUp}
                        custom={3}
                        initial={'hidden'}
                        animate={'visible'}
                        spacing={3}
                        direction={{ base: 'column', sm: 'row' }}
                        align={{ base: 'stretch', sm: 'center' }}
                        w={'full'}>
                        <Link href={'/products'}>
                            <Button
                                variant={'solid'}
                                size={{ base: 'md', md: 'lg' }}
                                px={{ base: 6, md: 10 }}
                                w={{ base: 'full', sm: 'auto' }}>
                                {content.ctaPrimary}
                            </Button>
                        </Link>
                        <Link href={'/contact'}>
                            <Button
                                size={{ base: 'md', md: 'lg' }}
                                px={{ base: 6, md: 10 }}
                                w={{ base: 'full', sm: 'auto' }}
                                bg={'transparent'}
                                color={'gray.800'}
                                border={'2px solid'}
                                borderColor={'gray.800'}
                                _hover={{ bg: 'gray.900', color: 'white' }}
                                fontWeight={'semibold'}>
                                {content.ctaSecondary}
                            </Button>
                        </Link>
                    </Stack>

                    <Flex
                        as={motion.div}
                        variants={fadeUp}
                        custom={4}
                        initial={'hidden'}
                        animate={'visible'}
                        wrap={'wrap'}
                        gap={{ base: 2, md: 3 }}
                        mt={2}>
                        {content.features.map((feat, i) => (
                            <FeaturePill key={i} icon={featureIcons[i] || Star} text={feat} />
                        ))}
                    </Flex>

                    <HStack spacing={2} pt={4} opacity={0.8}>
                        {heroImages.map((image, index) => (
                            <Box
                                key={`dot-${typeof image === 'string' ? image : image.src}`}
                                width={index === activeImage ? '18px' : '8px'}
                                height={'8px'}
                                rounded={'full'}
                                bg={index === activeImage ? 'gold.500' : 'gray.300'}
                                transition={'all 0.3s ease'}
                            />
                        ))}
                    </HStack>

                </VStack>
            </Flex>
        </Flex>
    )
}

export default Hero