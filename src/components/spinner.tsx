import { useEffect, useState } from "react";

export function Spinner() {
  const [frame, setFrame] = useState(0);
  const frames = ["\\", "|", "/", "-"];

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      aria-hidden="true"
      className="inline-block w-3 text-center text-primary"
    >
      {frames[frame]}
    </span>
  );
}
