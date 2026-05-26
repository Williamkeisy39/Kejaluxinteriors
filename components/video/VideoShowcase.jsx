import { AspectRatio, Box, Button, Flex, Stack, Text, VStack } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import interiorTwo from '../../public/interiorstwo.jpg';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const VIDEO_SRC = '';

const defaultContent = {
    title: 'Inside Kejalux Interiors',
    subtitle: 'A quick look at our craftsmanship, custom builds, and styling process for homes and businesses.',
    ctaPrimary: 'Explore Collection',
    ctaPrimaryLink: '/products',
    ctaSecondary: 'Talk to a Designer',
    ctaSecondaryLink: '/contact',
    videoUrl: '',
    posterUrl: ''
};

const resolveAssetUrl = (url) => {
    if (!url) return url;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_URL}${url}`;
};

const getYouTubeId = (parsedUrl) => {
    if (!parsedUrl) return null;
    if (parsedUrl.hostname.includes('youtu.be')) {
        return parsedUrl.pathname.replace('/', '').split('/')[0] || null;
    }
    const searchId = parsedUrl.searchParams.get('v');
    if (searchId) return searchId;
    const pathMatch = parsedUrl.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    return pathMatch ? pathMatch[2] : null;
};

const getVimeoId = (parsedUrl) => {
    if (!parsedUrl) return null;
    const pathMatch = parsedUrl.pathname.match(/\/(\d+)/);
    return pathMatch ? pathMatch[1] : null;
};

const getDriveId = (parsedUrl) => {
    if (!parsedUrl) return null;
    const pathMatch = parsedUrl.pathname.match(/\/file\/d\/([^/]+)/);
    if (pathMatch) return pathMatch[1];
    return parsedUrl.searchParams.get('id');
};

const getEmbedSrc = (url) => {
    if (!url || !url.startsWith('http')) return null;
    try {
        const parsedUrl = new URL(url);
        const host = parsedUrl.hostname.toLowerCase();
        if (host.includes('youtube.com') || host.includes('youtu.be')) {
            const id = getYouTubeId(parsedUrl);
            return id ? `https://www.youtube.com/embed/${id}` : null;
        }
        if (host.includes('vimeo.com')) {
            const id = getVimeoId(parsedUrl);
            return id ? `https://player.vimeo.com/video/${id}` : null;
        }
        if (host.includes('drive.google.com')) {
            const id = getDriveId(parsedUrl);
            return id ? `https://drive.google.com/file/d/${id}/preview` : null;
        }
    } catch (err) {
        return null;
    }
    return null;
};

const sectionReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' }
    }
};

const VideoShowcase = () => {
    const [content, setContent] = useState(defaultContent);
    const [shouldAutoplay, setShouldAutoplay] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const sectionRef = useRef(null);
    const videoRef = useRef(null);

    const resolvedVideoUrl = resolveAssetUrl(content.videoUrl) || VIDEO_SRC;
    const embedSrc = getEmbedSrc(resolvedVideoUrl);
    const videoSrc = embedSrc ? '' : resolvedVideoUrl;
    const iframeSrc = embedSrc
        ? `${embedSrc}${embedSrc.includes('?') ? '&' : '?'}autoplay=${shouldAutoplay ? 1 : 0}&mute=1&playsinline=1`
        : '';
    const posterSrc = resolveAssetUrl(content.posterUrl) || interiorTwo.src;

    useEffect(() => {
        fetch(`${API_URL}/api/settings/video`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data && typeof data === 'object') {
                    setContent((prev) => ({ ...prev, ...data }));
                }
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!sectionRef.current || typeof IntersectionObserver === 'undefined') return;
        const observer = new IntersectionObserver(
            ([entry]) => setShouldAutoplay(entry.isIntersecting),
            { threshold: 0.4 }
        );
        observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!videoRef.current || !videoSrc) return;
        if (shouldAutoplay) {
            const playPromise = videoRef.current.play();
            if (playPromise?.catch) playPromise.catch(() => {});
        } else {
            videoRef.current.pause();
        }
    }, [shouldAutoplay, videoSrc]);

    return (
        <Flex
            as={motion.section}
            ref={sectionRef}
            variants={sectionReveal}
            initial={'hidden'}
            whileInView={'visible'}
            viewport={{ once: true, amount: 0.2 }}
            paddingX={{ base: 6, lg: 12 }}
            paddingY={{ base: 10, lg: 16 }}
            direction={'column'}
            alignItems={'center'}
            gap={{ base: 6, lg: 8 }}>
            <VStack
                alignItems={{ base: 'flex-start', lg: 'center' }}
                spacing={4}
                textAlign={{ base: 'left', lg: 'center' }}
                w={'full'}
                maxW={{ base: 'full', lg: '3xl' }}>
                <Text
                    fontWeight={'bold'}
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    textColor={'gray.900'}>
                    {content.title}
                </Text>
                <Text fontSize={'sm'} textColor={'gray.600'} maxW={{ base: 'full', lg: '2xl' }}>
                    {content.subtitle}
                </Text>
                <Stack
                    direction={{ base: 'column', sm: 'row' }}
                    spacing={3}
                    w={'full'}
                    align={{ base: 'stretch', sm: 'center' }}
                    justify={{ base: 'flex-start', lg: 'center' }}>
                    <Link href={content.ctaPrimaryLink || '/products'}>
                        <Button variant={'solid'} w={{ base: 'full', sm: 'auto' }}>
                            {content.ctaPrimary}
                        </Button>
                    </Link>
                    <Link href={content.ctaSecondaryLink || '/contact'}>
                        <Button variant={'outline'} w={{ base: 'full', sm: 'auto' }}>
                            {content.ctaSecondary}
                        </Button>
                    </Link>
                </Stack>
            </VStack>

            <Box w={'full'}>
                <AspectRatio ratio={16 / 9} w={'full'}>
                    {embedSrc ? (
                        <Box
                            as={'iframe'}
                            src={iframeSrc}
                            title={'Homepage video'}
                            allow={'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'}
                            allowFullScreen
                            style={{ borderRadius: '18px', width: '100%', height: '100%', border: 0 }}
                        />
                    ) : videoSrc ? (
                        <Box
                            as={'video'}
                            src={videoSrc}
                            ref={videoRef}
                            controls
                            muted={isMuted}
                            playsInline
                            autoPlay={shouldAutoplay}
                            poster={posterSrc}
                            onVolumeChange={() => {
                                if (videoRef.current) setIsMuted(videoRef.current.muted);
                            }}
                            style={{ borderRadius: '18px', width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <Box
                            borderRadius={'18px'}
                            bgImage={`url(${posterSrc})`}
                            bgSize={'cover'}
                            bgPosition={'center'}
                            display={'flex'}
                            alignItems={'center'}
                            justifyContent={'center'}
                            color={'white'}
                            fontWeight={'bold'}
                            textShadow={'0 4px 12px rgba(0,0,0,0.4)'}>
                            Add a homepage video in Admin → Homepage Video
                        </Box>
                    )}
                </AspectRatio>
            </Box>
        </Flex>
    );
};

export default VideoShowcase;
