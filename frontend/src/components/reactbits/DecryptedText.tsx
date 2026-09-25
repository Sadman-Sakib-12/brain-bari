"use client";

import React, { useEffect, useState } from "react";

interface DecryptedTextProps {
  text: string;
  speed?: number;
  maxIterations?: number;
  characters?: string;
  className?: string;
  animateOn?: "hover" | "view";
}

/**
 * DecryptedText component from React Bits (reactbits.dev/text-animations/decrypted-text)
 * High-tech cyber scramble and decode text animation.
 */
export default function DecryptedText({
  text,
  speed = 40,
  maxIterations = 10,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+",
  className = "",
  animateOn = "hover",
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startAnimation = () => {
      interval = setInterval(() => {
        setDisplayText(
          text
            .split("")
            .map((char, index) => {
              if (char === " ") return " ";
              if (index < iteration) {
                return text[index];
              }
              return characters[Math.floor(Math.random() * characters.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / (maxIterations / text.length);
      }, speed);
    };

    if (animateOn === "view" || isHovered) {
      startAnimation();
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [text, speed, maxIterations, characters, animateOn, isHovered]);

  return (
    <span
      className={className}
      onMouseEnter={() => animateOn === "hover" && setIsHovered(true)}
      onMouseLeave={() => animateOn === "hover" && setIsHovered(false)}
    >
      {displayText}
    </span>
  );
}
