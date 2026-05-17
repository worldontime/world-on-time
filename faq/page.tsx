import type { Metadata } from "next";
import { SimplePage } from "../ui/simple-page";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about world clocks, time zone conversion, countdowns, stopwatches, and Pomodoro timers."
};

const faqs = [
  {
    question: "What is World On Time?",
    answer:
      "World On Time is a clean world clock, time zone converter, countdown, stopwatch, and Pomodoro timer built for quick daily use."
  },
  {
    question: "Can I compare time zones for meetings?",
    answer:
      "Yes. Use the Time Zone Converter to choose a starting city, destination city, date, and time."
  },
  {
    question: "Does World On Time work on mobile?",
    answer:
      "Yes. The homepage is designed to work on phones, tablets, and desktop screens."
  },
  {
    question: "Is the site free?",
    answer:
      "Yes. The core tools are free to use and supported by lightweight advertising placements."
  }
];

export default function FAQ() {
  return (
    <SimplePage title="Frequently Asked Questions">
      <div className="faq-list">
        {faqs.map((faq) => (
          <section key={faq.question}>
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </section>
        ))}
      </div>
    </SimplePage>
  );
}
