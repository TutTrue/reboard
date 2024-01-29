import Main from '@/components/Main'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { options } from '@/app/api/auth/[...nextauth]/options'

export default async function Home() {
  const session = await getServerSession(options)

  return (
    <>
      {session ? (
        redirect(`/${session?.user?.username}`)
      ) : (
        <>
          <Main />
        </>
      )}
    </>
  )
}
