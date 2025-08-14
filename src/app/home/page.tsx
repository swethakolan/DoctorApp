'use client';

import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaHospitalAlt, FaFileMedical, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-center text-white py-16 px-4"
      >
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Book Appointments with Trusted Doctors
        </h1>
        <p className="text-lg sm:text-xl mb-8 text-gray-100">
          Fast, simple, and secure healthcare booking platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/book">
            <button className="bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold shadow-md">
              Book Now
            </button>
          </Link>
          <Link href="/prescriptions">
            <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium shadow-md">
              <FaFileMedical />
              View Prescriptions
            </button>
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-10 flex-1">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          <FeatureCard
            icon={<FaSearch size={40} className="text-blue-500" />}
            title="Search Doctors"
            description="Browse by specialty, location, or patient ratings."
          />
          <FeatureCard
            icon={<FaCalendarAlt size={40} className="text-purple-500" />}
            title="Book Appointments"
            description="Pick your date and time in seconds without calls."
          />
          <FeatureCard
            icon={<FaHospitalAlt size={40} className="text-pink-500" />}
            title="Verified Clinics"
            description="All doctors are verified and reviewed by patients."
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 mt-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-white">MediBook</h3>
            <p className="text-sm leading-relaxed">
              Your trusted healthcare appointment platform. Book, manage, and track your health journey effortlessly.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/book" className="hover:underline">Book Appointment</Link></li>
              <li><Link href="/prescriptions" className="hover:underline">Prescriptions</Link></li>
              <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-3 text-white">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white"><FaFacebook size={20} /></a>
              <a href="#" className="hover:text-white"><FaTwitter size={20} /></a>
              <a href="#" className="hover:text-white"><FaLinkedin size={20} /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">
          © {new Date().getFullYear()}All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition transform hover:scale-105"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
