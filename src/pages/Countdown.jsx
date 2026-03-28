import { useEffect, useState } from "react";

function Countdown() {
  const targetDate = new Date("2026-12-03T00:00:00");

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
      className="w-full py-12 px-6"
      style={{ backgroundColor: "#170704" }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border px-4 py-6"
              style={{
                borderColor: "#594836",
                backgroundColor: "#170704",
              }}
            >
              <div
                className="text-3xl sm:text-4xl"
                style={{
                  color: "#F1E7DB",
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {item.value}
              </div>

              <div
                className="mt-2 text-xs sm:text-sm uppercase tracking-widest"
                style={{
                  color: "#D6C6B8",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Countdown;