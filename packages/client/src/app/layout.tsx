import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import { Toaster } from 'react-hot-toast'
import { SocketProvider } from '@/context/socketContext'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Reboard',
  description: 'Simple task management solution.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SocketProvider>
      <html lang="en">
        <body className={inter.className}>
          <NavBar />
          {children}
          <Footer />
          <Toaster position='bottom-right' />
        </body>
      </html>
    </SocketProvider>
  )
}
