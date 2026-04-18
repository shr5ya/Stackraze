import React, { useState } from "react";
import ContactBW from "../assets/ContactBW.png";
import ContactColor from "../assets/ContactColor.png";
import { API_URL } from "../config/api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch(`${API_URL}/user/contact/contactForm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      setStatus("Error connecting to server.");
    }
  };

  return (
    <div className="flex justify-center my-12 px-4">
      <div
        className="flex flex-col md:flex-row w-full max-w-3xl p-4
             rounded-2xl shadow-lg overflow-hidden
             border border-gray-200 dark:border-zinc-700
             bg-white dark:bg-black
             transition-colors duration-300"
      >
        {/* Image Section */}
     <div className="w-full md:w-1/2">
  <div className="relative w-full h-[350px] md:h-full group overflow-hidden rounded-2xl">
    
    {/* Default (BW) Image */}
    <img
      src={ContactBW}
      alt="Contact Black and White"
      className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105"
    />

    {/* Hover (Color) Image */}
    <img
      src={ContactColor}
      alt="Contact Colored"
      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000 ease-in-out"
    />
    
  </div>
</div>

        {/* Form Section */}
        <div className="md:w-1/2 w-full p-6 md:p-8">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2">
            Get in Touch
          </p>

          <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Let's Chat
          </h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            Send us a message and we’ll reply as soon as possible.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 dark:text-white">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border
                           bg-gray-50 dark:bg-zinc-800
                           border-gray-200 dark:border-zinc-700
                           text-sm
                           focus:outline-none focus:ring-1 
                           focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Email + Phone */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="w-full md:w-1/2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border
                             bg-gray-50 dark:bg-zinc-800
                             border-gray-200 dark:border-zinc-700
                             text-sm
                             focus:outline-none focus:ring-1 
                             focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg border
                             bg-gray-50 dark:bg-zinc-800
                             border-gray-200 dark:border-zinc-700
                             text-sm
                             focus:outline-none focus:ring-1 
                             focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                Message
              </label>
              <textarea
                rows="3"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border
                           bg-gray-50 dark:bg-zinc-800
                           border-gray-200 dark:border-zinc-700
                           text-sm resize-y
                           focus:outline-none focus:ring-1 
                           focus:ring-black dark:focus:ring-white"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-medium text-sm
                         bg-black text-white
                         dark:bg-white dark:text-black
                         hover:opacity-90 transition"
            >
              Send Message
            </button>

            {/* Status Message */}
            {status && (
              <p
                className={`text-center text-sm font-medium ${
                  status.includes("success")
                    ? "text-green-500"
                    : status.includes("Sending")
                      ? "text-blue-500"
                      : "text-red-500"
                }`}
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
