'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router=useRouter();
  const handleCardClick = (userType:"doctor" | "patient") => {
  
  if(userType=== "doctor")
  {
      router.push('/Doctor-login');
  }
  else
  {
    router.push('/login')
  }
  
};


  return (
    <div className=" min-h-screen w-full bg-white flex items-center justify-center px-4" >
      <div className="flex flex-col gap-6 w-full max-w-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:gap-4 text-center sm:text-left">
  <img 
    src="/logo.png" 
    alt="Shedula Logo"
    className="w-10 h-10 rounded-xl object-cover shadow-sm mb-2 sm:mb-0" 
  />
  <h1 className="text-2xl font-bold text-transparent bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text">
  Shedula
</h1>

</div>


        
        
        {/* Doctor Card */}
        <div className="flex flex-col items-center p-6 border rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
        onClick={()=>handleCardClick("doctor")}>
          <img
            src="/Doc_Avatar.jpeg"
            alt="Doctor"
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-800">Doctor</h2>
          <p className="text-sm text-gray-500 text-center">Login to manage appointments</p>
        </div>

        {/* Patient Card */}
        <div className="flex flex-col items-center p-6 border rounded-xl shadow-md hover:shadow-lg transition cursor-pointer" onClick={()=>handleCardClick("patient")}>
          <img
            src="/patientAvatar.png"
            alt="Patient"
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-800">Patient</h2>
          <p className="text-sm text-gray-500 text-center">Book appointments quickly</p>
        </div>
        
      </div>
    </div>
  );
}
