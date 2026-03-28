import invite_BG from "../assets/invite_BG.svg";

function Invite({ className }) {
  return (
    <section
  className={`${className} relative min-h-screen w-full flex items-center justify-center text-center px-6 pt-28 pb-16 overflow-hidden`}
  style={{
    backgroundColor: "#050302",
    backgroundImage: `url(${invite_BG})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "auto 100%",   // keep full height
    backgroundPosition: "53% center", // shift image left/right
  }}
>
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0, 0)" }}
      />
    </section>
  );
}

export default Invite;