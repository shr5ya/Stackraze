import React from "react";
import Navbar from "../components/header/navbar";
import { GridSmallBackground } from "../components/ui/grid-small-background";
import Hero  from "../components/about/Hero";
import Section2 from "@/components/about/Section2";
import LogoMarquee from "@/components/about/Section3";
import ContactForm from "@/components/ContactForm";
import FAQSection from "@/components/Faqs";
import Contact from "@/components/contact";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <GridSmallBackground>
        <div className="flex justify-center items-center mt-50">
          <Hero/>
        </div>
          <div className="flex mb-50">
          <LogoMarquee/>
          </div>
          <Section2/>
          <FAQSection/>
          <Contact/>
          {/* <ContactForm/> */}
      </GridSmallBackground>
      <Footer/>
    </>
  );
};

export default About;

