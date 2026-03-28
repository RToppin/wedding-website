function Navbar({
  onInviteClick,
  onRsvpClick,
  onTimelineClick,
  onLocationClick,
  onTravelClick,
  onFAQClick
}) {
  const navButtonStyle = {
    color: "#A1937E",
    fontFamily: '"Cormorant", serif',
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3"
      style={{ backgroundColor: "#301413" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:gap-x-8">
          <button onClick={onInviteClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            Home
          </button>
          <button onClick={onRsvpClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            RSVP
          </button>
          <button onClick={onTimelineClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            Timeline
          </button>
          <button onClick={onLocationClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            Venue
          </button>
          <button onClick={onTravelClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            Travel
          </button>
          <button onClick={onFAQClick} className="transition-opacity hover:opacity-80 text-sm sm:text-base" style={navButtonStyle}>
            FAQ
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;