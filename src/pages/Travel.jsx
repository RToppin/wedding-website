function Travel() {
const hotels = [
  {
    name: "Kinnitty Castle Hotel",
    type: "Castle Hotel / Wedding Venue",
    phone: "+353 (0) 57 9137318",
    email: "weddings@kinnittycastlehotel.com",
    website: "https://www.kinnittycastlehotel.com",
  },
  {
    name: "Giltraps Kinnitty Village",
    type: "Local Hotel / B&B",
    sleeps: "Sleeps: 14",
    phone: "+353 (0) 579137076",
    website: "https://www.visitkinnitty.com",
  },
  {
    name: "Hilltop B&B – Mary Hardiman",
    type: "Local B&B",
    sleeps: "Sleeps: 8",
    phone: "+353 (0) 876959960",
  },
  {
    name: "Ardmore Country House – Christina Byrne",
    type: "Country House",
    sleeps: "Sleeps: 10",
    phone: "+353 (0) 579137100",
  },
  {
    name: "The County Arms Hotel Birr",
    type: "Hotel",
    phone: "+353 (0) 57 9120791",
    email: "info@countyarmshotel.com",
    website: "https://www.countyarmshotel.com",
  },
  {
    name: "Dooly’s Hotel Birr",
    type: "Hotel",
    phone: "+353 (0) 57 9120032",
    email: "info@doolyshotel.com",
    website: "https://www.doolyshotel.com",
  },
  {
    name: "The Stables Birr",
    type: "Accommodation",
    phone: "+353 (0) 57 9120263",
    email: "caroline@thestablesbirr.com",
    website: "https://www.thestablesbirr.com",
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
              {/* Hotel Name */}
              <h3
                className="mb-2 text-2xl"
                style={{
                  color: "#A1937E",
                  fontFamily: '"Playfair Display", serif',
                }}
              >
                {hotel.name}
              </h3>

              {/* Type */}
              {hotel.type && (
                <p
                  className="mb-4 italic"
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                  }}
                >
                  {hotel.type}
                </p>
              )}

              {/* Bedrooms / Sleeps */}
              {hotel.sleeps && (
                <p
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                    lineHeight: "1.8",
                  }}
                >
                  {hotel.sleeps}
                </p>
              )}

              {/* Phone */}
              {hotel.phone && (
                <p
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                    lineHeight: "1.8",
                  }}
                >
                  Phone:{" "}
                  <a
                    href={`tel:${hotel.phone.replace(/\s+/g, "")}`}
                    style={{ color: "#D6C6B8", textDecoration: "underline" }}
                  >
                    {hotel.phone}
                  </a>
                </p>
              )}

              {/* Email */}
              {hotel.email && (
                <p
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                    lineHeight: "1.8",
                  }}
                >
                  Email:{" "}
                  <a
                    href={`mailto:${hotel.email}`}
                    style={{ color: "#D6C6B8", textDecoration: "underline" }}
                  >
                    {hotel.email}
                  </a>
                </p>
              )}

              {/* Website */}
              {hotel.website && (
                <p
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                    lineHeight: "1.8",
                  }}
                >
                  Website:{" "}
                  <a
                    href={hotel.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#D6C6B8", textDecoration: "underline" }}
                  >
                    {hotel.website.replace(/^https?:\/\//, "")}
                  </a>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Travel;
