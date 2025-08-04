'use client';
import { useState } from 'react';
import Link from 'next/link';
import { HiHome, HiUserGroup } from 'react-icons/hi';
import { FaCalendarCheck, FaSignOutAlt, FaUser } from 'react-icons/fa';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top Navbar (Visible only on screens ≥ 640px) */}
      <nav className="hidden sm:flex justify-end p-4 gap-4">
        <Link href="/home" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 py-2">
          <HiHome className="text-xl" />
          Home
        </Link>

        <Link href="/book" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 py-2">
          <HiUserGroup className="text-xl" />
          Doctors
        </Link>

        <Link href="/appointments" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 py-2">
          <FaCalendarCheck className="text-xl" />
          Appointments
        </Link>

        <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-sky-600 py-2">
          <FaSignOutAlt className="text-xl" />
          Logout
        </Link>
      </nav>

      {/* Bottom Navbar (Visible only on mobile screens < 640px) */}
      <nav className="fixed bottom-0 w-full bg-white border-t sm:hidden z-50">
        <div className="flex justify-around items-center py-2">
          <Link href="/home" className="flex flex-col items-center text-sm text-gray-700 hover:text-sky-600">
            <HiHome className="text-xl" />
            Home
          </Link>

          <Link href="/book" className="flex flex-col items-center text-sm text-gray-700 hover:text-sky-600">
            <HiUserGroup className="text-xl" />
            Doctors
          </Link>

          <Link href="/appointments" className="flex flex-col items-center text-sm text-gray-700 hover:text-sky-600">
            <FaCalendarCheck className="text-xl" />
            Appointments
          </Link>

          <Link href="/login" className="flex flex-col items-center text-sm text-gray-700 hover:text-sky-600">
            <FaUser className="text-xl" />
            logout
          </Link>
        </div>
      </nav>
    </>
  );
}
