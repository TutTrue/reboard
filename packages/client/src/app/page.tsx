import NavBar from '@/components/NavBar'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'

export default async function Home() {
  const session = await getServerSession()
  let token = null
  if (session) {
    token = cookies().get('next-auth.session-token')?.value
  }

  return (
      <NavBar />
  )
}
