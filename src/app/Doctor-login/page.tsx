'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';


export default function DoctorAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedEmail = email.toLowerCase();

    if (isLogin) {
      // ---- LOGIN ----
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push('/doctor/dashboard');

    } else {
      // ---- SIGNUP ----
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }
      const user = data.user;
      if (user) {
        const { error: insertError } = await supabase.from('doctorslist').insert([
          {
            id: user.id,
            name: `Dr. ${name}`,
            specialty: null,
            location: null,
            photo: null,
            availability: true,
            available_text: "Available today",
            experience: null,
            timing: null,
          },
        ]);

        if (insertError) {
          alert(insertError.message);
          return;
        }
      }

      alert('Signup successful!');
      router.push('/doctor/dashboard');

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 text-black">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6 text-sky-600">
          {isLogin ? 'Doctor Login' : 'Doctor Signup'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400 text-black"
              required
            />
          )}

          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-sky-500 text-white py-2 rounded-md font-semibold hover:bg-sky-600 transition"
          >
            {isLogin ? 'Login' : 'Signup'}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="text-sky-600 font-medium hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>
        <div className="flex flex-col items-center justify-center mt-6 p-6 rounded-xl shadow-lg bg-gradient-to-r from-red-400 via-pink-400 to-purple-500 text-white">
  <h1 className="text-2xl font-bold mb-2">Doctor Credentials</h1>
  <h2 className="text-lg">
    <span className="font-semibold">Email:</span> rajsingh@gmail.com
  </h2>
  <h2 className="text-lg">
    <span className="font-semibold">Password:</span> 123456
  </h2>
</div>

      </div>
    </div>
  );
}
