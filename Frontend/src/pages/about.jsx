import React, { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Navbar from "../components/header/navbar";
import { GridSmallBackground } from "../components/ui/grid-small-background";
import Hero from "../components/about/Hero";
import Section2 from "@/components/about/Section2";
import LogoMarquee from "@/components/about/Section3";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/Faqs";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";
import People from "@/components/about/People";
import CheckboxGrid from "@/components/CheckBoxes";
import GetGrids from "@/components/GetGrids";

// Reusable animated wrapper — fades in + slides up on scroll
function AnimatedSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const About = () => {
  //scroll to top
  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo(0, 0); //hard scroll
  }, []);

  const faqs = [
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
      <GridSmallBackground>
        <AnimatedSection delay={0}>
          <div className="flex justify-center items-center mt-50">
            <Hero />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="flex mb-50">
            <LogoMarquee />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <People />
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <Section2 />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <FAQSection faqs={faqs} />
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <Contact />
        </AnimatedSection>

        {/* <CheckboxGrid/> */}
        {/* <GetGrids/> */}
        {/* <ContactForm/> */}
      </GridSmallBackground>
      <Footer />
    </>
  );
};

export default About;
