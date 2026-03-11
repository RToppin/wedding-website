import { useState } from "react";

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What should I wear?",
      answer:
        "The dress code is formal attire. We kindly ask that guests wear elegant evening wear befitting a romantic celebration. You might want to consider having your garments professionally steamed after entering the country.",
    },
    {
      question: "Where should I stay?",
      answer:
        "Please see the Travel section for our recommended hotels. We suggest booking early to secure your preferred accommodations.",
    },
    {
      question: "How will I get to the venue?",
      answer:
        "Our wedding planner suggests booking through Hertz for car rentals. She recommends reaching out directly to Stephane (svallier@hertz.ie) to help make the process smooth and straightforward.",
    },
    {
      question: "How long do I need to be in Ireland? When should I fly in?",
      answer:
        "You are welcome to plan your trip however you like! The only day you need to be in Ireland is Thursday, December 3rd for the ceremony. We will also be having a welcome dinner the night of Tuesday, December 2nd for those who have already arrived in the country.",
    },
    {
      question: "Do I get a plus one?",
      answer:
        "Maybe! This event will be an intimate gathering of our closest family and friends. If you have a plus one, it will be noted on your invitation. If you are unsure, please contact Maddy.",
    },
    {
      question: "Will there be dancing? ",
      answer:
        "A little dancing. Not a lot.",
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
