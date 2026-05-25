import { Box, Button, Circle, Divider, Flex, HStack, IconButton, Stack, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { connect, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import { apiGetProduct } from '../utils/api'
import { ArrowLeft, Trash } from 'phosphor-react'
import Image from 'next/image'

import emptyFav from '../public/empty_fav.png'
import { addToCart } from '../store/cartReducer'
import { deleteFromWishlist } from '../store/wishlistReducer'
import Meta from '../components/meta/Meta';

const WishlistItem = ({ item, onDelete, onAddToCart, isInCart }) => {

    const router = useRouter()
    const handleCartAction = () => {
        if (isInCart) {
            router.push('/cart')
            return
        }
        onAddToCart(item)
    }

    return (
        <Flex
            justifyContent={'space-between'}
            alignItems={'center'}
            py={4}
            my={4}
            width={'full'}
            flexDirection={{ base: 'column', md: 'row' }}>

            <Flex
                rounded={'lg'}
                overflow={'hidden'}
                marginEnd={4}
                alignItems={'center'}>

                <Box
                    boxSize={'100px'}
                    rounded={'lg'}
                    position={'relative'}>
                    <Image
                        src={item.images[0]}
                        alt={''}
                        fill
                    />
                </Box>

                <VStack
                    alignItems={'start'}
                    marginStart={4}>
                    <Text
                        fontWeight={'normal'}
                        fontSize={'sm'}
                        textColor={'gray.800'}
                        textAlign={'start'}
                        overflow={'hidden'}
                        noOfLines={2}
                        maxWidth={'xs'}
                        textOverflow={'ellipsis'}>
                        {item.productName}
                    </Text>

                    <Text
                        fontWeight={'medium'}
                        fontSize={'md'}
                        textAlign={'start'}
                        textColor={'black'}>
                        {`KSh ${new Intl.NumberFormat().format(item.productPrice)}`}
                    </Text>

                </VStack>
            </Flex>

            <VStack
                alignItems={'end'}
                justifyContent={'space-between'}
                spacing={3}
                display={{ base: 'none', md: 'flex' }}>

                <Button
                    variant={isInCart ? 'outline' : 'solid'}
                    textTransform={'uppercase'}
                    letterSpacing={'wide'}
                    paddingX={4}
                    fontSize={'sm'}
                    onClick={handleCartAction}>
                    {isInCart ? 'View cart' : 'Add to cart'}
                </Button>

                <Button
                    variant={'solid'}
                    marginTop={6}
                    textTransform={'uppercase'}
                    letterSpacing={'wide'}
                    paddingX={4}
                    fontSize={'sm'}
                    onClick={() => {
                        localStorage.setItem('PRODUCT_REF', item.pid)
                        router.push(`${item.category}/${item.pid}`)
                    }}>
                    View item
                </Button>

                <IconButton
                    variant={'ghost'}
                    p={0}
                    onClick={() => {
                        onDelete(item.pid)
                    }}
                    icon={<Trash size={20} color={'#E53E3E'} />}
                />
            </VStack>

            <Stack
                w={'full'}
                alignItems={'end'}
                justifyContent={'space-between'}
                pe={3}
                spacing={12}
                display={{ base: 'flex', md: 'none' }}
                flexDirection={{ base: 'row-reverse' }}>

                <Button
                    variant={isInCart ? 'outline' : 'solid'}
                    textTransform={'uppercase'}
                    letterSpacing={'wide'}
                    paddingX={4}
                    fontSize={'sm'}
                    onClick={handleCartAction}>
                    {isInCart ? 'View cart' : 'Add to cart'}
                </Button>

                <Button
                    variant={'solid'}
                    marginTop={6}
                    textTransform={'uppercase'}
                    letterSpacing={'wide'}
                    paddingX={4}
                    fontSize={'sm'}
                    onClick={() => {
                        localStorage.setItem('PRODUCT_REF', item.pid)
                        router.push(`${item.category}/${item.pid}`)
                    }}>
                    View item
                </Button>

                <IconButton
                    variant={'ghost'}
                    p={0}
                    onClick={() => {
                        onDelete(item.pid)
                    }}
                    icon={<Trash size={20} color={'#E53E3E'} />}
                />
            </Stack>
        </Flex>
    )
}

const Wishlist = ({ addToCart, deleteFromWishlist }) => {

    const router = useRouter()
    const wishlist = useSelector((state) => state.auth.profile.wishlist)
    const cart = useSelector((state) => state.auth.profile.cart)
    const cartItems = cart?.items || {}
    const [product, setProduct] = useState([])

    useEffect(() => {
        let productIds = wishlist ? wishlist : []
        let tempWishlist = []
        const getWishlistItem = async () => {
            await Promise.all(productIds.map(async (id) => {
                try {
                    const p = await apiGetProduct(id)
                    tempWishlist.push(p)
                } catch (e) { /* skip missing */ }
            }))
            setProduct(tempWishlist)
        }
        getWishlistItem()
    }, [wishlist])

    function deleteItem(id) {
        deleteFromWishlist(id, wishlist)
        const newList = product.filter((item) => item.pid !== id)
        setProduct(newList)
    }

    const handleAddToCart = (item) => {
        const colorName = Array.isArray(item.color) && item.color.length ? item.color[0] : ''
        const colorValue = Array.isArray(item.colorValue) && item.colorValue.length ? item.colorValue[0] : ''
        addToCart(item.pid, item.productPrice, colorName, colorValue, cart)
    }

    return (
        <>
            {wishlist?.length === 0 || cart === undefined ?
                <VStack
                    width={'full'}
                    height={'60vh'}
                    justifyContent={'center'}
                    alignItems={'center'}
                    flexDirection={'column'}>
                    <Meta title={'Wishlist | Kejalux Interiors'} />
                    <Circle
                        bgColor={'gray.200'}
                        size={'140px'}>
                        <Image
                            src={emptyFav}
                            alt={'Empty Favorite'}
                            width={100}
                        />
                    </Circle>
                    <Text
                        fontWeight={'medium'}
                        fontSize={'md'}
                        textColor={'black'}>
                        Your wishlist is empty!
                    </Text>
                    <Text
                        fontWeight={'normal'}
                        fontSize={'sm'}
                        textColor={'black'}
                        textAlign={'center'}>
                        See an item you like? Click the &apos;favorite&apos; icon to mark them as favorite.
                    </Text>
                    <Button
                        variant={'solid'}
                        marginTop={10}
                        onClick={() => router.push('/')}>
                        Continue shopping
                    </Button>
                </VStack>
                :
                <Flex
                    as={'section'}
                    width={'full'}
                    justifyContent={{ base: 'start', lg: 'center' }}
                    alignItems={'start'}
                    minHeight={'70vh'}
                    paddingX={{ base: 4, md: 12 }}
                    paddingY={{ base: 4, md: 8 }}
                    backgroundColor={'gray.50'}
                    flexDirection={{ base: 'column', lg: 'row' }}>
                    <Meta title={'Wishlist | Kejalux Interiors'} />
                    <ToastContainer />

                    <VStack
                        flexDirection={'column'}
                        rounded={'lg'}
                        justifyContent={'center'}
                        alignItems={'start'}
                        marginEnd={12}
                        width={{ base: '100%', lg: '45%' }}>

                        <HStack
                            alignItems={'center'}
                            justifyContent={'space-between'}
                            w={'full'}>
                            <HStack spacing={3} alignItems={'center'}>
                                <IconButton
                                    aria-label={'Go back'}
                                    variant={'ghost'}
                                    icon={<ArrowLeft size={18} />}
                                    onClick={() => router.back()}
                                />
                                <Text
                                    fontWeight={'bold'}
                                    fontSize={{ base: 'xl', lg: '2xl' }}
                                    textColor={'black'}>
                                    Your Wishlist
                                </Text>
                            </HStack>

                            <HStack spacing={3} alignItems={'center'}>
                                <Text
                                    fontWeight={'semibold'}
                                    fontSize={'xs'}
                                    textColor={'gray.500'}>
                                    {`${wishlist ? wishlist.length : 'No'} items in wishlist`}
                                </Text>
                                <Button
                                    size={'sm'}
                                    variant={'outline'}
                                    onClick={() => router.push('/cart')}>
                                    View cart
                                </Button>
                            </HStack>
                        </HStack>

                        {
                            product.map((p, i) => (
                                <Box
                                    key={p.pid}
                                    w={'full'}>
                                    <WishlistItem
                                        item={p}
                                        onDelete={deleteItem}
                                        onAddToCart={handleAddToCart}
                                        isInCart={Boolean(cartItems?.[p.pid])}
                                    />
                                    {
                                        i !== product.length - 1 &&
                                        <Divider orientation={'horizontal'} bgColor={'gray.200'} height={'1px'} />
                                    }
                                </Box>
                            ))
                        }
                    </VStack>
                </Flex>
            }
        </>
    )
}

export const matchDispatchToProps = dispatch => {
    return {
        addToCart: (productId, productPrice, colorName, colorValue, prevCart) =>
            dispatch(addToCart(productId, productPrice, colorName, colorValue, prevCart)),
        deleteFromWishlist: (productId, wishlist) =>
            dispatch(deleteFromWishlist(productId, wishlist))
    }
}


export default connect(null, matchDispatchToProps)(Wishlist)