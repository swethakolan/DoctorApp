"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

interface Doctor {
  id: string; // UUID from Supabase
  name: string;
  specialty: string;
  location: string;
  availability: boolean;
  available_text: string; // matches the column name in Supabase
  experience: string;
  timing: string;
  photo: string;
}

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const router = useRouter();

  // Fetch doctors from Supabase
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from("doctorslist").select("*");
      if (error) {
        console.error("Error fetching doctors:", error.message);
      } else {
        setDoctors(data || []);
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((dr) =>
    dr.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-800">
      <Navbar />
      <div className="flex justify-center min-h-screen py-4 px-3">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <img
              src="/avatar.jpeg"
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h1 className="font-semibold text-base sm:text-lg text-black">
                Hello, Priya
              </h1>
              <p className="text-xs text-gray-400">@ Dombivli, Mumbai</p>
            </div>
          </div>

          {/* Search */}
          <div className="px-4 pb-3">
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-sky-400 outline-none text-sm text-black"
              placeholder="Search Doctors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Doctor Cards */}
          <div className="space-y-4 px-3 text-black">
            {filtered.map((dr) => (
              <div
                key={dr.id}
                onClick={() => router.push(`/book-appointment?doctorId=${dr.id}`)}
                className="flex flex-col sm:flex-row items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.01] cursor-pointer"
              >
                <img
                  src={dr.photo}
                  alt={dr.name}
                  className="w-20 h-20 rounded-full object-cover mb-3 sm:mb-0"
                />
                <div className="flex-1 sm:ml-5 space-y-1 text-sm text-gray-800">
                  <h2 className="font-semibold text-base text-black">{dr.name}</h2>
                  <p className="text-xs text-sky-500 font-medium">{dr.specialty}</p>
                  <span className="inline-block mt-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full shadow-sm">
                    {dr.available_text}
                  </span>
                  <p className="text-xs text-gray-500">{dr.experience}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs bg-gray-100 border border-gray-200 rounded px-2 py-0.5 text-gray-700">
                      {dr.timing}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-sm">
                No doctors found.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
