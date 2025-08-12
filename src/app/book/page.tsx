"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  location: string;
  availability: boolean;
  available_text: string;
  experience: string;
  timing: string;
  photo: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase.from("doctorslist").select("*");
      if (error) {
        console.error("Error fetching doctors:", error.message);
      } else {
        setDoctors(data || []);
        if (data && data.length > 0) {
          setSelectedDoctor(data[0]); 
        }
      }
    };
    fetchDoctors();
  }, []);

  const filtered = doctors.filter((dr) =>
    dr.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

     <div className="min-h-screen bg-gray-50 text-gray-800">
           <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
       
          
        

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Doctor Cards Grid */}
          <section className="flex-1 p-8 overflow-y-auto bg-white">
            <div className="flex justify-between items-center mb-6">
             
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.length > 0 ? (
                filtered.map((dr) => (
                  <div
                    key={dr.id}
                    onClick={() => setSelectedDoctor(dr)}
                    className={`flex flex-col items-center bg-white rounded-xl p-6 shadow-md cursor-pointer transform transition duration-300 hover:scale-[1.04] hover:shadow-xl border ${
                      selectedDoctor?.id === dr.id
                        ? "border-sky-400 shadow-lg"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={dr.photo}
                      alt={dr.name}
                      className="w-28 h-28 rounded-full object-cover ring-4 ring-sky-100 shadow-md"
                    />
                    <h3 className="mt-4 text-lg font-semibold text-sky-800">{dr.name}</h3>
                    <p className="text-sm text-sky-600 font-semibold">{dr.specialty}</p>
                    <span className="mt-2 inline-block bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {dr.available_text}
                    </span>
                    <p className="mt-2 text-xs text-gray-500">{dr.experience}</p>
                    <div className="mt-3 inline-block bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-gray-600 font-medium text-xs shadow-sm">
                      {dr.timing}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-400 py-14 italic select-none">
                  No doctors found.
                </p>
              )}
            </div>
          </section>

          {/* Doctor Profile Sidebar */}
          {selectedDoctor && (
            <aside className="w-80 max-h-[600px] bg-white shadow-lg border-l border-sky-100 p-6 flex flex-col overflow-y-auto rounded-lg">
  <img
    src={selectedDoctor.photo}
    alt={selectedDoctor.name}
    className="w-24 h-24 rounded-full object-cover mx-auto ring-4 ring-sky-100"
  />
  <h2 className="text-xl font-bold text-sky-800 mt-4 text-center">
    {selectedDoctor.name}
  </h2>
  <p className="text-center text-sky-500 font-medium text-sm mb-4">
    {selectedDoctor.specialty}
  </p>

  <div className="flex justify-center space-x-4 mb-4 text-sky-600 text-lg">
    <a  className="hover:text-sky-700">
      🐦
    </a>
    <a className="hover:text-sky-700">
      💼
    </a>
    <a  className="hover:text-sky-700">
      📘
    </a>
  </div>

<button
  className="bg-sky-600 text-white rounded-lg py-3 font-semibold hover:bg-sky-700 transition mb-6"
  onClick={() => router.push(`/book-appointment?doctorId=${selectedDoctor.id}`)}
>
  Book Appointment
</button>
              <div className="text-gray-500 text-sm space-y-1 text-center">
                <p>{selectedDoctor.location}</p>
                <p>{selectedDoctor.available_text}</p>
                <p>{selectedDoctor.experience}</p>
                <p>{selectedDoctor.timing}</p>
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
