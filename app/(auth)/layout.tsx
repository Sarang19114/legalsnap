import { type Metadata } from 'next'
import Link from 'next/link'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Authentication - LegalSnap',
  description: 'Sign in or sign up to access your legal consultation dashboard',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left: Branding */}
      <div className="md:w-1/2 flex flex-col justify-center items-center bg-black text-white p-10 min-h-[300px]">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          <Link href="/" className="flex items-center space-x-2 mb-8">
            <Scale className="h-10 w-10 text-white" />
            <span className="font-bold text-3xl tracking-tight">LegalSnap</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">Manage and Get Legal Help Easily</h1>
          <p className="text-lg text-gray-200 mb-8 text-center">Using this app you can easily get instant, expert legal advice and manage your consultations securely.</p>
          <div className="w-full max-w-lg mb-4 flex items-center justify-center">
            <img
              className="aspect-15/8 rounded-2xl object-cover w-full transition-transform duration-300 hover:scale-110 hover:-rotate-6"
              src="/hero.png"
              alt="app screen"
              width="2700"
              height="1440"
            />
          </div>
        </div>
      </div>
      {/* Right: Auth Form */}
      <div className="md:w-1/2 flex flex-col justify-center items-center bg-white min-h-screen p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
