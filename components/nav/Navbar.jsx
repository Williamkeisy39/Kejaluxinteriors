import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Avatar, Box, Button, Circle, Divider, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, HStack, IconButton, Input, InputGroup, InputLeftElement, InputRightElement, Link, Select, Spinner, Text, Tooltip, useDisclosure, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Link as NextLink } from 'next/link'
import Image from 'next/image'
import { Heart, List, MagnifyingGlass, ShoppingCart, SignOut, User } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../store/authReducer'

import { searchProducts } from '../../store/searchReducer'

const Navbar = ({ search }) => {
    const router = useRouter()
    const auth = useSelector(state => state.auth.profile)
    const cart = useSelector((state) => state.auth.profile.cart)
    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const menuRef = useRef()
    const inputRef = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [showHint, setShowHint] = useState(false)
    const { isLoading, isFetching, isLoaded, error, data }
        = useSelector((state) => state.search)

    return (
        <Flex
            as={'nav'}
            paddingX={{ base: 6, lg: 12 }}
            paddingY={{ base: 0.5, lg: 0.5 }}
            boxShadow={'sm'}
            flexDirection={'column'}
            position={'relative'}>
            <Flex
                justifyContent={'space-between'}
                alignItems={'center'}>

                <Link
                    as={NextLink}
                    href={'/'}
                    _hover={{ textDecoration: 'none' }}>
                    <Box
                        w={{ base: '120px', md: '170px' }}
                        h={{ base: '52px', md: '72px' }}
                        position={'relative'}
                        flexShrink={0}>
                        <Image
                            src={'/kj.png'}
                            alt={'Kejalux logo'}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                </Link>

                <InputGroup
                    size={'md'}
                    width={'42%'}
                    m={'auto'}
                    position={'absolute'}
                    top={'50%'}
                    transform={'translateY(-50%)'}
                    left={0}
                    right={0}
                    display={{ base: 'none', lg: 'block' }}>
                    <InputLeftElement>
                        <MagnifyingGlass size={20} weight={'regular'} />
                    </InputLeftElement>
                    <Input
                        ref={inputRef}
                        placeholder={'Search entire store here'}
                        fontSize={'sm'}
                        _placeholder={{ fontSize: 'sm' }}
                        focusBorderColor={'gold.500'}
                        variant={'filled'}
                        value={searchTerm}
                        onFocus={(e) => setShowHint(true)}
                        onBlur={(e) => {
                            // !!!!!!! HACK !!!!!!!!!
                            setTimeout(() => {
                                setShowHint(false)
                            }, 60)
                        }}
                        onChange={(e) => {
                            setSearchTerm((prevTerm) => {
                                const newSearchTerm = e.target.value
                                if (prevTerm.trim() !== newSearchTerm.trim() && newSearchTerm.length > 1) {
                                    setTimeout(() => {
                                        search(newSearchTerm.toLowerCase().trim())
                                    }, 900)
                                }
                                return newSearchTerm
                            })
                        }}
                    />
                    <InputRightElement mr={'1.8rem'}>
                        <Button size={'sm'} paddingY={'5'}
                            onClick={() => search(searchTerm.toLowerCase().trim())}>
                            Search
                        </Button>
                    </InputRightElement>

                    {
                        showHint &&
                        <Box
                            bg={'gray.200'}
                            rounded={'md'}
                            maxH={'70vh'}>
                            {
                                isFetching ?
                                    <Flex
                                        px={3}
                                        py={2}
                                        justifyContent={'center'}
                                        alignItems={'center'}>
                                        <Spinner />
                                    </Flex>
                                    :
                                    data?.map((p, i) => (
                                        <Flex
                                            key={p.pid}
                                            flexDirection={'column'}
                                            _hover={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setSearchTerm('')
                                                setShowHint(false)
                                                localStorage.setItem('PRODUCT_REF', p.pid)
                                                router.push(`${p.category}/${p.pid}`)
                                            }}>
                                            <Flex
                                                px={3}
                                                py={2}
                                                alignItems={'center'}
                                                w={'full'}>
                                                <Box
                                                    boxSize={'50px'}
                                                    rounded={'lg'}
                                                    position={'relative'}
                                                    overflow={'hidden'}
                                                    mr={3}>
                                                    <Image
                                                        src={p.images[0]}
                                                        alt={''}
                                                        fill
                                                    />
                                                </Box>
                                                <Text
                                                    fontWeight={'normal'}
                                                    fontSize={'sm'}>
                                                    {p.productName}
                                                </Text>
                                            </Flex>
                                            {/* {
                                            data?.length - 1 !== i &&
                                            <Divider height={'1px'} bgColor={'gray.400'} orientation={'horizontal'} />
                                        } */}
                                        </Flex>
                                    ))
                            }
                        </Box>
                    }
                </InputGroup>

                <HStack
                    justifyContent={'center'}
                    alignItems={'center'}
                    display={{ base: 'none', lg: 'flex' }}>
                    {
                        auth.isEmpty ?
                            <HStack spacing={4}>
                                <Button variant={'ghost'}
                                    fontWeight={'medium'}
                                    shadow={'sm'}
                                    borderWidth={1}
                                    borderColor={'gray.300'}
                                    transition={'all .5s'}
                                    _hover={{
                                        boxShadow: 'lg',
                                        backgroundColor: 'gold.500',
                                        borderColor: 'gold.500',
                                        color: 'white',
                                        transform: 'scale(1.05)'
                                    }}
                                    onClick={() => router.push('/signup')}>
                                    Signup
                                </Button>
                                <Button
                                    variant={'ghost'}
                                    padding={0}
                                    transition={'all .5s'}
                                    fontWeight={'medium'}
                                    onClick={() => router.push('/login')}>
                                    login
                                </Button>
                            </HStack>
                            :
                            <>
                                <IconButton
                                    aria-label={'wishlist'}
                                    bg={'gold.100'}
                                    color={'black'}
                                    variant={'ghost'}
                                    icon={
                                        <Tooltip
                                            hasArrow
                                            label={'Wishlist'}
                                            placement={'bottom'}
                                            textColor={'white'}
                                            bgColor={'gray.900'}>
                                            <Heart size={24} weight={'regular'} />
                                        </Tooltip>
                                    }
                                    _hover={{
                                        color: 'gold.500'
                                    }}
                                    onClick={() => router.push('/wishlist')} />

                                <IconButton
                                    aria-label={'account'}
                                    bg={'gold.100'}
                                    color={'black'}
                                    variant={'ghost'}
                                    icon={
                                        <Tooltip
                                            hasArrow
                                            label={'Account'}
                                            placement={'bottom'}
                                            textColor={'white'}
                                            bgColor={'gray.900'}>
                                            <User size={24} weight={'regular'} />
                                        </Tooltip>
                                    }
                                    _hover={{
                                        color: 'gold.500'
                                    }}
                                    onClick={onOpen} />
                            </>
                    }

                    <Box
                        position={'relative'}>
                        <IconButton
                            aria-label={'shopping cart'}
                            bg={'gold.100'}
                            color={'black'}
                            variant={'ghost'}
                            icon={
                                <Tooltip
                                    hasArrow
                                    label={'Cart'}
                                    placement={'bottom'}
                                    textColor={'white'}
                                    bgColor={'gray.900'}>
                                    <ShoppingCart size={24} weight={'regular'} alt={''} />
                                </Tooltip>
                            }
                            _hover={{
                                color: 'gold.500'
                            }}
                            onClick={() => router.push('/cart')} />

                        {
                            cart && cart.totalItems > 0 &&
                            <Circle
                                size='16px'
                                bg='gold.500'
                                color='white'
                                position={'absolute'}
                                top={1}
                                right={1}>

                                <Text
                                    fontSize={'xs'}
                                    fontWeight={'medium'}>
                                    {cart ? cart.totalItems : 0}
                                </Text>
                            </Circle>
                        }
                    </Box>
                </HStack>

                <Drawer
                    isOpen={isOpen}
                    placement={'right'}
                    onClose={onClose}
                    finalFocusRef={menuRef}>
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>Kejalux Interiors</DrawerHeader>

                        <DrawerBody>
                            {
                                auth.isEmpty ?
                                    <VStack
                                        w={'full'}
                                        h={'full'}
                                        justifyContent={'center'}>
                                        <Text
                                            fontSize={'3xl'}
                                            fontWeight={'bold'}>
                                            Get started
                                        </Text>
                                        <Button
                                            variant={'solid'}
                                            w={'100%'}
                                            mt={8}
                                            fontWeight={'medium'}
                                            shadow={'lg'}
                                            transition={'all .5s'}
                                            textTransform={'uppercase'}
                                            _hover={{
                                                boxShadow: 'lg',
                                                backgroundColor: 'gold.500',
                                                borderColor: 'gold.500',
                                                color: 'white',
                                                transform: 'scale(1.05)'
                                            }}
                                            onClick={() => router.push('/signup')}>
                                            Signup
                                        </Button>
                                        <Button
                                            variant={'ghost'}
                                            borderWidth={1}
                                            borderColor={'gray.300'}
                                            w={'100%'}
                                            transition={'all .5s'}
                                            fontWeight={'medium'}
                                            onClick={() => router.push('/login')}>
                                            login
                                        </Button>
                                    </VStack>
                                    :
                                    <VStack>
                                        <Flex
                                            flexDirection={'column'}
                                            alignItems={'center'}
                                            mb={4}>
                                            <Avatar name={auth.displayName} src={auth.avatarUrl} />
                                            <Text
                                                fontWeight={'medium'}>
                                                {auth.displayName}
                                            </Text>
                                            <Text
                                                fontWeight={'normal'}
                                                fontSize={'sm'}>
                                                {auth.email}
                                            </Text>
                                        </Flex>
                                        <Accordion allowToggle w={'full'}>
                                            <AccordionItem fontSize={'sm'}>
                                                <h2>
                                                    <AccordionButton>
                                                        <Text fontWeight={'medium'} flex='1' textAlign='left'>
                                                            Category
                                                        </Text>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel>
                                                    <VStack alignItems={'start'}>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/sofa'}>
                                                            Sofa
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/bed'}>
                                                            Bed
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/outdoor'}>
                                                            Outdoor
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/wardrobe'}>
                                                            Wardrobe
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/shelf'}>
                                                            Shelf
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/tv-console'}>
                                                            TV Console
                                                        </Link>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/office'}>
                                                            Office
                                                        </Link>
                                                    </VStack>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>

                                        <Accordion defaultIndex={[0]} allowToggle w={'full'}>
                                            <AccordionItem fontSize={'sm'}>
                                                <h2>
                                                    <AccordionButton>
                                                        <Text fontWeight={'medium'} flex='1' textAlign='left'>
                                                            Account
                                                        </Text>
                                                        <AccordionIcon />
                                                    </AccordionButton>
                                                </h2>
                                                <AccordionPanel pb={4}>
                                                    <VStack alignItems={'start'}>
                                                        <Link
                                                            as={NextLink}
                                                            href={'/wishlist'}>
                                                            Wishlist
                                                        </Link>

                                                        <Link
                                                            as={NextLink}
                                                            href={'/orders'}>
                                                            Orders
                                                        </Link>
                                                    </VStack>

                                                    <Button
                                                        variant={'solid'}
                                                        w={'100%'}
                                                        mt={8}
                                                        fontWeight={'medium'}
                                                        shadow={'lg'}
                                                        py={5}
                                                        display={{ base: 'inline-flex', lg: 'none' }}
                                                        transition={'all .5s'}
                                                        textTransform={'uppercase'}
                                                        onClick={() => {
                                                            onClose()
                                                            router.push('/cart')
                                                        }}>
                                                        Cart
                                                    </Button>

                                                    <Button
                                                        variant={'ghost'}
                                                        w={'100%'}
                                                        mt={4}
                                                        py={5}
                                                        fontWeight={'medium'}
                                                        shadow={'sm'}
                                                        textColor={'red.500'}
                                                        borderWidth={'1px'}
                                                        borderColor={'gray.200'}
                                                        transition={'all .5s'}
                                                        textTransform={'uppercase'}
                                                        leftIcon={<SignOut size={24} />}
                                                        onClick={() => {
                                                            dispatch(logoutUser())
                                                            router.replace('/')
                                                        }}>
                                                        logout
                                                    </Button>
                                                </AccordionPanel>
                                            </AccordionItem>
                                        </Accordion>
                                    </VStack>
                            }
                        </DrawerBody>

                    </DrawerContent>
                </Drawer>

                {/* Mobile hamburger icon button */}
                <Box
                    position={'relative'}
                    display={{ base: 'flex', lg: 'none' }}>
                    <IconButton
                        aria-label={'mobile menu'}
                        color={'black'}
                        variant={'ghost'}
                        justifyContent={'end'}
                        icon={
                            <Tooltip
                                hasArrow
                                label={'Cart'}
                                placement={'bottom'}
                                textColor={'white'}
                                bgColor={'gray.900'}>
                                <List size={28} weight={'regular'} alt={''} />
                            </Tooltip>
                        }
                        onClick={() => onOpen()} />

                    {
                        cart && cart.totalItems > 0 &&
                        <Circle
                            size='20px'
                            bg='gold.500'
                            color='white'
                            position={'absolute'}
                            top={0}
                            right={-1}>

                            <Text
                                fontSize={'xs'}
                                fontWeight={'medium'}>
                                {cart ? cart.totalItems : 0}
                            </Text>
                        </Circle>
                    }
                </Box>
            </Flex>

            <InputGroup
                size={'lg'}
                width={'full'}
                mt={4}
                display={{ base: 'block', lg: 'none' }}>
                <InputLeftElement>
                    <MagnifyingGlass size={20} weight={'regular'} />
                </InputLeftElement>
                <Input
                    ref={inputRef}
                    placeholder={'Search entire store here'}
                    fontSize={'sm'}
                    _placeholder={{ fontSize: 'sm' }}
                    focusBorderColor={'gold.500'}
                    variant={'filled'}
                    value={searchTerm}
                    onFocus={(e) => setShowHint(true)}
                    onBlur={(e) => {
                        // !!!!!!! HACK !!!!!!!!!
                        setTimeout(() => {
                            setShowHint(false)
                        }, 60)
                    }}
                    onChange={(e) => {
                        setSearchTerm((prevTerm) => {
                            const newSearchTerm = e.target.value
                            if (prevTerm.trim() !== newSearchTerm.trim() && newSearchTerm.length > 1) {
                                setTimeout(() => {
                                    search(newSearchTerm.toLowerCase().trim())
                                }, 900)
                            }
                            return newSearchTerm
                        })
                    }}
                />
                <InputRightElement mr={'1.3rem'}>
                    <Button size={'sm'} paddingX={10} paddingY={'5'}
                        onClick={() => search(searchTerm.toLowerCase().trim())}>
                        Search
                    </Button>
                </InputRightElement>

                {
                    showHint &&
                    <Box
                        bg={'gray.200'}
                        rounded={'md'}
                        maxH={'70vh'}>
                        {
                            isFetching ?
                                <Flex
                                    px={3}
                                    py={2}
                                    justifyContent={'center'}
                                    alignItems={'center'}>
                                    <Spinner />
                                </Flex>
                                :
                                data?.map((p, i) => (
                                    <Flex
                                        key={p.pid}
                                        flexDirection={'column'}
                                        _hover={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setSearchTerm('')
                                            setShowHint(false)
                                            localStorage.setItem('PRODUCT_REF', p.pid)
                                            router.push(`${p.category}/${p.pid}`)
                                        }}>
                                        <Flex
                                            px={3}
                                            py={2}
                                            alignItems={'center'}
                                            w={'full'}>
                                            <Box
                                                boxSize={'50px'}
                                                rounded={'lg'}
                                                position={'relative'}
                                                overflow={'hidden'}
                                                mr={3}>
                                                <Image
                                                    src={p.images[0]}
                                                    alt={''}
                                                    fill
                                                />
                                            </Box>
                                            <Text
                                                fontWeight={'normal'}
                                                fontSize={'sm'}>
                                                {p.productName}
                                            </Text>
                                        </Flex>
                                        {/* {
                                            data?.length - 1 !== i &&
                                            <Divider height={'1px'} bgColor={'gray.400'} orientation={'horizontal'} />
                                        } */}
                                    </Flex>
                                ))
                        }
                    </Box>
                }
            </InputGroup>
        </Flex>
    )
}


export const matchDispatchToProps = dispatch => {
    return {
        search: (query) => dispatch(searchProducts(query))
    }
}

export default connect(null, matchDispatchToProps)(Navbar)