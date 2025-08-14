'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome, HiUserGroup } from 'react-icons/hi';
import { FaCalendarCheck, FaSignOutAlt, FaUser,FaFileMedical } from 'react-icons/fa';

export default function Navbar() {
  
  const pathname = usePathname(); 

  const linkClasses = (path: string) =>
    `flex items-center gap-2 py-2 transition-colors duration-200 ${
      pathname === path ? 'text-sky-600 font-semibold' : 'text-gray-700 hover:text-sky-600'
    }`;

  const mobileLinkClasses = (path: string) =>
    `flex flex-col items-center text-sm transition-colors duration-200 ${
      pathname === path ? 'text-sky-600 font-semibold' : 'text-gray-700 hover:text-sky-600'
    }`;

  return (
    <>
     
      <nav className="hidden sm:flex justify-end p-4 gap-6 mr-4">
        <Link href="/home" className={linkClasses('/home')}>
          <HiHome className="text-xl" />
          Home
        </Link>

        <Link href="/book" className={linkClasses('/book')}>
          <HiUserGroup className="text-xl" />
          Doctors
        </Link>

        <Link href="/appointments" className={linkClasses('/appointments')}>
          <FaCalendarCheck className="text-xl" />
          Appointments
        </Link>

        <Link href="/medical_history" className={linkClasses('/medical_history')}>
           <FaFileMedical className="text-xl" />
          Medical history
        </Link>

        <Link href="/login" className={linkClasses('/login')}>
          <FaSignOutAlt className="text-xl" />
          Logout
        </Link>
      </nav>

      {/* Bottom Navbar (Visible only on mobile screens < 640px) */}
      <nav className="fixed bottom-0 w-full bg-white border-t sm:hidden z-50">
        <div className="flex justify-around items-center py-2">
          <Link href="/home" className={mobileLinkClasses('/home')}>
            <HiHome className="text-xl" />
            Home
          </Link>

          <Link href="/book" className={mobileLinkClasses('/book')}>
            <HiUserGroup className="text-xl" />
            Doctors
          </Link>

          <Link href="/appointments" className={mobileLinkClasses('/appointments')}>
            <FaCalendarCheck className="text-xl" />
            Appointments
          </Link>

          <Link href="/medical_history" className={mobileLinkClasses('/medical_history')}>
             <FaFileMedical className="text-xl" />
            Medical history
          </Link>

          <Link href="/login" className={mobileLinkClasses('/login')}>
            <FaUser className="text-xl" />
            Logout
          </Link>
        </div>
      </nav>
    </>
  );
}
