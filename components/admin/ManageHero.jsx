import { Box, Button, FormControl, FormLabel, Input, Skeleton, Text, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ManageHero = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hero, setHero] = useState({
        badge: '',
        headline: '',
        subtitle: '',
        ctaPrimary: '',
        ctaSecondary: '',
        features: ['', '', '']
    });

    const fetchHero = async () => {
        try {
            const res = await fetch(`${API_URL}/api/settings/hero`);
            const data = await res.json();
            if (data && data.badge) {
                setHero(data);
            }
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchHero(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/settings/hero`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ value: hero })
            });
            if (res.ok) {
                toast.success('Hero section updated!');
            } else {
                toast.error('Failed to save');
            }
        } catch (e) {
            toast.error('Error saving hero settings');
        }
        setSaving(false);
    };

    const updateFeature = (index, value) => {
        const updated = [...hero.features];
        updated[index] = value;
        setHero({ ...hero, features: updated });
    };

    if (loading) {
        return <VStack spacing={4}><Skeleton h={'40px'} w={'full'} /><Skeleton h={'40px'} w={'full'} /><Skeleton h={'80px'} w={'full'} /></VStack>;
    }

    return (
        <VStack spacing={6} align={'stretch'} maxW={'600px'}>
            <Box bg={'white'} p={6} rounded={'md'} shadow={'sm'}>
                <Text fontWeight={'bold'} fontSize={'lg'} mb={4} color={'black'}>
                    Hero Section Content
                </Text>

                <VStack spacing={4} align={'stretch'}>
                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Badge Text</FormLabel>
                        <Input
                            value={hero.badge}
                            onChange={(e) => setHero({ ...hero, badge: e.target.value })}
                            placeholder={"Kenya's Finest Furniture"}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Headline</FormLabel>
                        <Input
                            value={hero.headline}
                            onChange={(e) => setHero({ ...hero, headline: e.target.value })}
                            placeholder={'Elevate Every Room with Kejalux'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Subtitle</FormLabel>
                        <Textarea
                            value={hero.subtitle}
                            onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                            placeholder={'Interior decor, business furniture...'}
                            rows={3}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Primary Button Text</FormLabel>
                        <Input
                            value={hero.ctaPrimary}
                            onChange={(e) => setHero({ ...hero, ctaPrimary: e.target.value })}
                            placeholder={'Explore Collection'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Secondary Button Text</FormLabel>
                        <Input
                            value={hero.ctaSecondary}
                            onChange={(e) => setHero({ ...hero, ctaSecondary: e.target.value })}
                            placeholder={'Get a Quote'}
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel fontSize={'sm'} color={'gray.700'}>Feature Pills (3)</FormLabel>
                        <VStack spacing={2}>
                            {hero.features.map((f, i) => (
                                <Input
                                    key={i}
                                    value={f}
                                    onChange={(e) => updateFeature(i, e.target.value)}
                                    placeholder={`Feature ${i + 1}`}
                                />
                            ))}
                        </VStack>
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

export default ManageHero;
