function Location() {
  return (
    <section
      id="location"
      className="py-24 px-6 sm:px-8"
      style={{ backgroundColor: "#301413" }}
    >
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-center mb-4 text-4xl sm:text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Venue
        </h2>

        <p
          className="text-center mb-12 text-lg"
          style={{
            color: "#A18B8E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Kinnitty Castle Hotel · County Offaly, Ireland
        </p>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div
            className="rounded-lg p-8 border-2"
            style={{
              backgroundColor: "#2F161D",
              borderColor: "#594836",
            }}
          >
            <h3
              className="mb-4 text-2xl"
              style={{
                color: "#A1937E",
                fontFamily: '"Playfair Display", serif',
              }}
            >
              Kinnitty Castle Hotel
            </h3>

            <p
              className="mb-6"
              style={{
                color: "#A18B8E",
                fontFamily: '"Cormorant", serif',
                lineHeight: "1.9",
              }}
            >
              Set at the foothills of the Slieve Bloom Mountains, Kinnitty Castle
              is a historic Irish castle surrounded by woodland and countryside.
              With its stone architecture, elegant interiors, and scenic grounds,
              it is the setting for our ceremony and celebration.
            </p>

            <div className="space-y-3">
              <p style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif' }}>
                <strong>Wedding Date:</strong> December 3, 2026
              </p>
              <p style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif' }}>
                <strong>Address:</strong> Kinnitty, County Offaly, Ireland
              </p>
              <p style={{ color: "#D6C6B8", fontFamily: '"Cormorant", serif' }}>
                <strong>Stay On-Site:</strong> A block of rooms is available at the castle for our guests. Guests using our room block will receive a discounted rate for two nights. Guests can book by calling the hotel directly and stating they are part of the Maddy and Ryan's wedding.
              </p>
            </div>
          </div>

          <div
            className="rounded-lg overflow-hidden border-2 min-h-[320px]"
            style={{
              backgroundColor: "#2F161D",
              borderColor: "#594836",
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2395.4252446388396!2d-7.697810700000001!3d53.1025566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485cffcd7e85903f%3A0x1fd515e8eaf51c5!2sKinnitty%20Castle%20Hotel!5e0!3m2!1sen!2sus!4v1767721446677!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "320px" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kinnitty Castle Hotel Map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;