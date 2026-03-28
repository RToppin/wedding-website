function Travel() {
  const featuredHotel = {
    name: "Kinnitty Castle Hotel",
    type: "Wedding Venue",
    phone: "+353 (0) 57 9137318",
    email: "weddings@kinnittycastlehotel.com",
    website: "https://www.kinnittycastlehotel.com",
    note: "A block of rooms is available at the castle for the night of the wedding.",
  };

  const hotels = [
    {
      name: "Giltraps Kinnitty Village",
      type: "Local Hotel / B&B",
      sleeps: "Sleeps 14",
      phone: "+353 (0) 579137076",
      website: "https://www.visitkinnitty.com",
    },
    {
      name: "Hilltop B&B – Mary Hardiman",
      type: "Local B&B",
      sleeps: "Sleeps 8",
      phone: "+353 (0) 876959960",
    },
    {
      name: "Ardmore Country House – Christina Byrne",
      type: "Country House",
      sleeps: "Sleeps 10",
      phone: "+353 (0) 579137100",
    },
    {
      name: "The County Arms Hotel Birr",
      type: "Hotel in Birr",
      phone: "+353 (0) 57 9120791",
      email: "info@countyarmshotel.com",
      website: "https://www.countyarmshotel.com",
    },
    {
      name: "Dooly’s Hotel Birr",
      type: "Hotel in Birr",
      phone: "+353 (0) 57 9120032",
      email: "info@doolyshotel.com",
      website: "https://www.doolyshotel.com",
    },
    {
      name: "The Stables Birr",
      type: "Accommodation in Birr",
      phone: "+353 (0) 57 9120263",
      email: "caroline@thestablesbirr.com",
      website: "https://www.thestablesbirr.com",
    },
  ];

  return (
    <section
      id="travel"
      className="py-24 px-6 sm:px-8"
      style={{ backgroundColor: "#4D1519" }}
    >
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-center mb-6 text-4xl sm:text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Travel & Accommodations
        </h2>

        <p
          className="text-center mb-14 max-w-3xl mx-auto text-lg"
          style={{
            color: "#A18B8E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          We recommend booking early, especially if you would like to stay on-site or nearby in Kinnitty.
        </p>

        <div
          className="rounded-lg p-8 border-2 mb-10"
          style={{ backgroundColor: "#2F161D", borderColor: "#594836" }}
        >
          <p
            className="uppercase tracking-[0.2em] text-sm mb-2"
            style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif' }}
          >
            Featured Stay
          </p>

          <h3
            className="text-3xl mb-2"
            style={{ color: "#A1937E", fontFamily: '"Playfair Display", serif' }}
          >
            {featuredHotel.name}
          </h3>

          <p
            className="mb-4"
            style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}
          >
            {featuredHotel.type}
          </p>

          <p
            className="mb-6"
            style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif', lineHeight: "1.8" }}
          >
            {featuredHotel.note}
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={featuredHotel.website}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-3 rounded border-2"
              style={{
                borderColor: "#594836",
                backgroundColor: "#4D1519",
                color: "#D6C6B8",
                fontFamily: '"Cormorant", serif',
              }}
            >
              Visit Website
            </a>
            <a
              href={`mailto:${featuredHotel.email}`}
              className="px-5 py-3 rounded border-2"
              style={{
                borderColor: "#594836",
                color: "#D6C6B8",
                fontFamily: '"Cormorant", serif',
              }}
            >
              Email
            </a>
          </div>
        </div>

        <div className="space-y-6">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="rounded-lg p-6 border-2"
              style={{ backgroundColor: "#2F161D", borderColor: "#594836" }}
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h3
                    className="text-2xl mb-1"
                    style={{ color: "#A1937E", fontFamily: '"Playfair Display", serif' }}
                  >
                    {hotel.name}
                  </h3>
                  <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                    {hotel.type}
                  </p>
                  {hotel.sleeps && (
                    <p style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif' }}>
                      {hotel.sleeps}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {hotel.website && (
                    <a
                      href={hotel.website}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded border-2"
                      style={{
                        borderColor: "#594836",
                        backgroundColor: "#4D1519",
                        color: "#D6C6B8",
                        fontFamily: '"Cormorant", serif',
                      }}
                    >
                      Website
                    </a>
                  )}
                  {hotel.phone && (
                    <a
                      href={`tel:${hotel.phone.replace(/\s+/g, "")}`}
                      className="px-4 py-2 rounded border-2"
                      style={{
                        borderColor: "#594836",
                        color: "#D6C6B8",
                        fontFamily: '"Cormorant", serif',
                      }}
                    >
                      Call
                    </a>
                  )}
                </div>
              </div>

              {(hotel.phone || hotel.email) && (
                <div className="mt-4 space-y-1">
                  {hotel.phone && (
                    <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                      {hotel.phone}
                    </p>
                  )}
                  {hotel.email && (
                    <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                      {hotel.email}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Travel;