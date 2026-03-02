import React, { useState, useEffect } from "react";
import { API_URL } from "../../config/api";

const FORM_TYPES = [
    { label: "Contact", value: "CONTACT" },
    { label: "Feedback", value: "FEEDBACK" },
    { label: "Suggestion", value: "SUGGESTION" },
];

const placeholders = {
    CONTACT: "Describe your query or how we can help you.",
    FEEDBACK: "We'd love to hear your thoughts on Anchor.",
    SUGGESTION: "Share ideas to help us improve Anchor.",
};

function getUserFromStorage() {
    try {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export default function ContactForm() {
    const [activeType, setActiveType] = useState("CONTACT");
    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = getUserFromStorage();
        if (user) {
            setForm((prev) => ({
                ...prev,
                name: user.name || user.username || "",
                email: user.email || "",
            }));
        }
    }, []);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setErrorMsg("");

        try {
            const res = await fetch(`${API_URL}/user/contact/contactForm`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, type: activeType }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("success");
                setForm((prev) => ({ ...prev, message: "" }));
            } else {
                setStatus("error");
                setErrorMsg(data.message || "Something went wrong. Please try again.");
            }
        } catch {
            setStatus("error");
            setErrorMsg("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const inputCls =
        "w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 " +
        "dark:border-neutral-700 bg-white dark:bg-neutral-900 " +
        "text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 " +
        "focus:outline-none focus:ring-2 focus:ring-black transition";

    return (
        <div
            className="
                w-full bg-white dark:bg-neutral-950
                border border-neutral-200 dark:border-neutral-800
                rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.05)]
                p-6 md:p-8 space-y-6
            "
        >
            {/* Header */}
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Reach Out
            </h3>

            {/* Type Tabs */}
            <div className="flex gap-2">
                {FORM_TYPES.map(({ label, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => {
                            setActiveType(value);
                            setStatus(null);
                        }}
                        className={`
                            px-4 py-1.5 rounded-full text-sm font-medium border
                            transition-all duration-150
                            ${activeType === value
                                ? "bg-black text-white border-black"
                                : "bg-white dark:bg-neutral-900 text-neutral-600 " +
                                "dark:text-neutral-400 border-neutral-300 " +
                                "dark:border-neutral-700 hover:border-neutral-500 hover:text-black"
                            }
                        `}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Success */}
            {status === "success" && (
                <div
                    className="
                        px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-800
                        border border-neutral-200 dark:border-neutral-700
                        text-neutral-800 dark:text-neutral-200 text-sm
                    "
                >
                    ✓ Your {FORM_TYPES.find((t) => t.value === activeType)?.label.toLowerCase()} was submitted.
                </div>
            )}

            {/* Error */}
            {status === "error" && (
                <div
                    className="
                        px-4 py-3 rounded-lg bg-neutral-100 dark:bg-neutral-900
                        border border-neutral-300 dark:border-neutral-700
                        text-neutral-700 dark:text-neutral-300 text-sm
                    "
                >
                    {errorMsg}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Hidden: name & email auto-filled */}
                <input type="hidden" name="name" value={form.name} />
                <input type="hidden" name="email" value={form.email} />

                {/* Message */}
                <div>
                    <label
                        className="
                            text-sm font-medium text-neutral-700 
                            dark:text-neutral-300 block mb-1
                        "
                    >
                        Message
                    </label>
                    <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        minLength={5}
                        rows={4}
                        placeholder={placeholders[activeType]}
                        className={`${inputCls} resize-none`}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="
                        w-full py-2.5 rounded-lg bg-black
                        hover:bg-neutral-900 disabled:bg-neutral-500
                        text-white font-semibold text-sm
                        transition flex items-center justify-center gap-2
                    "
                >
                    {loading ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending…
                        </>
                    ) : (
                        `Send ${FORM_TYPES.find((t) => t.value === activeType)?.label}`
                    )}
                </button>
            </form>
        </div>
    );
}