import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ContactForm from "@/components/Connect/ContactForm";
import FAQSection from "@/components/Faqs";

function contact() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    // window.scrollTo(0, 0); //hard scroll
  }, []);

  const faqs = [
    {
      question: "How do I reset my password?",
      answer:
        "Please send an email to algyn.connect@gmail.com with your details and we'll change your password as requested. You can also try filling out the contact form with your concern.",
    },
    {
      question: "How do I delete my account permanently?",
      answer:
        "Just send us an email or submit your request through the contact form above.",
    },
    {
      question: "Want to contribute to our community?",
      answer:
        "We appreciate your interest in contributing. Please send us your feedback or suggestions along with your contact details, and we will try to connect with you as soon as possible.",
    },
    {
      question: "What's coming next to the platform?",
      answer:
        "We are building a developer community for coders and people in tech. We believe technology should be accessible to everyone so that people can learn something new every day and grow together.",
    },
    {
      question: "Is this platform free to use?",
      answer:
        "Yes, the platform is currently free to use for all members. Our goal is to help developers learn, share knowledge, and grow together.",
    },
    {
      question: "How can I report a bug or issue?",
      answer:
        "If you encounter any bugs or issues, please use the contact form or send us an email describing the problem along with screenshots if possible.",
    },
    {
      question: "Can I edit or update my profile information?",
      answer:
        "Yes, you can update your profile information anytime from your profile settings after logging into your account.",
    },
    {
      question: "How can I contact the support team?",
      answer:
        "You can reach our support team by sending an email to algyn.connect@gmail.com or by filling out the contact form on the website.",
    },
    {
      question: "Do I need an account to explore the platform?",
      answer:
        "Some content may be visible without an account, but creating an account allows you to fully participate in the community and access all features.",
    },
    {
      question: "How can I give feedback or suggestions?",
      answer:
        "We love hearing from our community! You can send feedback through the contact form or email us your ideas and suggestions.",
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-neutral-50 dark:bg-black">
        <Sidebar />
        <main className="min-h-screen pt-20 pb-20 px-4">
          <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
            <h1 className="font-semibold">Contact</h1>
            <ContactForm />
            <FAQSection faqs={faqs} />
          </div>
        </main>
      </div>
    </>
  );
}

export default contact;
