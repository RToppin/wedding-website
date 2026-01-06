function Location() {
  return (
    <section
      id="location"
      className="py-24 px-8 min-h-screen"
      style={{ backgroundColor: "#301413" }}
    >
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-center mb-4 text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Location
        </h2>

        <p
          className="text-center mb-12 text-lg"
          style={{
            color: "#A18B8E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          December 3rd, 2026
        </p>

        <div
          className="rounded-lg p-8 border-2"
          style={{
            backgroundColor: "#2F161D",
            borderColor: "#594836",
          }}
        >
          <h3
            className="mb-3 text-2xl"
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
              lineHeight: "1.8",
            }}
          >
            Kinnitty Castle is a historic 13th-century castle set on 650 acres at the foothills 
            of the Slieve Bloom Mountains. It offers a blend of old-world character and modern comfort, 
            with elegant en-suite rooms, on-site dining, and scenic grounds well suited for weddings and celebrations.
            For our wedding, a block of rooms is available for the night of the wedding only at a special rate of £200 
            per room for guests staying at the castle.
          </p>

          <div className="w-full h-64 rounded overflow-hidden border-2"
               style={{ backgroundColor: "#594836", borderColor: "#594836" }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2395.4252446388396!2d-7.697810700000001!3d53.1025566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x485cffcd7e85903f%3A0x1fd515e8eaf51c5!2sKinnitty%20Castle%20Hotel!5e0!3m2!1sen!2sus!4v1767721446677!5m2!1sen!2sus" 
              width="600" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Location;
