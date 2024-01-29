import Main from '@/components/Main'
import NavBar from '@/components/NavBar'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from './api/auth/[...nextauth]/options'

export default async function Home() {
  const session = await getServerSession(options)

  return (
    <>
      {
        session ? (
          redirect(`/${session?.user?.username}`)
        ) : (
          <>
            <NavBar />
            <Main />
          </>
        )
      }
    </>
  )
}
