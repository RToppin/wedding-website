import { useEffect, useState } from "react";

function Countdown() {
  const targetDate = new Date("2026-12-03T14:00:00");

  const getTimeLeft = () => {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="w-full py-12"
      style={{ backgroundColor: "#170704" }}
    >
      <div className="text-center">
        <p
          className="mb-6 text-sm sm:text-base tracking-[0.3em]"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          COUNTDOWN TO THE WEDDING
        </p>

        <div
          className="text-3xl sm:text-5xl md:text-6xl flex flex-wrap justify-center items-center gap-3 sm:gap-6"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          <span>{timeLeft.days}</span>
          <span className="text-lg sm:text-2xl opacity-70">D</span>

          <span className="opacity-50">·</span>

          <span>{timeLeft.hours}</span>
          <span className="text-lg sm:text-2xl opacity-70">H</span>

          <span className="opacity-50">·</span>

          <span>{timeLeft.minutes}</span>
          <span className="text-lg sm:text-2xl opacity-70">M</span>

          <span className="opacity-50">·</span>

          <span>{timeLeft.seconds}</span>
          <span className="text-lg sm:text-2xl opacity-70">S</span>
        </div>
      </div>
    </section>
  );
}

export default Countdown;
