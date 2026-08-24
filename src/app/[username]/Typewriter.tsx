"use client";

import { useEffect, useState } from "react";

const TYPE_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPE = 1400;
const PAUSE_AFTER_DELETE = 300;

export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (phrases.length === 0) return;
    const current = phrases[phraseIndex % phrases.length];

    if (!deleting && text === current) {
      const t = setTimeout(() => setDeleting(true), PAUSE_AFTER_TYPE);
      return () => clearTimeout(t);
    }

    if (deleting && text === "") {
      const t = setTimeout(() => {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      }, PAUSE_AFTER_DELETE);
      return () => clearTimeout(t);
    }

    const t = setTimeout(
      () => {
        setText(
          deleting
            ? current.slice(0, text.length - 1)
            : current.slice(0, text.length + 1)
        );
      },
      deleting ? DELETE_SPEED : TYPE_SPEED
    );
    return () => clearTimeout(t);
  }, [text, deleting, phraseIndex, phrases]);

  if (phrases.length === 0) return null;

  return (
    <span>
      {text}
      <span className="animate-blink ml-0.5">|</span>
    </span>
  );
}
