import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What should I wear?",
      answer:
        "The dress code is formal attire. We kindly ask that guests wear elegant evening wear befitting a romantic celebration.",
    },
    {
      question: "Can I bring a guest?",
      answer:
        "Due to venue capacity, we are only able to accommodate guests specifically named on your invitation. Thank you for understanding.",
    },
    {
      question: "Will there be parking available?",
      answer:
        "Yes, complimentary valet parking will be provided at the venue. Additional parking is available in the adjacent lot.",
    },
    {
      question: "Are children welcome?",
      answer:
        "While we love your little ones, we have planned an adults-only celebration. We hope this gives you an opportunity to enjoy an evening out.",
    },
    {
      question: "What time should I arrive?",
      answer:
        "Please arrive by 2:45 PM to be seated before the ceremony begins at 3:00 PM sharp.",
    },
  ];

  function toggle(i) {
    setOpenIndex((curr) => (curr === i ? null : i));
  }

  return (
    <section
      id="faq"
      className="py-24 px-8 min-h-screen"
      style={{ backgroundColor: "#170704" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-center mb-16 text-5xl md:text-6xl"
          style={{
            color: "#A1937E",
            fontFamily: '"Playfair Display", serif',
          }}
        >
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;

            return (
              <div
                key={i}
                className="border-2 rounded-lg px-6"
                style={{
                  borderColor: "#594836",
                  backgroundColor: "#301413",
                }}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full py-4 flex items-center justify-between text-left"
                  style={{
                    color: "#A1937E",
                    fontFamily: '"Playfair Display", serif',
                  }}
                  aria-expanded={isOpen}
                >
                  <span className="text-xl md:text-2xl">{faq.question}</span>
                  <span
                    className="ml-6 text-2xl leading-none"
                    style={{ color: "#A1937E" }}
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div
                    className="pb-5"
                    style={{
                      color: "#A18B8E",
                      fontFamily: '"Cormorant", serif',
                      lineHeight: "1.8",
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
