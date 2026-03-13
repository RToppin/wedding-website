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
  const [guestNames, setGuestNames] = useState([]);
  const [comments, setComments] = useState("");

  const [status, setStatus] = useState({ state: "idle", msg: "" });

  function handleChange(e, setter) {
    setter(e.target.value);
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

      setFirstName(data.firstName || "");
      setLastName(data.lastName || "");
      setMaxGuests(allowedGuests);
      setGuestCount(allowedGuests > 0 ? "1" : "0");
      setGuestNames([]);
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
      setGuestNames([]);
      return;
    }

    const additionalGuestCount = count - 1;

    setGuestNames((prev) => {
      const next = [...prev];

      if (next.length > additionalGuestCount) {
        return next.slice(0, additionalGuestCount);
      }

      while (next.length < additionalGuestCount) {
        next.push("");
      }

      return next;
    });
  }, [guestCount]);

  function handleGuestNameChange(index, value) {
    setGuestNames((prev) =>
      prev.map((name, i) => (i === index ? value : name))
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

      if (parsedGuestCount > 1) {
        const hasBlankGuestName = guestNames.some((name) => !name.trim());

        if (hasBlankGuestName) {
          setStatus({
            state: "error",
            msg: "Please enter the names of all additional guests attending.",
          });
          return;
        }
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
          guestNames: attendance === "yes" ? guestNames : [],
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
    setGuestCount("");
    setGuestNames([]);
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
          Please let us know if you&apos;ll be joining us on our special day
        </p>

        {step === 1 && (
          <form onSubmit={verifyCode} className="space-y-6">
            <div>
              <label
                style={{
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
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
              {status.state === "loading" ? "Verifying..." : "Verify Invitation"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={onSubmit} className="space-y-6">
            <div
              className="rounded border-2 p-4"
              style={{
                backgroundColor: "#301413",
                borderColor: "#594836",
              }}
            >
              <p
                style={{
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
                Verified for <strong>{firstName} {lastName}</strong>
              </p>

              {maxGuests !== null && (
                <p
                  className="mt-2"
                  style={{
                    color: "#A18B8E",
                    fontFamily: '"Cormorant", serif',
                  }}
                >
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
              <label
                style={{
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
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
              <label
                style={{
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
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
                    backgroundColor:
                      attendance === "yes" ? "#4D1519" : "transparent",
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
                    setGuestNames([]);
                  }}
                  className="flex-1 py-3 px-6 rounded border-2 transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor:
                      attendance === "no" ? "#4D1519" : "transparent",
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
                <label
                  style={{
                    color: "#A1937E",
                    fontFamily: '"Cormorant", serif',
                  }}
                >
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
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                    (count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    )
                  )}
                </select>
              </div>
            )}

            {attendance === "yes" && Number(guestCount) > 1 && (
              <div className="space-y-4">
                <p
                  style={{
                    color: "#A1937E",
                    fontFamily: '"Cormorant", serif',
                  }}
                >
                  Additional Guest Names
                </p>

                {guestNames.map((guestName, index) => (
                  <div key={index}>
                    <label
                      style={{
                        color: "#A1937E",
                        fontFamily: '"Cormorant", serif',
                      }}
                    >
                      Guest {index + 2} Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) =>
                        handleGuestNameChange(index, e.target.value)
                      }
                      className="mt-2 w-full border-2 rounded px-4 py-3 outline-none"
                      style={{
                        backgroundColor: "#301413",
                        borderColor: "#594836",
                        color: "#A1937E",
                        fontFamily: '"Cormorant", serif',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            <div>
              <label
                style={{
                  color: "#A1937E",
                  fontFamily: '"Cormorant", serif',
                }}
              >
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