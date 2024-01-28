import { getServerSession } from 'next-auth'
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

export default async function NavBar() {
  const session = await getServerSession()

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
        {session ? (
          <div className='flex items-center gap-4'>
            <Image
              src={session.user?.image || '/images/default-user.png'}
              alt='user image'
              width={50}
              height={50}
              className='rounded-full'
            />
            <Link
              href='/api/auth/signout?callbackUrl=/'
              className='dark:text-white'
            >
              Logout
            </Link>
          </div>
        ) : (
          <Link href='/api/auth/signin' className='dark:text-white'>
            Login
          </Link>
        )}
      </div>
    </nav>
  )
}
