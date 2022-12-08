import Head from "next/head"
import { SessionProvider } from "next-auth/react"

import { GlobalStyles } from "styles/ClobalStyles.style"

export default function Blog({ Component, pageProps: { session, ...pageProps } }) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <SessionProvider session={session}>
      <Head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="minimum-scale=1,initial-scale=1,width=device-width,shrink-to-fit=no,viewport-fit=cover" />
      </Head>

      <GlobalStyles />
      {getLayout(<Component {...pageProps} />)}
    </SessionProvider>
  )
}
