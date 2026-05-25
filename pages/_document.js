import { ColorModeScript } from '@chakra-ui/react'
import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import { theme } from '../styles/theme'

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang='en'>
                <Head>
                    <link rel='stylesheet' href='https://api.fontshare.com/v2/css?f[]=clash-grotesk@300,400,500,600,700&display=swap' />
                    <link rel='stylesheet' href='https://api.fontshare.com/v2/css?f[]=millard@300,400,500,600,700&display=swap' />
                    <link rel='stylesheet' href='https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,600,700,800,900&display=swap' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css' integrity='sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==' crossOrigin='anonymous' referrerPolicy='no-referrer' />
                </Head>
                <body>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}