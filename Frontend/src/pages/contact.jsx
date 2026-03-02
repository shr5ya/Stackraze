import React from "react";
import Sidebar from "@/components/Sidebar";
import ContactForm from "@/components/Connect/ContactForm";
import FAQSection from "@/components/Faqs";

function contact() {
  return (
    <>
      <div className="min-h-screen bg-neutral-50 dark:bg-black">
        <Sidebar />
        <main className="min-h-screen pt-20 pb-20 px-4">
          <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
            <h1 className="font-semibold">Contact</h1>
            <ContactForm />
            <FAQSection />
          </div>
        </main>
      </div>
    </>
  );
}

export default contact;
