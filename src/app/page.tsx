"use client";

import UNBCCalendar from "@/components/unbc-calendar";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <UNBCCalendar />
      </div>
    </main>
  );
}