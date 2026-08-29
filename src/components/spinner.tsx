import { useEffect, useState } from "react";

const FRAMES = ["\\", "|", "/", "-"];

export function Spinner() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAMES.length);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <span aria-hidden="true" className="inline-block w-3 text-center text-primary">
      {FRAMES[frame]}
    </span>
  );
}
