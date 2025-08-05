'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState({
    name: '',
    specialty: '',
    location: '',
    experience: '',
    available_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from('doctorslist')
      .select('name, specialty, location, experience, available_text')
      .eq('name', 'Dr. Raj Singh')
      .single();

    if (data) {
      setDoctor({
        name: data.name || '',
        specialty: data.specialty || '',
        location: data.location || '',
        experience: data.experience || '',
        available_text: data.available_text || '',
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    await supabase
      .from('doctorslist')
      .update(doctor)
      .eq('name', 'Dr. Raj Singh');

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/Doctor-login');
  };

  const handleChange = (field: string, value: string) => {
    setDoctor((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-sky-600">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            value={doctor.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Full Name"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="text"
            value={doctor.specialty}
            onChange={(e) => handleChange('specialty', e.target.value)}
            placeholder="Specialty"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="text"
            value={doctor.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Location"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-sky-400"
          />
          <input
            type="text"
            value={doctor.available_text}
            onChange={(e) => handleChange('available_text', e.target.value)}
            placeholder="Availability"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-sky-400"
          />
          <textarea
            value={doctor.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
            placeholder="Experience"
            className="border rounded-lg p-3 focus:ring-2 focus:ring-sky-400 h-28 md:col-span-2"
          />
        </div>

        {/* Update Button */}
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            className="w-full bg-sky-500 text-white py-3 rounded-lg font-semibold hover:bg-sky-600 transition"
          >
            Update Profile
          </button>
        </div>

        {/* Success Card */}
        {showSuccess && (
          <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-in">
            Profile Updated Successfully!
          </div>
        )}

        {/* Floating Card Animation */}
        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .animate-slide-in {
            animation: slide-in 0.5s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
