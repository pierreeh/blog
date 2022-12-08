import { getProviders, signIn } from 'next-auth/react'

import Layout from 'components/layout/Layout'

export default function Auth({ providers }) {
  return (
    <section>
      {Object.values(providers).map(provider => {
        return (
          <article key={provider.id}>
            <button type='button' onClick={() => signIn(provider.id, { callbackUrl: '/' })}>
              Sign in with {provider.name}
            </button>
          </article>
        )
      })}
    </section>
  )
}

Auth.getLayout = page => <Layout>{page}</Layout>

export async function getServerSideProps(context) {
  const providers = await getProviders(context)

  return {
    props: { providers }
  }
}