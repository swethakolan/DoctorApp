'use client';

import { FaCalendarAlt, FaUserMd, FaListUl, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Function to highlight active link
  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="flex min-h-screen bg-gray-100 text-black ">
      {/* Sidebar for Desktop */}
      <div className="hidden md:flex flex-col bg-white shadow-lg w-64 p-6">
        <h2 className="text-2xl font-bold text-sky-600 mb-8">Doctor Panel</h2>
        <nav className="space-y-4">
          <Link
            href="/doctor/dashboard"
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isActive('/doctor/dashboard') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaUserMd /> Dashboard
          </Link>
          <Link
            href="/doctor/appointments"
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isActive('/doctor/appointments') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaListUl /> Appointments
          </Link>
          <Link
            href="/doctor/calendar"
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isActive('/doctor/calendar') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt /> Calendar
          </Link>
          <Link
            href="/doctor/profile"
            className={`flex items-center gap-3 p-3 rounded-lg ${
              isActive('/doctor/profile') ? 'bg-sky-100 text-sky-600' : 'hover:bg-gray-100'
            }`}
          >
            <FaUser /> Profile
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">{children}</div>

      {/* Bottom Navbar for Mobile */}
      <div className="fixed bottom-0 left-0 w-full bg-white shadow-md flex justify-around py-3 md:hidden">
        <Link
          href="/doctor/dashboard"
          className={`${isActive('/doctor/dashboard') ? 'text-sky-600' : 'text-gray-500'}`}
        >
          <FaUserMd size={22} />
        </Link>
        <Link
          href="/doctor/appointments"
          className={`${isActive('/doctor/appointments') ? 'text-sky-600' : 'text-gray-500'}`}
        >
          <FaListUl size={22} />
        </Link>
        <Link
          href="/doctor/calendar"
          className={`${isActive('/doctor/calendar') ? 'text-sky-600' : 'text-gray-500'}`}
        >
          <FaCalendarAlt size={22} />
        </Link>
        <Link
          href="/doctor/profile"
          className={`${isActive('/doctor/profile') ? 'text-sky-600' : 'text-gray-500'}`}
        >
          <FaUser size={22} />
        </Link>
      </div>
    </div>
  );
}
