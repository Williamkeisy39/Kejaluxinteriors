import { AspectRatio, Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import interiorTwo from '../../public/interiorstwo.jpg';

const VIDEO_SRC = '/kejalux-showreel.mp4';

const sectionReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

const VideoShowcase = () => {
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
            gap={{ base: 6, lg: 8 }}>
            <VStack alignItems={{ base: 'flex-start', lg: 'center' }} spacing={4} textAlign={{ lg: 'center' }}>
                <Text
                    fontWeight={'bold'}
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    textColor={'gray.900'}>
                    Inside Kejalux Interiors
                </Text>
                <Text fontSize={'sm'} textColor={'gray.600'}>
                    A quick look at our craftsmanship, custom builds, and styling process for homes and businesses.
                </Text>
                <HStack>
                    <Link href={'/products'}>
                        <Button variant={'solid'}>Explore Collection</Button>
                    </Link>
                    <Link href={'/contact'}>
                        <Button variant={'outline'}>Talk to a Designer</Button>
                    </Link>
                </HStack>
            </VStack>

            <Box w={'full'}>
                <AspectRatio ratio={16 / 9} w={'full'}>
                    <Box
                        as={'video'}
                        src={VIDEO_SRC}
                        controls
                        poster={interiorTwo.src}
                        style={{ borderRadius: '18px', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                </AspectRatio>
            </Box>
        </Flex>
    );
};

export default VideoShowcase;
