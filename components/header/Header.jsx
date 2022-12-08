import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from 'next-auth/react'

export default function Header() {
  const { data: session } = useSession()

  function UserSession() {
    return (
      !!session ? 
        <>
          <figure style={{ position: 'relative', height: '40px', width: '40px' }}>
            <Image 
              src={session.user.image}
              alt={session.user.name}
              fill
              sizes="100%"
            />
          </figure>
          <p>{session.user.name}</p>
          <button type='button' onClick={() => signOut({ callbackUrl: '/' })}>Sign Out</button>
        </> 
      : <Link href="/auth">Sign In</Link>
    )
  }

  return (
    <header>
      Header
      <UserSession />
    </header>
  )
}