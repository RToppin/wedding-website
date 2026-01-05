function Timeline() {
  const timelineItems = [
    {
      time: "3:00 PM",
      event: "Ceremony",
      description: "Join us as we exchange our vows",
    },
    {
      time: "4:30 PM",
      event: "Cocktail Hour",
      description: "Refreshments and mingling in the garden",
    },
    {
      time: "6:00 PM",
      event: "Reception",
      description: "Dinner, dancing, and celebration",
    },
    {
      time: "10:00 PM",
      event: "Last Dance",
      description: "Send-off under the stars",
    },
  ];

  return (
    <section
      id="timeline"
      className="py-24 px-8 min-h-screen"
      style={{ backgroundColor: "#170704" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-center mb-16 text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Timeline
        </h2>

        <div className="space-y-12">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex gap-8 items-start">
              {/* Time */}
              <div
                className="w-32 text-right flex-shrink-0"
                style={{
                  color: "#A18B8E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                {item.time}
              </div>

              {/* Dot + line */}
              <div className="relative pt-1">
                <div
                  className="absolute left-0 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: "#612727",
                    top: "8px",
                    transform: "translateX(-50%)",
                  }}
                />
                {index < timelineItems.length - 1 && (
                  <div
                    className="absolute left-0 w-px top-6"
                    style={{
                      backgroundColor: "#594836",
                      height: "80px",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3
                  className="mb-2 text-2xl"
                  style={{
                    color: "#A1937E",
                    fontFamily: '"Playfair Display", serif',
                  }}
                >
                  {item.event}
                </h3>
                <p
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                    lineHeight: "1.8",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Timeline;
