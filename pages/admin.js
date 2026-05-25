import { Box, Button, Divider, Flex, Heading, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { Package, ShoppingCart, Image as ImageIcon, SignOut, House, PencilSimple, VideoCamera } from "phosphor-react";
import { useRouter } from "next/router";
import UploadProduct from "../components/admin/UploadProduct";
import ViewProducts from "../components/admin/ViewProducts";
import ViewOrders from "../components/admin/ViewOrders";
import ManageBanners from "../components/admin/ManageBanners";
import ManageHero from "../components/admin/ManageHero";
import ManageVideo from "../components/admin/ManageVideo";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Meta from "../components/meta/Meta";

const navItems = [
    { label: 'Hero Section', icon: PencilSimple, key: 'hero' },
    { label: 'Homepage Video', icon: VideoCamera, key: 'video' },
    { label: 'Products', icon: Package, key: 'products' },
    { label: 'Add Product', icon: Package, key: 'add-product' },
    { label: 'Orders', icon: ShoppingCart, key: 'orders' },
    { label: 'Ad Banners', icon: ImageIcon, key: 'banners' },
];

const Admin = () => {
    const [activeTab, setActiveTab] = useState('products');
    const router = useRouter();

    return (
        <Flex minH={'100vh'}>
            <Meta title={'Admin Dashboard | Kejalux Interiors'} />
            <ToastContainer />

            {/* Sidebar */}
            <Box
                w={{ base: '60px', md: '240px' }}
                bg={'gray.900'}
                py={6}
                px={{ base: 2, md: 4 }}
                flexShrink={0}
                position={'sticky'}
                top={0}
                h={'100vh'}>
                <Text
                    display={{ base: 'none', md: 'block' }}
                    fontWeight={'bold'}
                    fontSize={'lg'}
                    color={'white'}
                    mb={8}
                    textAlign={'center'}>
                    Kejalux Admin
                </Text>

                <VStack spacing={2} align={'stretch'}>
                    {navItems.map(item => (
                        <Button
                            key={item.key}
                            variant={'ghost'}
                            justifyContent={{ base: 'center', md: 'flex-start' }}
                            color={activeTab === item.key ? 'white' : 'gray.400'}
                            bg={activeTab === item.key ? 'whiteAlpha.200' : 'transparent'}
                            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                            onClick={() => setActiveTab(item.key)}
                            leftIcon={<Icon as={item.icon} boxSize={5} weight={'duotone'} />}
                            iconSpacing={{ base: 0, md: 3 }}
                            px={{ base: 2, md: 4 }}
                            py={6}>
                            <Text display={{ base: 'none', md: 'block' }}>{item.label}</Text>
                        </Button>
                    ))}
                </VStack>

                <Divider my={6} borderColor={'whiteAlpha.300'} />

                <Button
                    variant={'ghost'}
                    justifyContent={{ base: 'center', md: 'flex-start' }}
                    color={'gray.400'}
                    _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                    leftIcon={<Icon as={House} boxSize={5} weight={'duotone'} />}
                    iconSpacing={{ base: 0, md: 3 }}
                    px={{ base: 2, md: 4 }}
                    py={6}
                    onClick={() => router.push('/')}>
                    <Text display={{ base: 'none', md: 'block' }}>Back to Site</Text>
                </Button>
            </Box>

            {/* Main Content */}
            <Box flex={1} p={{ base: 4, md: 8 }} bg={'gray.50'} overflowY={'auto'}>
                <HStack mb={6}>
                    <Heading
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight={'bold'}
                        textColor={'black'}
                        textTransform={'capitalize'}>
                        {activeTab.replace('-', ' ')}
                    </Heading>
                </HStack>

                {activeTab === 'hero' && <ManageHero />}
                {activeTab === 'video' && <ManageVideo />}
                {activeTab === 'products' && <ViewProducts />}
                {activeTab === 'add-product' && <UploadProduct />}
                {activeTab === 'orders' && <ViewOrders />}
                {activeTab === 'banners' && <ManageBanners />}
            </Box>
        </Flex>
    );
};

export default Admin;