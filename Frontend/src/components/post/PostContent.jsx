import React, { useState } from "react";

const PostContent = ({ content, maxLength = 180 }) => {
  const [expanded, setExpanded] = useState(false);

  if (!content) return null;


  // Determine if content needs truncation
  const isLong = content.length > maxLength;

  const displayText = expanded || !isLong
    ? content
    : content.slice(0, maxLength) + "...";

  
   //// Convert URLs into clickable links inside text
  const linkifyText = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;  


    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 dark:text-blue-500 hover:underline break-words"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className="px-4 pb-3">
      <p className="text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed break-words">
        {linkifyText(displayText)}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-blue-500 text-xs mt-1 hover:underline"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default PostContent;
