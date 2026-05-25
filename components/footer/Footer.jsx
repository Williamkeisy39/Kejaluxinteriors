import { Divider, Flex, Grid, HStack, Icon, IconButton, Stack, Text, VStack, Box } from '@chakra-ui/react';
import Link from 'next/link'
import { At, InstagramLogo, MapPinLine, WhatsappLogo } from 'phosphor-react';
import { useSelector } from 'react-redux';
import Image from 'next/image'

const Footer = () => {
    const auth = useSelector(state => state.auth.profile)

    return (
        <Flex
            py={8}
            bgColor={'gray.900'}
            flexDir={'column'}>

            <Flex
                flexDirection={{ base: 'column', lg: 'row' }}
                justifyContent={'space-between'}
                alignItems={{ base: 'center', lg: 'start' }}
                w={'full'}
                px={12}>
                <Flex
                    flexDirection={'column'}
                    justifyContent={'space-between'}
                    alignItems={{base: 'center', lg: 'start'}}
                    flexGrow={1}>
                    <Box
                        boxSize={{ base: '90px', lg: '110px' }}
                        position={'relative'}
                        flexShrink={0}>
                        <Image
                            src={'/kj2.png'}
                            alt={'Kejalux logo'}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>

                    <Text
                        fontWeight={'light'}
                        fontSize={'sm'}
                        textColor={'white'}
                        maxWidth={'md'}
                        mt={5}
                        textAlign={{base: 'center', lg: 'start'}}>
                        Kejalux Interiors is your premier destination for quality interior decor, business furniture, outdoor pallet furniture, and custom-made furniture solutions. We transform spaces with style and functionality.
                    </Text>

                </Flex>

                <VStack
                    alignItems={{ base: 'center', lg: 'start' }}
                    mt={{base: 8, lg: 0}}>
                    <Text
                        color={'white'}
                        fontWeight={'semibold'}
                        fontSize={'xl'}>
                        Company
                    </Text>

                    <Link href={'/'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Home
                        </Text>

                    </Link>
                    <Link href={'/privacy-policy'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Privacy Policy
                        </Text>
                    </Link>
                    <Link href={'/terms'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Terms and Conditions
                        </Text>
                    </Link>
                    <Link href={'/blog'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Blog
                        </Text>
                    </Link>
                </VStack>

                <VStack
                    alignItems={{ base: 'center', lg: 'start' }}
                    ml={{base: 0, lg: 20}}
                    mt={{base: 8, lg: 0}}>
                    <Text
                        color={'white'}
                        fontWeight={'semibold'}
                        fontSize={'xl'}>
                        My Account
                    </Text>

                    {auth.isEmpty &&
                        <Link href={'/login'}>
                            <Text
                                color={'white'}
                                fontWeight={'normal'}
                                fontSize={'sm'}
                                transition={'all 0.4s ease 0s'}
                                _hover={{
                                    color: 'gold.500',
                                    transition: 'all .4s',
                                    transform: 'translateX(6px)',
                                    transitionProperty: ''
                                }}>
                                Login
                            </Text>

                        </Link>
                    }
                    <Link href={'/cart'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Cart
                        </Text>
                    </Link>
                    <Link href={'/wishlist'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Wishlist
                        </Text>
                    </Link>
                    <Link href={'/orders'}>
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}
                            transition={'all 0.4s ease 0s'}
                            _hover={{
                                color: 'gold.500',
                                transition: 'all .4s',
                                transform: 'translateX(6px)'
                            }}>
                            Orders
                        </Text>
                    </Link>
                </VStack>

                <VStack
                    alignItems={{base: 'center', lg: 'start'}}
                    ml={{base: 0, lg: 20}}
                    mt={{base: 8, lg: 0}}>
                    <Text
                        color={'white'}
                        fontWeight={'semibold'}
                        fontSize={'xl'}>
                        Contact Us
                    </Text>

                    <HStack>
                        <Icon
                            as={MapPinLine}
                            color={'white'}
                            boxSize={5}
                            weight={'duotone'}
                        />
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}>
                            Nairobi, Kenya
                        </Text>
                    </HStack>
                    <HStack>
                        <Icon
                            as={WhatsappLogo}
                            color={'white'}
                            boxSize={5}
                            weight={'duotone'}
                        />
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}>
                            +254782223749
                        </Text>
                    </HStack>
                    <HStack>
                        <Icon
                            as={At}
                            color={'white'}
                            boxSize={5}
                            weight={'duotone'}
                        />
                        <Text
                            color={'white'}
                            fontWeight={'normal'}
                            fontSize={'sm'}>
                            info@kejalux.com
                        </Text>
                    </HStack>

                    <Stack
                        direction={'row'}
                        spacing={4}>

                        <Link
                            href={'https://wa.me/254782223749'} target={'_blank'}>
                            <IconButton
                                aria-label={'whatsapp button'}
                                color={'white'}
                                bgColor={'whiteAlpha.200'}
                                variant={'ghost'}
                                icon={
                                    <WhatsappLogo size={24} weight={'fill'} alt={'WhatsApp'} />
                                }
                                _hover={{
                                    color: 'gold.500'
                                }}
                            />
                        </Link>
                        <Link href={'https://www.instagram.com/kejaluxinteriors/'} target={'_blank'}>
                            <IconButton
                                aria-label={'instagram social button'}
                                color={'white'}
                                bgColor={'whiteAlpha.200'}
                                variant={'ghost'}
                                icon={
                                    <InstagramLogo size={24} weight={'fill'} alt={'Instagram'} />
                                }
                                _hover={{
                                    color: 'gold.500'
                                }}
                            />

                        </Link>
                    </Stack>
                </VStack>
            </Flex>

            <Divider mt={8} mb={4} orientation={'horizontal'} bgColor={'whiteAlpha.500'} />

            <Text
                color={'white'}
                fontWeight={'light'}
                textAlign={'center'}
                fontSize={'sm'}>
                Copyright &copy; 2025 Kejalux Interiors. All Rights Reserved
            </Text>

        </Flex>
    )
}

export default Footer