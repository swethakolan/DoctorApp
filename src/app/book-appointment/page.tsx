// app/book-appointment/page.tsx

import { Suspense } from "react";
import BookAppointment from "@/components/BookAppointment"; 

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <BookAppointment />
    </Suspense>
  );
}
