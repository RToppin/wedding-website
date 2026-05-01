import { useEffect, useState } from "react";

function RSVP() {
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [invitationCode, setInvitationCode] = useState("");
  const [attendance, setAttendance] = useState("");
  const [maxGuests, setMaxGuests] = useState(null);
  const [guestCount, setGuestCount] = useState("");
  const [guests, setGuests] = useState([]);
  const [primaryAttending, setPrimaryAttending] = useState(null);
  const [comments, setComments] = useState("");
  const [party, setParty] = useState([]);

  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function handleChange(e, setter) {
    setter(e.target.value);
  }

  function normalizeGuest(guest) {
    if (typeof guest === "string") {
      return {
        name: guest || "",
        attending: null,
      };
    }

    return {
      name: guest?.name || "",
      attending: guest?.attending ?? null,
    };
  }

  async function verifyCode(e) {
    e.preventDefault();

    if (!invitationCode.trim()) {
      setStatus({ state: "error", msg: "Please enter your invitation code." });
      return;
    }

    setStatus({ state: "loading", msg: "" });

    try {
      const res = await fetch(
        `/api/sheets?code=${encodeURIComponent(invitationCode.trim())}`
      );

      if (!res.ok) throw new Error("Verification failed");

      const data = await res.json();

      if (!data.valid) {
        setStatus({
          state: "error",
          msg: "That invitation code could not be found. Please try again.",
        });
        return;
      }

      const allowedGuests = Number(data.maxGuests ?? 0);

      let parsedParty = [];

      if (Array.isArray(data.party)) {
        parsedParty = data.party.map(normalizeGuest);
      } else if (typeof data.party === "string" && data.party.trim()) {
        try {
          parsedParty = JSON.parse(data.party).map(normalizeGuest);
        } catch {
          parsedParty = [];
        }
      }

      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setMaxGuests(allowedGuests);

      const totalPrefilledGuests = 1 + parsedParty.length;
      setGuestCount(String(totalPrefilledGuests));

      setParty(parsedParty);
      setGuests(parsedParty);
      setPrimaryAttending(null);
      setComments("");
      setStep(2);
      setStatus({ state: "idle", msg: "" });
    } catch (err) {
      setStatus({
        state: "error",
        msg: "Something went wrong while verifying your code. Please try again.",
      });
    }
  }

  useEffect(() => {
    const count = Number(guestCount);

    if (!count || count <= 1) {
      setGuests([]);
      return;
    }

    const additionalGuestCount = count - 1;

    setGuests((prev) => {
      const next = [];

      for (let i = 0; i < additionalGuestCount; i++) {
        next.push(
          prev[i] ||
            party[i] || {
              name: "",
              attending: null,
            }
        );
      }

      return next;
    });
  }, [guestCount, party]);

  function handleGuestNameChange(index, value) {
    setGuests((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, name: value || "" } : guest
      )
    );
  }

  function handleGuestAttendanceChange(index, value) {
    setGuests((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, attending: value } : guest
      )
    );
  }

  async function onSubmit(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      setStatus({
        state: "error",
        msg: "Missing guest information. Please verify your code again.",
      });
      return;
    }

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setStatus({ state: "error", msg: "Please enter a valid email." });
      return;
    }

    if (attendance !== "yes" && attendance !== "no") {
      setStatus({
        state: "error",
        msg: "Please select whether you are attending.",
      });
      return;
    }

    if (attendance === "yes") {
      const parsedGuestCount = Number(guestCount);

      if (primaryAttending === null) {
        setStatus({
          state: "error",
          msg: "Please select yes or no for the primary guest.",
        });
        return;
      }

      if (
        Number.isNaN(parsedGuestCount) ||
        parsedGuestCount < 1 ||
        parsedGuestCount > Number(maxGuests)
      ) {
        setStatus({
          state: "error",
          msg: "Please select a valid number of guests attending.",
        });
        return;
      }

      const hasBlankGuestName = guests.some((guest) => !guest.name.trim());

      if (hasBlankGuestName) {
        setStatus({
          state: "error",
          msg: "Please enter the names of all additional guests attending.",
        });
        return;
      }

      const hasMissingGuestAttendance = guests.some(
        (guest) => guest.attending === null
      );

      if (hasMissingGuestAttendance) {
        setStatus({
          state: "error",
          msg: "Please select yes or no for each guest.",
        });
        return;
      }
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
          invitationCode,
          guestCount: attendance === "yes" ? Number(guestCount) : 0,
          primaryAttending,
          guests: attendance === "yes" ? guests : [],
          comments: comments.trim(),
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      setStatus({
        state: "success",
        msg: "RSVP submitted successfully!",
      });
    } catch {
      setStatus({
        state: "error",
        msg: "Something went wrong. Please try again.",
      });
    }
  }

  function resetVerification() {
    setStep(1);
    setFirstName("");
    setLastName("");
    setEmail("");
    setAttendance("");
    setMaxGuests(null);
    setPrimaryAttending(null);
    setGuestCount("");
    setGuests([]);
    setComments("");
    setParty([]);
    setStatus({ state: "idle", msg: "" });
  }

  return (
    <section
      id="rsvp"
      className="py-24 px-8"
      style={{ backgroundColor: "#2F161D" }}
    >
      <div className="max-w-2xl mx-auto">
        <h2
          className="text-center mb-4 text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          RSVP
        </h2>

        <p
          className="text-center mb-12 text-lg"
          style={{
            color: "#A18B8E",
            fontFamily: '"Cormorant", serif',
          }}
        >
          Please let us know if you will be joining us on our special day by August 1st, 2026. We can't wait to celebrate with you!
        </p>

        {step === 1 && (
          <form onSubmit={verifyCode} className="space-y-6">
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
              {status.state === "loading" ? "Verifying..." : "Continue to RSVP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={onSubmit} className="space-y-6">
            <div
              className="rounded border-2 p-4"
              style={{ backgroundColor: "#301413", borderColor: "#594836" }}
            >
              <p style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                Verified for <strong>{firstName} {lastName}</strong>
              </p>

              {maxGuests !== null && (
                <p className="mt-2" style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                  Invitation allows up to {maxGuests}{" "}
                  {maxGuests === 1 ? "guest" : "guests"}.
                </p>
              )}

              <button
                type="button"
                onClick={resetVerification}
                className="mt-3 underline"
                style={{
                  color: "#A18B8E",
                  fontFamily: '"Cormorant", serif',
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                Use a different invitation code
              </button>
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
                Will you be attending?
              </label>

              <div className="flex gap-4 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setAttendance("yes");
                    if (!guestCount && maxGuests > 0) setGuestCount("1");
                  }}
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
                  onClick={() => {
                    setAttendance("no");
                    setGuestCount("0");
                    setGuests([]);
                  }}
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

            {attendance === "yes" && maxGuests > 0 && (
              <div>
                <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                  Number Attending
                </label>
                <select
                  required
                  value={guestCount}
                  onChange={(e) => setGuestCount(e.target.value)}
                  className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
                  style={{
                    backgroundColor: "#301413",
                    borderColor: "#594836",
                    color: "#A1937E",
                    fontFamily: '"Cormorant", serif',
                  }}
                >
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {attendance === "yes" && (
              <div className="space-y-4">
                <p style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                  Primary Guest
                </p>

                <div className="rounded border-2 p-4" style={{ borderColor: "#594836" }}>
                  <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                    {firstName} {lastName}
                  </label>

                  <div className="mt-4">
                    <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                      Are you attending?
                    </p>

                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => setPrimaryAttending(true)}
                        className="flex-1 py-2 px-4 rounded border-2"
                        style={{
                          backgroundColor: primaryAttending === true ? "#4D1519" : "transparent",
                          borderColor: "#594836",
                          color: "#A1937E",
                          fontFamily: '"Cormorant", serif',
                        }}
                      >
                        Yes
                      </button>

                      <button
                        type="button"
                        onClick={() => setPrimaryAttending(false)}
                        className="flex-1 py-2 px-4 rounded border-2"
                        style={{
                          backgroundColor: primaryAttending === false ? "#4D1519" : "transparent",
                          borderColor: "#594836",
                          color: "#A1937E",
                          fontFamily: '"Cormorant", serif',
                        }}
                      >
                        No
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {attendance === "yes" && Number(guestCount) > 1 && (
              <div className="space-y-4">
                <p style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                  Additional Guest Names
                </p>

                {guests.map((guest, index) => (
                  <div key={index} className="rounded border-2 p-4" style={{ borderColor: "#594836" }}>
                    <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                      Guest {index + 2} Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={guest.name || ""}
                      onChange={(e) => handleGuestNameChange(index, e.target.value)}
                      className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
                      style={{
                        backgroundColor: "#301413",
                        borderColor: "#594836",
                        color: "#A1937E",
                        fontFamily: '"Cormorant", serif',
                      }}
                    />

                    <div className="mt-4">
                      <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                        Is this guest attending?
                      </p>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handleGuestAttendanceChange(index, true)}
                          className="flex-1 py-2 px-4 rounded border-2"
                          style={{
                            backgroundColor: guest.attending === true ? "#4D1519" : "transparent",
                            borderColor: "#594836",
                            color: "#A1937E",
                            fontFamily: '"Cormorant", serif',
                          }}
                        >
                          Yes
                        </button>

                        <button
                          type="button"
                          onClick={() => handleGuestAttendanceChange(index, false)}
                          className="flex-1 py-2 px-4 rounded border-2"
                          style={{
                            backgroundColor: guest.attending === false ? "#4D1519" : "transparent",
                            borderColor: "#594836",
                            color: "#A1937E",
                            fontFamily: '"Cormorant", serif',
                          }}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div>
              <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                Comments or Special Notes
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={5}
                placeholder="Dietary restrictions, allergies, accessibility needs, or anything else you'd like us to know"
                className="mt-2 w-full border-2 rounded px-4 py-3 outline-none resize-y"
                style={{
                  backgroundColor: "#301413",
                  borderColor: "#594836",
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              />
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
        )}
      </div>
    </section>
  );
}

export default RSVP;