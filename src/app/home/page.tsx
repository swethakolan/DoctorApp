'use client';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { FaSearch, FaCalendarAlt, FaHospitalAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-blue-100 text-center py-10 px-4"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Book appointments with trusted professionals
        </h2>
        <p className="text-gray-700 mb-6">Fast, simple & secure</p>
       <motion.div
 
>
  <Link href="/book">
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold">
      Book Now
    </button>
  </Link>
</motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-10 px-4 sm:px-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
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
            icon={<FaSearch size={32} className="text-blue-600" />}
            title="Search Doctors"
            description="Browse by specialty, location, or rating"
          />
          <FeatureCard
            icon={<FaCalendarAlt size={32} className="text-purple-600" />}
            title="Book Appointments"
            description="Pick your date and time in seconds"
          />
          <FeatureCard
            icon={<FaHospitalAlt size={32} className="text-pink-600" />}
            title="Trusted Clinics"
            description="All doctors are verified and rated by patients"
          />
        </motion.div>
      </section>
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
      className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-lg transition"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
