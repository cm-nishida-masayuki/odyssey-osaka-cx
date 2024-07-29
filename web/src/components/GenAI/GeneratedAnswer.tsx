import { Link } from "@mui/material";
import { useMemo } from "react";

export const GeneratedAnswer: React.FC<{ text: string }> = ({ text }) => {
  const wrappedContent = useMemo(() => {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const parts = text.split(urlPattern);
    const matches = text.match(urlPattern) || [];

    return parts.flatMap((part, index) => {
      if (index === 0) return [part];

      const elements: (string | JSX.Element)[] = [];
      if (matches[index - 1]) {
        elements.push(
          <Link
            key={`link-${index}`}
            href={matches[index - 1]}
            target="_blank"
            rel="noopener noreferrer"
          >
            {matches[index - 1]}
          </Link>
        );
      }
      if (part) elements.push(part);

      return elements;
    });
  }, [text]);
  return (
    <p
      style={{
        whiteSpace: "pre-wrap",
        padding: "8px",
      }}
    >
      {wrappedContent}
    </p>
  );
};
