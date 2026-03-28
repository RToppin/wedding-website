function Timeline() {
  const timelineItems = [
    {
      time: "December 2, 2026",
      event: "Welcome Dinner",
      description: "For guests who have already arrived in Ireland, we’ll be gathering for a relaxed welcome dinner.",
    },
    {
      time: "December 3, 2026 3:00 PM",
      event: "Ceremony",
      description: "Please arrive a little early and join us as we exchange our vows.",
    },
    {
      time: "4:00 PM",
      event: "Cocktail Hour",
      description: "Drinks, hors d’oeuvres, and time to enjoy the castle grounds.",
    },
    {
      time: "6:00 PM",
      event: "Dinner Reception",
      description: "A four-course meal followed by toasts and celebration.",
    },
    {
      time: "Evening",
      event: "Music & Dancing",
      description: "A little dancing. Not a lot.",
    },
  ];

  return (
    <section
      id="timeline"
      className="py-24 px-6 sm:px-8 min-h-screen"
      style={{ backgroundColor: "#170704" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-center mb-16 text-4xl sm:text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Wedding Timeline
        </h2>

        <div className="space-y-10">
          {timelineItems.map((item, index) => (
            <div key={index} className="flex gap-4 sm:gap-8 items-start">
              <div
                className="w-24 sm:w-32 text-right flex-shrink-0 text-sm sm:text-base"
                style={{
                  color: "#A18B8E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                {item.time}
              </div>

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
                      height: "85px",
                      transform: "translateX(-50%)",
                    }}
                  />
                )}
              </div>

              <div className="flex-1">
                <h3
                  className="mb-2 text-xl sm:text-2xl"
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