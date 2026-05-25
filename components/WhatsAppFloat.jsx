import { Box, Button, HStack, Text } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { WhatsappLogo } from 'phosphor-react'
import Link from 'next/link'

const bounceAnimation = {
    animate: {
        y: [0, -6, 0, -3, 0],
        transition: {
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
        }
    }
}

const WhatsAppFloat = () => {
    return (
        <Box
            as={motion.div}
            variants={bounceAnimation}
            animate={'animate'}
            position={'fixed'}
            bottom={{ base: '20px', lg: '30px' }}
            right={{ base: '20px', lg: '30px' }}
            zIndex={'tooltip'}>
            <Link href={'https://wa.me/254782223749'} target={'_blank'}>
                <Button
                    aria-label={'Chat with us on WhatsApp'}
                    rounded={'full'}
                    bg={'white'}
                    color={'gray.800'}
                    border={'1px solid'}
                    borderColor={'gray.300'}
                    boxShadow={'lg'}
                    px={5}
                    py={5}
                    _hover={{
                        bg: 'gray.900',
                        color: 'white',
                        borderColor: 'gray.900',
                        transform: 'scale(1.05)',
                    }}
                    transition={'all 0.3s'}>
                    <HStack spacing={2}>
                        <WhatsappLogo size={22} weight={'fill'} />
                        <Text fontSize={'sm'} fontWeight={'medium'}>Chat with us</Text>
                    </HStack>
                </Button>
            </Link>
        </Box>
    )
}

export default WhatsAppFloat
