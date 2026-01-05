function Navbar({ 
  onHeroClick,
  onRsvpClick, 
  onTimelineClick, 
  onLocationClick, 
  onTravelClick, 
  onFAQClick 
}) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-8 py-4"
      style={{ backgroundColor: "#301413" }}
    >
      <div className="max-w-7xl mx-auto flex justify-center gap-8">
        <button
          onClick={onHeroClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Home
        </button>

        <button
          onClick={onRsvpClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          RSVP
        </button>

        <button
          onClick={onTimelineClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Timeline
        </button>

        <button
          onClick={onLocationClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Location
        </button>

        <button
          onClick={onTravelClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Travel
        </button>

        <button
          onClick={onFAQClick}
          className="capitalize transition-opacity hover:opacity-80"
          style={{
            color: "#A1937E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          FAQ
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
