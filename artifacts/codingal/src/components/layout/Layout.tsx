import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BookingModal } from "../BookingModal";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
}
