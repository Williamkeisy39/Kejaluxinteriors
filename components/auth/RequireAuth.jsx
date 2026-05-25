import { Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const RequireAuth = ({
    children,
    redirectTo = '/login',
    loaderText = 'Checking your account...',
    requireAdmin = false,
    adminEmails = []
}) => {
    const router = useRouter()
    const isAuthLoaded = useSelector((state) => state.auth.isLoaded)
    const isAuthEmpty = useSelector((state) => state.auth.isEmpty)
    const userEmail = useSelector((state) => state.auth.email || state.auth.profile?.email)
    const normalizedEmail = userEmail?.toLowerCase()
    const isAdmin = !requireAdmin || (normalizedEmail && adminEmails.includes(normalizedEmail))

    useEffect(() => {
        if (!isAuthLoaded) return
        if (isAuthEmpty || !isAdmin) {
            router.replace(redirectTo)
        }
    }, [isAuthEmpty, isAuthLoaded, isAdmin, redirectTo, router])

    const displayText = requireAdmin && isAuthLoaded && !isAuthEmpty && !isAdmin
        ? 'Admin access only.'
        : loaderText

    if (!isAuthLoaded || isAuthEmpty || !isAdmin) {
        return (
            <Flex
                position={'fixed'}
                inset={0}
                zIndex={'modal'}
                minH={'100vh'}
                alignItems={'center'}
                justifyContent={'center'}
                bgGradient={'linear(to-br, #fdf7ee, #f9efe1, #f7e4cc)'}>
                <VStack spacing={4} textAlign={'center'}>
                    <Text
                        fontSize={{ base: '2xl', md: '3xl' }}
                        fontWeight={'bold'}
                        letterSpacing={'tight'}>
                        Kejalux Interiors
                    </Text>
                    <Text fontSize={'sm'} color={'gray.600'}>
                        {displayText}
                    </Text>
                    <Spinner color={'gold.500'} size={'lg'} />
                </VStack>
            </Flex>
        )
    }

    return children
}

export default RequireAuth
