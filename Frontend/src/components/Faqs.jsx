import React, { useState } from "react";
import { Plus, X } from "lucide-react";

const defaultFaqs = [
  {
    question: "How do I reset my password?",
    answer:
      "Please send a mail to abhisheksharma7340733@gmail.com with your details and we'll change your password as requested. Or try filling contact form with your concern.",
  },
  {
    question: "Do you offer custom pricing plans?",
    answer:
      "Yes, we tailor our pricing based on the specific needs and scale of your project. Contact us for a personalized quote.",
  },
  {
    question: "How do I get started with a new project?",
    answer:
      "Simply fill out our contact form or send us an email. We'll schedule a discovery call to discuss your goals within 24 hours.",
  },
  {
    question: "Can I upgrade my plan later on?",
    answer:
      "Absolutely! You can change your subscription tier at any time through your account dashboard or by contacting support.",
  },
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="mb-3">
      <button
        onClick={onClick}
        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 ${
          isOpen
            ? "bg-white shadow-md border border-gray-100 dark:bg-slate-800 dark:border-slate-700"
            : "bg-indigo-50/50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-slate-800"
        }`}
      >
        <span className="font-semibold text-gray-800 dark:text-white text-base">
          {question}
        </span>

        <div
          className={`p-1 rounded-full transition-transform duration-300 ${
            isOpen
              ? "bg-indigo-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400"
              : "bg-white dark:bg-slate-700 text-gray-400"
          }`}
        >
          {isOpen ? <X size={16} /> : <Plus size={16} />}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-2 text-gray-700 dark:text-slate-200 text-sm leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection = ({ faqs = defaultFaqs }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <p className="text-[16px] font-bold tracking-[0.2em] text-gray-400 dark:text-slate-500 uppercase mb-3">
          Trusted By
        </p>

        <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={activeIndex === index}
            onClick={() => handleToggle(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;