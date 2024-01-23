import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { cookies } from 'next/headers'

export default async function Home() {
  const session = await getServerSession()
  let token = null
  if (session) {
    token = cookies().get('next-auth.session-token')?.value
  }

  return (
    <nav className="bg-white border-gray-200 dark:bg-green-700 h-[10vh]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            REBOARD
          </span>
        </Link>
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <Link
            href="/api/auth/signin"
            className="text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  )
}
