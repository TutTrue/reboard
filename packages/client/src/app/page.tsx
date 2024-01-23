import Link from "next/link";

export default function Home() {
  return (
    <nav className='bg-white border-gray-200 dark:bg-green-700 h-[10vh]'>
      <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
        <Link
          href='/'
          className='flex items-center space-x-3 rtl:space-x-reverse'
        >
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            REBOARD
          </span>
        </Link>
        <div className='flex items-center space-x-3 rtl:space-x-reverse'>
          <Link href='/' className="text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-gray-200">
            Login
          </Link>
          <Link href='/' className="inline-flex items-center justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-green-700 hover:bg-green-800 focus:shadow-outline focus:outline-none">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}
