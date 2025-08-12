'use client';
import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCardClick = (userType: "doctor" | "patient") => {
    router.push(userType === "doctor" ? "/Doctor-login" : "/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 w-full  z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Shedula Logo" className="w-10 h-10 rounded-lg" />
            <span className="font-bold text-xl text-sky-600">Shedula</span>
          </div>
          <nav className="flex gap-6 text-gray-700 font-medium">
            <a href="#home" className="hover:text-sky-500">Home</a>
            <a href="#about" className="hover:text-sky-500">About</a>
            <a href="#contact" className="hover:text-sky-500">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative flex-1 flex items-center justify-center px-4 pt-20">
        <div className="absolute inset-0 bg-[url('/backgroundimg.jpg')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/60 to-white/80 backdrop-blur-sm"></div>

        <div className="relative z-10 flex flex-col gap-8 w-full max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800">
            Manage & Book Appointments Effortlessly
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shedula helps doctors and patients connect seamlessly. Book, manage, and track appointments with ease.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {/* Doctor Card */}
            <div
              className="flex flex-col items-center p-6 border rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
              onClick={() => handleCardClick("doctor")}
            >
              <img src="/Doc_Avatar.jpeg" alt="Doctor" className="w-20 h-20 rounded-full mb-4 shadow-md" />
              <h2 className="text-lg font-semibold text-gray-800">Doctor</h2>
              <p className="text-sm text-gray-500 text-center">Login to manage appointments</p>
            </div>

            {/* Patient Card */}
            <div
              className="flex flex-col items-center p-6 border rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
              onClick={() => handleCardClick("patient")}
            >
              <img src="/patientAvatar.png" alt="Patient" className="w-20 h-20 rounded-full mb-4 shadow-md" />
              <h2 className="text-lg font-semibold text-gray-800">Patient</h2>
              <p className="text-sm text-gray-500 text-center">Book appointments quickly</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About Shedula</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Shedula is a smart platform that bridges the gap between doctors and patients. We provide a seamless booking experience, secure record management, and easy communication.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="font-semibold text-lg text-sky-600">Easy Scheduling</h3>
              <p className="text-gray-500">Book appointments in just a few clicks.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-sky-600">Secure Records</h3>
              <p className="text-gray-500">Your data is encrypted and safe with us.</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-sky-600">Fast Access</h3>
              <p className="text-gray-500">Manage your health info anytime, anywhere.</p>
            </div>
          </div>
        </div>
      </section>
      {/*Contact*/}
    <section id="contact" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Get in Touch</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Have questions or need help? Fill out the form below and our team will get back to you as soon as possible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <form className="bg-white p-6 rounded-xl shadow-md space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
              />
              <input
                type="email"
                placeholder="Your Email"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
              />
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-400 outline-none"
              ></textarea>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Send Message
              </button>
            </form>

            {/* Contact Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Email</h3>
                <p className="text-gray-600">support@shedula.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Phone</h3>
                <p className="text-gray-600">+91 98765 43210</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Address</h3>
                <p className="text-gray-600">kamineni hospitals lb nagar, Hyderabad, India</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Shedula. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
