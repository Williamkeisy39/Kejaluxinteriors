import { Box, Button, FormControl, FormLabel, Input, Skeleton, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const defaultVideo = {
    title: 'Inside Kejalux Interiors',
    subtitle: 'A quick look at our craftsmanship, custom builds, and styling process for homes and businesses.',
    ctaPrimary: 'Explore Collection',
    ctaPrimaryLink: '/products',
    ctaSecondary: 'Talk to a Designer',
    ctaSecondaryLink: '/contact',
    videoUrl: '',
    posterUrl: ''
};

const ManageVideo = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [video, setVideo] = useState(defaultVideo);

    const fetchVideo = async () => {
        try {
            const res = await fetch(`${API_URL}/api/settings/video`);
            if (res.ok) {
                const data = await res.json();
                if (data && typeof data === 'object') {
                    setVideo({ ...defaultVideo, ...data });
                }
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchVideo(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/settings/video`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ value: video })
            });
            if (res.ok) {
                toast.success('Homepage video updated!');
            } else {
                toast.error('Failed to save');
            }
        } catch (e) {
            toast.error('Error saving video settings');
        }
        setSaving(false);
    };

    if (loading) {
        return (
            <VStack spacing={4}>
                <Skeleton h={'40px'} w={'full'} />
                <Skeleton h={'40px'} w={'full'} />
                <Skeleton h={'80px'} w={'full'} />
            </VStack>
        );
    }

    return (
        <VStack spacing={6} align={'stretch'} maxW={'700px'}>
            <Box bg={'white'} p={6} rounded={'md'} shadow={'sm'}>
                <Text fontWeight={'bold'} fontSize={'lg'} mb={4} color={'black'}>
                    Homepage Video
                </Text>

                <VStack spacing={4} align={'stretch'}>
                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Section Title</FormLabel>
                        <Input
                            value={video.title}
                            onChange={(e) => setVideo({ ...video, title: e.target.value })}
                            placeholder={'Inside Kejalux Interiors'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Subtitle</FormLabel>
                        <Textarea
                            value={video.subtitle}
                            onChange={(e) => setVideo({ ...video, subtitle: e.target.value })}
                            placeholder={'A quick look at our craftsmanship...'}
                            rows={3}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Video URL (MP4)</FormLabel>
                        <Input
                            value={video.videoUrl}
                            onChange={(e) => setVideo({ ...video, videoUrl: e.target.value })}
                            placeholder={'https://your-cdn.com/kejalux-showreel.mp4'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Poster Image URL (Optional)</FormLabel>
                        <Input
                            value={video.posterUrl}
                            onChange={(e) => setVideo({ ...video, posterUrl: e.target.value })}
                            placeholder={'https://your-cdn.com/video-poster.jpg'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Primary Button Text</FormLabel>
                        <Input
                            value={video.ctaPrimary}
                            onChange={(e) => setVideo({ ...video, ctaPrimary: e.target.value })}
                            placeholder={'Explore Collection'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Primary Button Link</FormLabel>
                        <Input
                            value={video.ctaPrimaryLink}
                            onChange={(e) => setVideo({ ...video, ctaPrimaryLink: e.target.value })}
                            placeholder={'/products'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Secondary Button Text</FormLabel>
                        <Input
                            value={video.ctaSecondary}
                            onChange={(e) => setVideo({ ...video, ctaSecondary: e.target.value })}
                            placeholder={'Talk to a Designer'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Secondary Button Link</FormLabel>
                        <Input
                            value={video.ctaSecondaryLink}
                            onChange={(e) => setVideo({ ...video, ctaSecondaryLink: e.target.value })}
                            placeholder={'/contact'}
                        />
                    </FormControl>

                    <Button
                        colorScheme={'orange'}
                        onClick={handleSave}
                        isLoading={saving}
                        mt={2}>
                        Save Changes
                    </Button>
                </VStack>
            </Box>
        </VStack>
    );
};

export default ManageVideo;
