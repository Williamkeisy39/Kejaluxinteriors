import { ChakraProvider } from '@chakra-ui/react'
import { useRouter, Router } from 'next/router'
import Layout from '../components/Layout'
import RequireAuth from '../components/auth/RequireAuth'

import '../styles/globals.css'

import { theme } from '../styles/theme'
import { persistor, store } from '../store/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import NProgress from 'nprogress'
import { useEffect } from 'react'
import { fetchMe } from '../store/authReducer'

const authRouteConfig = {
  '/checkout': {
    redirectTo: '/signup',
    loaderText: 'Preparing your checkout...'
  },
  '/orders': {
    redirectTo: '/signup',
    loaderText: 'Loading your orders...'
  },
  '/admin': {
    redirectTo: '/login',
    loaderText: 'Loading admin dashboard...',
    requireAdmin: true
  }
}

function AuthBootstrap({ children }) {
  useEffect(() => {
    store.dispatch(fetchMe())
  }, [])
  return children
}

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  NProgress.configure({ showSpinner: true });

  const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAIL || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)

  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  });

  Router.events.on('routeChangeComplete', () => {
    NProgress.done();
  });

  const authConfig = authRouteConfig[router.pathname]
  const pageContent = authConfig ? (
    <RequireAuth
      redirectTo={authConfig.redirectTo}
      loaderText={authConfig.loaderText}
      requireAdmin={authConfig.requireAdmin}
      adminEmails={adminEmails}>
      <Component {...pageProps} />
    </RequireAuth>
  ) : (
    <Component {...pageProps} />
  )

  return (
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <PersistGate loading={null} persistor={persistor}>
          <AuthBootstrap>
            <Layout>
              {pageContent}
            </Layout>
          </AuthBootstrap>
        </PersistGate>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp