import { Box, Button, Flex, Grid, IconButton, Image, Input, Text, VStack } from "@chakra-ui/react";
import { Trash, UploadSimple } from "phosphor-react";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ManageBanners = () => {
    const [banners, setBanners] = useState([]);
    const [uploading, setUploading] = useState(false);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_URL}/api/banners`);
            const data = await res.json();
            setBanners(data || []);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchBanners(); }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('image', file);
            const res = await fetch(`${API_URL}/api/banners`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                fetchBanners();
            }
        } catch (e) {
            alert('Upload failed');
        }
        setUploading(false);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this banner?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`${API_URL}/api/banners/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            setBanners(prev => prev.filter(b => b.id !== id));
        } catch (e) {
            alert('Failed to delete');
        }
    };

    return (
        <VStack spacing={6} align={'stretch'}>
            <Flex
                bg={'white'}
                p={4}
                rounded={'md'}
                shadow={'sm'}
                alignItems={'center'}
                justifyContent={'space-between'}>
                <Text fontWeight={'medium'} textColor={'black'}>
                    Upload homepage advert banners (recommended: 1200x400px)
                </Text>
                <Button
                    as={'label'}
                    htmlFor={'banner-upload'}
                    leftIcon={<UploadSimple size={18} />}
                    colorScheme={'orange'}
                    size={'sm'}
                    isLoading={uploading}
                    cursor={'pointer'}>
                    Upload
                    <Input
                        id={'banner-upload'}
                        type={'file'}
                        accept={'image/*'}
                        display={'none'}
                        onChange={handleUpload}
                    />
                </Button>
            </Flex>

            <Grid gridTemplateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {banners.map(banner => (
                    <Box
                        key={banner.id}
                        position={'relative'}
                        rounded={'md'}
                        overflow={'hidden'}
                        shadow={'sm'}>
                        <Image
                            src={`${API_URL}${banner.image_url}`}
                            alt={'Banner'}
                            w={'full'}
                            h={'180px'}
                            objectFit={'cover'}
                        />
                        <IconButton
                            aria-label={'Delete banner'}
                            icon={<Trash size={18} />}
                            size={'sm'}
                            colorScheme={'red'}
                            position={'absolute'}
                            top={2}
                            right={2}
                            onClick={() => handleDelete(banner.id)}
                        />
                    </Box>
                ))}
            </Grid>

            {banners.length === 0 && (
                <Text textAlign={'center'} color={'gray.500'} py={10}>
                    No banners uploaded yet. Add banners to display on the homepage.
                </Text>
            )}
        </VStack>
    );
};

export default ManageBanners;
