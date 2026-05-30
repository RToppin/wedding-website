import { useEffect, useState } from "react";

function RSVP() {
  const [step, setStep] = useState(1);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [plusOneCount, setPlusOneCount] = useState(0);
  const [party, setParty] = useState([]);
  const [plusOnes, setPlusOnes] = useState([]);
  const [comments, setComments] = useState("");

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

  async function verifyName(e) {
    e.preventDefault();

    if (!fullName.trim()) {
      setStatus({ state: "error", msg: "Please enter your full name." });
      return;
    }

    setStatus({ state: "loading", msg: "" });

    try {
      const res = await fetch(
        `/api/sheets?name=${encodeURIComponent(fullName.trim())}`
      );

      if (!res.ok) throw new Error("Verification failed");

      const data = await res.json();

      if (!data.valid) {
        setStatus({
          state: "error",
          msg: "That name could not be found. Please try again.",
        });
        return;
      }

      setPlusOneCount(data.plusOneCount || 0);

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

      // If existing RSVP data, pre-populate
      if (data.existingRSVP) {
        setEmail(data.existingRSVP.email || "");
        setComments(data.existingRSVP.comments || "");
        setParty(data.existingRSVP.party || parsedParty);
        setPlusOnes(data.existingRSVP.plusOnes || []);
      } else {
        setParty(parsedParty);
        setPlusOnes([]);
        setEmail("");
        setComments("");
      }

      setStep(2);
      setStatus({ state: "idle", msg: "" });
    } catch (err) {
      setStatus({
        state: "error",
        msg: "Something went wrong while verifying your name. Please try again.",
      });
    }
  }

  useEffect(() => {
    // Initialize plus ones based on plusOneCount
    setPlusOnes((prev) => {
      const next = [];
      for (let i = 0; i < plusOneCount; i++) {
        next.push(
          prev[i] || {
            name: "",
            attending: null,
          }
        );
      }
      return next;
    });
  }, [plusOneCount]);

  function handlePartyAttendanceChange(index, value) {
    setParty((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, attending: value } : guest
      )
    );
  }

  function handlePlusOneNameChange(index, value) {
    setPlusOnes((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, name: value || "" } : guest
      )
    );
  }

  function handlePlusOneAttendanceChange(index, value) {
    setPlusOnes((prev) =>
      prev.map((guest, i) =>
        i === index ? { ...guest, attending: value } : guest
      )
    );
  }

  async function onSubmit(e) {
    e.preventDefault();

    // Validate email
    if (!email.match(/^\S+@\S+\.\S+$/)) {
      setStatus({ state: "error", msg: "Please enter a valid email." });
      return;
    }

    // Validate all party members have attendance selected
    const hasMissingPartyAttendance = party.some(
      (guest) => guest.attending === null
    );

    if (hasMissingPartyAttendance) {
      setStatus({
        state: "error",
        msg: "Please select yes or no for each party member.",
      });
      return;
    }

    // Validate plus ones if they exist
    if (plusOneCount > 0) {
      const hasBlankPlusOneName = plusOnes.some((guest) => !guest.name.trim());
      if (hasBlankPlusOneName) {
        setStatus({
          state: "error",
          msg: "Please enter the names of all plus ones.",
        });
        return;
      }

      const hasMissingPlusOneAttendance = plusOnes.some(
        (guest) => guest.attending === null
      );
      if (hasMissingPlusOneAttendance) {
        setStatus({
          state: "error",
          msg: "Please select yes or no for each plus one.",
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
          party,
          plusOnes,
          plusOneCount,
          email: email.trim(),
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
    setFullName("");
    setEmail("");
    setPlusOneCount(0);
    setParty([]);
    setPlusOnes([]);
    setComments("");
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
          <form onSubmit={verifyName} className="space-y-6">
            <div>
              <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => handleChange(e, setFullName)}
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
              {status.state === "loading" ? "Searching..." : "Continue to RSVP"}
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
                Party found for <strong>{fullName}</strong>
              </p>

              {plusOneCount > 0 && (
                <p className="mt-2" style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                  You may add up to {plusOneCount}{" "}
                  {plusOneCount === 1 ? "plus one" : "plus ones"}.
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
                Use a different name
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

            <div className="space-y-4">
              <p style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                Party Members
              </p>

              {party.map((guest, index) => (
                <div key={index} className="rounded border-2 p-4" style={{ borderColor: "#594836" }}>
                  <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                    {guest.name}
                  </label>

                  <div className="mt-4">
                    <p style={{ color: "#A18B8E", fontFamily: '"Cormorant", serif' }}>
                      Is this person attending?
                    </p>

                    <div className="flex gap-4 mt-2">
                      <button
                        type="button"
                        onClick={() => handlePartyAttendanceChange(index, true)}
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
                        onClick={() => handlePartyAttendanceChange(index, false)}
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

            {plusOneCount > 0 && (
              <div className="space-y-4">
                <p style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                  Plus Ones
                </p>

                {plusOnes.map((guest, index) => (
                  <div key={index} className="rounded border-2 p-4" style={{ borderColor: "#594836" }}>
                    <label style={{ color: "#A1937E", fontFamily: '"Cormorant", serif' }}>
                      Plus One {index + 1} Full Name
                    </label>

                    <input
                      type="text"
                      required
                      value={guest.name || ""}
                      onChange={(e) => handlePlusOneNameChange(index, e.target.value)}
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
                        Is this person attending?
                      </p>

                      <div className="flex gap-4 mt-2">
                        <button
                          type="button"
                          onClick={() => handlePlusOneAttendanceChange(index, true)}
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
                          onClick={() => handlePlusOneAttendanceChange(index, false)}
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