import type { Metadata } from "next";
import { SimplePage } from "../ui/simple-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read the terms for using World On Time time tools and website content."
};

export default function TermsOfService() {
  return (
    <SimplePage title="Terms of Service">
      <p>
        World On Time provides time-related tools for general informational and
        productivity purposes. While we aim for accuracy, time zone rules may change and
        should be verified for critical travel, legal, medical, or financial decisions.
      </p>
      <p>
        You may use the website for personal and business planning, but you may not
        misuse the service, interfere with its operation, or copy the site as a competing
        service.
      </p>
      <p>
        The site may include third-party services such as analytics, advertising, or
        embedded tools. Those services are governed by their own terms.
      </p>
    </SimplePage>
  );
}
