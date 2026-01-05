function Travel() {
  const hotels = [
    {
      name: "The Heritage Inn",
      type: "Recommended Hotel",
      details:
        "456 Main Street\nReserve by November 1st\nGroup Code: WEDDING2026",
    },
    {
      name: "Vintage Suites",
      type: "Nearby Accommodation",
      details:
        "789 Oak Avenue\nComplimentary breakfast\nSpecial rates available",
    },
  ];

  return (
    <section
      id="travel"
      className="py-24 px-8 min-h-screen"
      style={{ backgroundColor: "#4D1519" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-center mb-16 text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Travel & Accommodations
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="rounded-lg p-8 border-2"
              style={{
                backgroundColor: "#2F161D",
                borderColor: "#594836",
              }}
            >
              <h3
                className="mb-2 text-2xl"
                style={{
                  color: "#A1937E",
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {hotel.name}
              </h3>

              <p
                className="mb-4 italic"
                style={{
                  color: "#A18B8E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                {hotel.type}
              </p>

              <p
                style={{
                  color: "#A18B8E",
                  fontFamily: '"Cormorant", serif',
                  lineHeight: "1.8",
                  whiteSpace: "pre-line",
                }}
              >
                {hotel.details}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Travel;
