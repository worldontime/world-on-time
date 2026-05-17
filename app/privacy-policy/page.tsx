import type { Metadata } from "next";
import { SimplePage } from "../ui/simple-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the World On Time privacy policy, including information about analytics, advertising, and cookies."
};

export default function PrivacyPolicy() {
  return (
    <SimplePage title="Privacy Policy">
      <p>
        World On Time is built to provide world clocks, time zone conversion, and timer
        tools without requiring account registration.
      </p>
      <p>
        We may use analytics and advertising partners, including Google AdSense, to
        understand site performance and support the service. These services may use
        cookies or similar technologies to measure visits, prevent abuse, and show ads.
      </p>
      <p>
        You can manage cookies through your browser settings. We do not sell personal
        information submitted through this website.
      </p>
      <p>
        For privacy questions, contact the site owner through the contact method listed
        on World On Time.
      </p>
    </SimplePage>
  );
}
