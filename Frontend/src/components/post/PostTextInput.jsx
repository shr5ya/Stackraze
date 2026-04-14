import React, { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { refineText } from "@/utils/openRouter";

function PostTextInput({ content, setContent, maxLength, isSubmitting }) {
  const [isRefining, setIsRefining] = useState(false);

  // Undo / Redo stacks
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Scroll UI
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const textareaRef = useRef(null);

  // ✅ REFINE HANDLER
  const handleRefine = async () => {
    if (!content.trim()) return;

    try {
      // Save current state for undo
      setHistory((prev) => [...prev, content]);
      setRedoStack([]); // clear redo on new action

      setIsRefining(true);

      const refined = await refineText(
        content,
        "Improve grammar and make it engaging for a dev community platform"
      );

      setContent(refined.slice(0, maxLength));
    } catch (error) {
      console.error(error);
    } finally {
      setIsRefining(false);
    }
  };

  // ✅ KEYBOARD HANDLER (UNDO / REDO)
  const handleKeyDown = (e) => {
    const isUndo = (e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey;
    const isRedo =
      (e.ctrlKey || e.metaKey) &&
      (e.key === "Z" || (e.key === "z" && e.shiftKey));

    if (isUndo && history.length > 0) {
      e.preventDefault();

      setHistory((prev) => {
        const newHistory = [...prev];
        const last = newHistory.pop();

        setRedoStack((redo) => [...redo, content]);
        setContent(last);

        return newHistory;
      });
    }

    if (isRedo && redoStack.length > 0) {
      e.preventDefault();

      setRedoStack((prev) => {
        const newRedo = [...prev];
        const last = newRedo.pop();

        setHistory((hist) => [...hist, content]);
        setContent(last);

        return newRedo;
      });
    }
  };

  // ✅ AUTO FOCUS
  useEffect(() => {
    if (textareaRef.current) {
      setTimeout(() => {
        const el = textareaRef.current;
        el?.focus();

        if (el?.value) {
          const len = el.value.length;
          el.setSelectionRange(len, len);
        }
      }, 50);
    }
  }, []);

  // ✅ SCROLL DETECTION
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    const checkScroll = () => {
      const scrollable = el.scrollHeight > el.clientHeight;
      const atBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      const atTop = el.scrollTop <= 2;

      setIsScrollable(scrollable);
      setIsAtBottom(atBottom);
      setIsAtTop(atTop);
    };

    checkScroll();
    el.addEventListener("scroll", checkScroll);

    return () => el.removeEventListener("scroll", checkScroll);
  }, [content]);

  const charPercent = content.length / maxLength;

  return (
    <div className="relative flex flex-col w-full h-full">

      {/* 🔹 REFINE BUTTON */}
      <button
        onClick={handleRefine}
        disabled={isRefining || isSubmitting || !content.trim()}
        title="Refine with AI"
        className={`absolute top-0 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200
          ${
            isRefining
              ? "bg-indigo-500 text-white shadow-md"
              : "bg-neutral-100 dark:bg-neutral-800 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:ring-2 hover:ring-indigo-200 dark:hover:ring-indigo-900"
          }
          disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {isRefining ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" />
            <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z" />
          </svg>
        )}
      </button>

      {/* 🔹 SHIMMER */}
      {isRefining && (
        <div className="absolute inset-0 z-10 pointer-events-none rounded-md overflow-hidden flex flex-col gap-2 p-1 pt-2">
          {[85, 65, 75, 50].map((w, i) => (
            <div
              key={i}
              className="h-3.5 rounded-md bg-neutral-200 dark:bg-neutral-700 animate-pulse"
              style={{ width: `${w}%`, animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      )}

      {/* 🔹 TOP FADE */}
      {isScrollable && !isAtTop && (
        <div className="pointer-events-none absolute top-0 left-0 w-full h-6 z-10 
          bg-gradient-to-b from-white dark:from-neutral-900 to-transparent" />
      )}

      {/* 🔹 TEXTAREA */}
      <textarea
        ref={textareaRef}
        value={content}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setContent(e.target.value.slice(0, maxLength));
          setRedoStack([]); // clear redo on typing
        }}
        placeholder="Start writing..."
        disabled={isSubmitting || isRefining}
        className={`flex-1 scrollbar-hide w-full h-full pr-14 pb-6 bg-transparent text-base leading-relaxed
          placeholder:text-neutral-400 dark:placeholder:text-neutral-500
          resize-none focus:outline-none overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-300 dark:scrollbar-thumb-neutral-700 transition-all
          ${
            isRefining
              ? "text-transparent select-none"
              : "text-neutral-800 dark:text-neutral-100"
          }`}
      />

      {/* 🔹 BOTTOM FADE */}
      {isScrollable && !isAtBottom && (
        <div className="pointer-events-none absolute bottom-0 left-0 w-full h-10 z-10 
          bg-gradient-to-t from-white dark:from-neutral-900 to-transparent" />
      )}

      {/* 🔹 CHARACTER COUNT */}
      {content.length > 0 && (
        <div
          className={`absolute bottom-0 right-4 text-xs z-20 transition-colors bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-1 rounded ${
            charPercent >= 0.95
              ? "text-red-500"
              : charPercent >= 0.75
              ? "text-amber-500"
              : "text-neutral-400 dark:text-neutral-500"
          }`}
        >
          {content.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

export default PostTextInput;