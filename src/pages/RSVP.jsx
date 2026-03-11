import { useState } from "react";

function RSVP() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [attendance, setAttendance] = useState(""); // "yes" | "no"
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function handleChange(e, setter) {
    setter(e.target.value);
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setStatus({ state: "error", msg: "Please enter a valid first and last name." });
      return;
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setStatus({ state: "error", msg: "Please enter a valid email." });
      return;
    }

    if (attendance !== "yes" && attendance !== "no") {
      setStatus({ state: "error", msg: "Please select whether you are attending." });
      return;
    }

    setStatus({ state: "loading", msg: "" });

    try {
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          attendance,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus({ state: "success", msg: "RSVP submitted successfully!" });
    } catch {
      setStatus({ state: "error", msg: "Something went wrong. Please try again." });
    }
  }

  return (
    <section id="rsvp" className="py-24 px-8" style={{ backgroundColor: "#2F161D" }}>
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-center mb-4 text-5xl md:text-6xl"
          style={{ color: "#A1937E", fontFamily: '"Playfair Display", serif' }}
        >
          RSVP
        </h2>

        <p
          className="text-center mb-12 text-lg"
          style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}
        >
          Please let us know if you&apos;ll be joining us on our special day
        </p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
              First Name
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => handleChange(e, setFirstName)}
              className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
              style={{
                backgroundColor: "#301413",
                borderColor: "#594836",
                color: "#A1937E",
                fontFamily: '"Cormorant", serif',
              }}
            />
          </div>

          <div>
            <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
              Last Name
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => handleChange(e, setLastName)}
              className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
              style={{
                backgroundColor: "#301413",
                borderColor: "#594836",
                color: "#A1937E",
                fontFamily: '"Cormorant", serif',
              }}
            />
          </div>

          <div>
            <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => handleChange(e, setEmail)}
              className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
              style={{
                backgroundColor: "#301413",
                borderColor: "#594836",
                color: "#A1937E",
                fontFamily: '"Cormorant", serif',
              }}
            />
          </div>

          <div>
            <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
              Invitation Code
            </label>
            <input
              type="text"
              required
              value={invitationCode}
              onChange={(e) => handleChange(e, setInvitationCode)}
              className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
              style={{
                backgroundColor: "#301413",
                borderColor: "#594836",
                color: "#A1937E",
                fontFamily: '"Cormorant", serif',
              }}
            />
          </div>

          <div>
            <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
              Will you be attending?
            </label>

            <div className="flex gap-4 mt-3">
              <button
                type="button"
                onClick={() => setAttendance("yes")}
                className="flex-1 py-3 px-6 rounded border-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: attendance === "yes" ? "#4D1519" : "transparent",
                  borderColor: "#594836",
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                Joyfully Accept
              </button>

              <button
                type="button"
                onClick={() => setAttendance("no")}
                className="flex-1 py-3 px-6 rounded border-2 transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: attendance === "no" ? "#4D1519" : "transparent",
                  borderColor: "#594836",
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                Regretfully Decline
              </button>
            </div>
          </div>

          {status.msg ? (
            <p
              className="text-center"
              style={{
                color: status.state === "error" ? "#ef4444" : "#A18B8E",
                fontFamily: '"Cormorant", serif',
              }}
            >
              {status.msg}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status.state === "loading"}
            className="w-full py-4 rounded transition-opacity hover:opacity-90 disabled:opacity-60"
            style={{
              backgroundColor: "#612727",
              color: "#A1937E",
              fontFamily: '"Cormorant", serif',
              border: "none",
            }}
          >
            {status.state === "loading" ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default RSVP;
