import { Box, Button, Flex, Grid, IconButton, Image, Skeleton, Text, VStack } from "@chakra-ui/react";
import { Trash } from "phosphor-react";
import { useEffect, useState } from "react";
import { apiGetProducts, apiDeleteProduct } from "../../utils/api";

const ViewProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchProducts = async (p) => {
        setLoading(true);
        try {
            const data = await apiGetProducts({ page: p, limit: 12 });
            setProducts(data.products || []);
            setTotalPages(data.totalPages || 1);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(page); }, [page]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return;
        try {
            await apiDeleteProduct(id);
            setProducts(prev => prev.filter(p => p.pid !== id));
        } catch (e) {
            alert('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <Grid gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                {[...Array(8)].map((_, i) => <Skeleton key={i} height={'200px'} rounded={'md'} />)}
            </Grid>
        );
    }

    return (
        <VStack spacing={6} align={'stretch'}>
            <Grid gridTemplateColumns={{ base: '1fr', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }} gap={4}>
                {products.map(product => (
                    <Box
                        key={product.pid}
                        bg={'white'}
                        rounded={'md'}
                        shadow={'sm'}
                        overflow={'hidden'}
                        position={'relative'}>
                        <Image
                            src={product.images?.[0] || '/no_product.png'}
                            alt={product.productName}
                            h={'160px'}
                            w={'full'}
                            objectFit={'cover'}
                        />
                        <Box p={3}>
                            <Text fontWeight={'medium'} fontSize={'sm'} noOfLines={1}>
                                {product.productName}
                            </Text>
                            <Text fontWeight={'bold'} fontSize={'sm'} color={'gray.700'}>
                                KSh {new Intl.NumberFormat().format(product.productPrice)}
                            </Text>
                            <Text fontSize={'xs'} color={'gray.500'} textTransform={'capitalize'}>
                                {product.category}
                            </Text>
                        </Box>
                        <IconButton
                            aria-label={'Delete product'}
                            icon={<Trash size={18} />}
                            size={'sm'}
                            colorScheme={'red'}
                            variant={'ghost'}
                            position={'absolute'}
                            top={2}
                            right={2}
                            onClick={() => handleDelete(product.pid)}
                        />
                    </Box>
                ))}
            </Grid>

            {products.length === 0 && (
                <Text textAlign={'center'} color={'gray.500'} py={10}>
                    No products found. Add some products to get started.
                </Text>
            )}

            <Flex justifyContent={'center'} gap={2}>
                <Button
                    size={'sm'}
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}>
                    Previous
                </Button>
                <Text alignSelf={'center'} fontSize={'sm'}>
                    Page {page} of {totalPages}
                </Text>
                <Button
                    size={'sm'}
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}>
                    Next
                </Button>
            </Flex>
        </VStack>
    );
};

export default ViewProducts;
