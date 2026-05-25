import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Circle,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Radio,
    RadioGroup,
    RangeSlider,
    RangeSliderFilledTrack,
    RangeSliderThumb,
    RangeSliderTrack,
    Skeleton,
    Stack,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { MagnifyingGlass, CaretRight, FunnelSimple, X } from 'phosphor-react';
import { useEffect, useRef, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import noProduct from '../../public/no_product.png';
import ProductItem from '../../components/product/ProductItem';
import { apiSearchProducts } from '../../utils/api';
import { getAllProducts, getProductsByColor, getProductsByPrice } from '../../store/productsReducer';
import Image from 'next/image';
import Meta from '../../components/meta/Meta';

const LoadingSkeleton = () => {
    return (
        <Grid
            gridTemplateColumns={{
                base: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(5, 1fr)'
            }}
            rowGap={{ base: 2, lg: 8 }}
            columnGap={{ base: 2, lg: 8 }}
            paddingX={{ base: 1, lg: 0 }}
            placeItems={'center'}
            w={'full'}
            marginY={8}>
            {
                [...Array(10).keys()].map(item => (
                    <VStack
                        key={item}
                        justifyContent={'start'}
                        alignItems={'start'}>
                        <Skeleton
                            width={{ base: '150px', md: '220px' }}
                            height={{ base: '180px', md: '220px' }}
                            rounded={'lg'}
                            fadeDuration={2}
                        />
                        <Skeleton
                            width={'140px'}
                            height={'10px'}
                            rounded={'lg'}
                            fadeDuration={2}
                        />
                        <Skeleton
                            width={'70px'}
                            height={'10px'}
                            rounded={'lg'}
                            fadeDuration={2}
                        />
                    </VStack>
                ))
            }
        </Grid>
    );
};

const FilterAccordionItem = ({ accordionTitle, cat, filterByColor, items, page, onBeforeFilter }) => {

    return (
        <AccordionItem>
            <h2>
                <AccordionButton>
                    <Box flex='1' textAlign='left' textColor={'black'} fontWeight={'medium'}>
                        {accordionTitle}
                    </Box>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
                <VStack
                    justifyContent={'start'}
                    alignItems={'start'}>
                    {
                        <RadioGroup>
                            <Stack spacing={2} direction='column'>
                                {
                                    items.map((item, i) => (
                                        <Radio
                                            key={i}
                                            value={item}
                                            colorScheme={'orange'}
                                            onChange={e => {
                                                onBeforeFilter?.();
                                                filterByColor(cat, e.currentTarget.value.toLowerCase(), page);
                                            }}>
                                            {item}
                                        </Radio>
                                    ))
                                }
                            </Stack>
                        </RadioGroup>
                    }
                </VStack>
            </AccordionPanel>
        </AccordionItem>
    );
};

const FilterDrawer = ({ isOpen, onClose, btnRef, cat, page, fetchProducts, filterByColor, filterByPrice, onBeforeFilter }) => {

    const [priceRange, setPriceRange] = useState([100000, 250000]);

    return (
        <>
            <Drawer
                isOpen={isOpen}
                placement={'left'}
                onClose={onClose}
                finalFocusRef={btnRef}>

                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader mt={6}>
                        <HStack spacing={3}
                            alignItems={'center'}>
                            <FunnelSimple size={24} />
                            <Text>Filter items by</Text>
                        </HStack>
                    </DrawerHeader>

                    <DrawerBody>
                        <Accordion defaultIndex={[0]} allowMultiple>

                            <FilterAccordionItem
                                accordionTitle={'Colors'}
                                cat={cat}
                                filterByColor={filterByColor}
                                items={['White', 'Matte black', 'Velvet', 'Brown']}
                                page={page}
                                onBeforeFilter={onBeforeFilter}
                            />

                            <Text
                                textColor={'black'}
                                fontWeight={'semibold'}
                                marginTop={4}>
                                Price (KSh)
                            </Text>

                            <RangeSlider aria-label={['min', 'max']}
                                defaultValue={[100000, 250000]}
                                marginTop={2}
                                onChange={(val) => setPriceRange(val)}
                                min={10000}
                                max={500000}>
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack bgColor={'gold.500'} />
                                </RangeSliderTrack>

                                <RangeSliderThumb boxSize={5} index={0} bgColor={'gray.100'} />
                                <RangeSliderThumb boxSize={5} index={1} bgColor={'gray.100'} />
                            </RangeSlider>
                            <Flex
                                justifyContent={'space-between'}>
                                <Text
                                    textColor={'gray.900'}
                                    fontSize={'xs'}
                                    fontWeight={'medium'}>
                                    {`KSh ${new Intl.NumberFormat().format(priceRange[0])}`}
                                </Text>

                                <Text
                                    textColor={'gray.900'}
                                    fontSize={'xs'}
                                    fontWeight={'medium'}>
                                    {`KSh ${new Intl.NumberFormat().format(priceRange[1])}`}
                                </Text>
                            </Flex>

                            <Flex
                                mt={4}
                                alignItems={'center'}>
                                <Button
                                    variant={'solid'}
                                    paddingX={18}
                                    paddingY={2}
                                    mr={3}
                                    textTransform={'uppercase'}
                                    _hover={{ bgColor: 'blackAlpha.100', color: 'gold.500' }}
                                    onClick={() => {
                                        onBeforeFilter?.();
                                        filterByPrice(cat, priceRange[0], priceRange[1], page);
                                    }}>
                                    Apply
                                </Button>
                                <Button
                                    variant={'ghost'}
                                    borderWidth={1}
                                    paddingX={18}
                                    paddingY={2}
                                    _hover={{ bgColor: 'blackAlpha.100', color: 'gold.500' }}
                                    onClick={() => {
                                        onBeforeFilter?.();
                                        fetchProducts(cat, {}, 1);
                                    }}>
                                    clear
                                </Button>
                            </Flex>
                        </Accordion>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

const AllProducts = ({ getAllProducts, getProductsByColor, getProductsByPrice }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buttonDrawerRef = useRef();
    const containerRef = useRef(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState(null);

    const { isFetching, isLoaded, error, data, page, endOfData }
        = useSelector((state) => state.products);
    const safeData = data || {};

    useEffect(() => {
        getAllProducts(1, {});
    }, []);

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults(null);
        setSearchError(null);
    };

    const handleSearch = async () => {
        const term = searchTerm.trim();
        if (!term) {
            clearSearch();
            return;
        }
        setIsSearching(true);
        setSearchError(null);
        try {
            const results = await apiSearchProducts(term.toLowerCase());
            setSearchResults(results);
        } catch (e) {
            setSearchError(e.message);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    const fetchProducts = (_cat, prevData, nextPage) => {
        getAllProducts(nextPage, prevData);
    };

    const displayProducts = searchResults !== null
        ? searchResults
        : Object.values(safeData);
    const isSearchMode = searchResults !== null;

    if (error) {
        return (
            <Flex
                minH={'50vh'}
                alignItems={'center'}
                justifyContent={'center'}
                direction={'column'}
                gap={2}>
                <Text fontWeight={'semibold'}>An error occurred.</Text>
                <Text fontSize={'sm'} color={'gray.600'}>{error}</Text>
            </Flex>
        );
    }

    return (
        <Flex
            as={'section'}
            paddingX={{ base: 6, lg: 12 }}
            paddingY={8}
            flexDirection={'column'}
            justifyContent={'center'}
            alignItems={'center'}>

            <ToastContainer />
            <Meta title={'All Products | Kejalux Interiors'} />

            <Flex
                alignItems={'center'}
                w={'full'}
                justifyContent={'space-between'}
                flexWrap={'wrap'}
                gap={4}>
                <HStack spacing={3}>
                    <IconButton
                        variant={'ghost'}
                        ref={buttonDrawerRef}
                        onClick={onOpen}
                        icon={<FunnelSimple size={24} weight={'regular'} />}
                        _hover={{ background: 'gray.100', color: 'gold.500' }} />

                    <Breadcrumb
                        spacing={2}
                        separator={<CaretRight color={'#3e3e3e'} weight={'bold'} size={14} />}
                        fontWeight={'medium'}
                        fontSize={'sm'}
                        textDecoration={'none'}>
                        <BreadcrumbItem textColor={'gray.600'} transition={'all .2s'} _hover={{ color: 'gold.500' }}>
                            <Link href='/'>Home</Link>
                        </BreadcrumbItem>

                        <BreadcrumbItem textColor={'gray.900'} textTransform={'capitalize'} isCurrentPage>
                            <Text>Products</Text>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </HStack>

                <Flex
                    w={{ base: 'full', md: 'auto' }}
                    maxW={{ base: 'full', md: '420px' }}
                    alignItems={'center'}>
                    <InputGroup w={'full'}>
                        <InputLeftElement>
                            <MagnifyingGlass size={18} weight={'regular'} />
                        </InputLeftElement>
                        <Input
                            placeholder={'Search all products'}
                            fontSize={'sm'}
                            focusBorderColor={'gold.500'}
                            variant={'filled'}
                            pr={{ base: '7.5rem', md: '8.5rem' }}
                            value={searchTerm}
                            onChange={(e) => {
                                const nextValue = e.target.value;
                                setSearchTerm(nextValue);
                                if (!nextValue.trim()) {
                                    clearSearch();
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <InputRightElement width={'auto'} pr={1} pointerEvents={'auto'}>
                            <HStack spacing={1}>
                                {searchTerm && (
                                    <IconButton
                                        size={'xs'}
                                        variant={'ghost'}
                                        aria-label={'Clear search'}
                                        icon={<X size={14} />}
                                        onClick={clearSearch}
                                    />
                                )}
                                <Button
                                    size={'sm'}
                                    onClick={handleSearch}
                                    isLoading={isSearching}
                                    bg={'gold.500'}
                                    color={'white'}
                                    _hover={{ bg: 'gold.600' }}>
                                    Search
                                </Button>
                            </HStack>
                        </InputRightElement>
                    </InputGroup>
                </Flex>
            </Flex>

            <Flex
                w={'full'}
                marginTop={6}
                direction={'column'}
                alignItems={'center'}>
                <Text
                    fontWeight={'bold'}
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    textAlign={'center'}
                    textColor={'black'}>
                    All Products
                </Text>
                <Text
                    fontWeight={'medium'}
                    fontSize={'sm'}
                    textColor={'gray.700'}
                    marginTop={1}
                    textAlign={'center'}>
                    Browse everything in our collection and narrow down by filters.
                </Text>
                {isSearchMode && (
                    <Text fontSize={'sm'} color={'gray.600'} mt={2}>
                        {isSearching ? 'Searching products...' : `Showing ${displayProducts.length} results`}
                    </Text>
                )}
                {searchError && (
                    <Text fontSize={'sm'} color={'red.500'} mt={2}>{searchError}</Text>
                )}
            </Flex>

            {
                isLoaded && !isSearchMode && Object.values(safeData).length === 0 &&
                <VStack
                    width={'full'}
                    height={'60vh'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}>

                    <Circle
                        bgColor={'gray.200'}
                        size={'140px'}>
                        <Image
                            src={noProduct}
                            alt={'No product found'}
                            width={85}
                        />
                    </Circle>

                    <Text
                        fontWeight={'bold'}
                        fontSize={'2xl'}
                        textColor={'black'}>
                        No products found!
                    </Text>

                    <Text
                        fontWeight={'medium'}
                        fontSize={'md'}
                        textColor={'gray.800'}
                        noOfLines={2}
                        maxW={'md'}
                        textAlign={'center'}>
                        Sorry, no matching products were found for the query.
                    </Text>

                    <Button
                        variant={'solid'}
                        marginTop={10}
                        onClick={() => getAllProducts(1, {})}>
                        Refresh page
                    </Button>
                </VStack>
            }

            {
                isSearchMode && !isSearching && displayProducts.length === 0 &&
                <VStack
                    width={'full'}
                    height={'45vh'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}>

                    <Circle
                        bgColor={'gray.200'}
                        size={'120px'}>
                        <Image
                            src={noProduct}
                            alt={'No product found'}
                            width={75}
                        />
                    </Circle>

                    <Text
                        fontWeight={'bold'}
                        fontSize={'xl'}
                        textColor={'black'}>
                        No results found.
                    </Text>

                    <Text
                        fontWeight={'medium'}
                        fontSize={'sm'}
                        textColor={'gray.700'}>
                        Try another keyword or clear the search.
                    </Text>
                </VStack>
            }

            {
                (isFetching && !isSearchMode) ?
                    <LoadingSkeleton />
                    :
                    <Flex
                        w={'full'}
                        marginY={8}
                        flexDirection={'column'}
                        justifyContent={'center'}
                        alignItems={'center'}>
                        <Grid
                            w={'full'}
                            gridTemplateColumns={{
                                base: 'repeat(2, 1fr)',
                                md: 'repeat(3, 1fr)',
                                lg: 'repeat(5, 1fr)'
                            }}
                            rowGap={{ base: 4, lg: 8 }}
                            columnGap={{ base: 4, lg: 8 }}
                            ref={containerRef}
                            css={{
                                '&::-webkit-scrollbar': {
                                    display: 'none'
                                }
                            }}>
                            {
                                displayProducts.map(product => (
                                    <ProductItem
                                        key={product.pid}
                                        productId={product.pid}
                                        productTitle={product.productName}
                                        productImg={product.images[0]}
                                        productPrice={product.productPrice}
                                    />))
                            }
                        </Grid>

                        {(!endOfData && !isSearchMode) && (
                            <Button
                                variant={'ghost'}
                                fontWeight={'medium'}
                                shadow={'sm'}
                                borderWidth={1}
                                borderColor={'gray.300'}
                                transition={'all .5s'}
                                mt={6}
                                textTransform={'capitalize'}
                                onClick={() => fetchProducts('', safeData, page + 1)}>
                                Load more
                            </Button>
                        )}
                    </Flex>
            }

            <FilterDrawer
                isOpen={isOpen}
                onClose={onClose}
                btnRef={buttonDrawerRef}
                cat={''}
                page={page}
                fetchProducts={fetchProducts}
                filterByColor={getProductsByColor}
                filterByPrice={getProductsByPrice}
                onBeforeFilter={clearSearch}
            />

        </Flex>
    );
};

export const matchDispatchToProps = dispatch => {
    return {
        getAllProducts: (page, prevData) =>
            dispatch(getAllProducts(page, prevData)),
        getProductsByColor: (cat, color, page) =>
            dispatch(getProductsByColor(cat, color, page)),
        getProductsByPrice: (cat, minPrice, maxPrice, page) =>
            dispatch(getProductsByPrice(cat, minPrice, maxPrice, page))
    };
};

export default connect(null, matchDispatchToProps)(AllProducts);
