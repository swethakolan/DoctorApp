'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCardClick = (userType: "doctor" | "patient") => {
    if (userType === "doctor") {
      router.push("/Doctor-login");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 relative overflow-hidden">
      
      
      <div className="absolute inset-0 bg-[url('/backgroundimg.jpg')] bg-cover bg-center opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-white/80 backdrop-blur-sm"></div>

      <div className="relative z-10 flex flex-col gap-8 w-full max-w-sm">
        
       
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 text-center sm:text-left">
          <img
            src="/logo.png"
            alt="Shedula Logo"
            className="w-12 h-12 rounded-xl object-cover shadow-md mb-2 sm:mb-0 transition-transform hover:scale-105"
          />
          <h1 className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text">
            Shedula
          </h1>
        </div>

        {/* Doctor Card */}
        <div
          className="flex flex-col items-center p-6 border rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
          onClick={() => handleCardClick("doctor")}
        >
          <img
            src="/Doc_Avatar.jpeg"
            alt="Doctor"
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-md transition-transform duration-300 group-hover:scale-110"
          />
          <h2 className="text-lg font-semibold text-gray-800">Doctor</h2>
          <p className="text-sm text-gray-500 text-center">
            Login to manage appointments
          </p>
        </div>

        {/* Patient Card */}
        <div
          className="flex flex-col items-center p-6 border rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-white"
          onClick={() => handleCardClick("patient")}
        >
          <img
            src="/patientAvatar.png"
            alt="Patient"
            className="w-20 h-20 rounded-full object-cover mb-4 shadow-md transition-transform duration-300 group-hover:scale-110"
          />
          <h2 className="text-lg font-semibold text-gray-800">Patient</h2>
          <p className="text-sm text-gray-500 text-center">
            Book appointments quickly
          </p>
        </div>
      </div>
    </div>
  );
}
