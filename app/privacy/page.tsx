// app/privacy/page.tsx
import type { Metadata } from "next";

const SITE_URL  = "https://isitinthebible.com";
const SITE_NAME = "Is it in the Bible?";

export const metadata: Metadata = {
  title:       "Privacy Policy",
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your information.`,
  robots:      { index: true, follow: true },
  alternates:  { canonical: `${SITE_URL}/privacy` },
};

const LAST_UPDATED = "February 26, 2026";

export default function PrivacyPage() {
  return (
    <main style={{ background: "#F5F1E8", minHeight: "100vh", padding: "0 0 80px" }}>

      {/* Header */}
      <div style={{ background: "#1A3A6A", padding: "48px 24px 40px", textAlign: "center" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 24 }}>
          <div style={{ width: 36, height: 36, background: "rgba(255,255,255,.15)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📖</div>
          <span style={{ fontFamily: "Georgia, serif", fontSize: 19, fontWeight: 600, color: "white" }}>
            Is it in the <em style={{ fontStyle: "italic", color: "#7BA8E4" }}>Bible?</em>
          </span>
        </a>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, color: "white", letterSpacing: "-1px", margin: 0 }}>
          Privacy Policy
        </h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: 13, marginTop: 10, fontFamily: "monospace" }}>
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 0" }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: "40px 44px", boxShadow: "0 4px 16px rgba(26,22,18,.06)", border: "1px solid #D8D0C4" }}>

          <Section title="1. Overview">
            <P>{SITE_NAME} ("we," "us," or "our") operates the website located at {SITE_URL} (the "Site"). This Privacy Policy explains what information we collect, how we use it, and your choices regarding that information. By using the Site, you agree to the practices described in this policy.</P>
          </Section>

          <Section title="2. Information We Collect">
            <P><strong>Information you provide:</strong> The Site does not require account registration. When you type a search query into our biblical fact-checker, that query is sent to our AI analysis API to generate a response. We do not link queries to personally identifiable information.</P>
            <P><strong>Automatically collected information:</strong> When you visit the Site, our servers and third-party services may automatically collect standard log data including your IP address, browser type, operating system, referring URLs, pages visited, and timestamps. This data is used for security, performance monitoring, and aggregate analytics.</P>
            <P><strong>Cookies and similar technologies:</strong> We and our third-party partners (including Google AdSense) use cookies and similar tracking technologies to operate the Site and serve relevant advertisements. See Section 5 for details.</P>
          </Section>

          <Section title="3. How We Use Your Information">
            <P>We use the information we collect to:</P>
            <Ul items={[
              "Provide, operate, and improve the Site and its AI-powered features",
              "Analyze aggregate usage patterns to understand how people use the Site",
              "Serve advertisements through Google AdSense (see Section 5)",
              "Detect and prevent fraud, abuse, or security issues",
              "Comply with legal obligations",
            ]} />
          </Section>

          <Section title="4. Information Sharing">
            <P>We do not sell, rent, or trade your personal information to third parties. We may share information in the following limited circumstances:</P>
            <Ul items={[
              "With service providers who assist in operating the Site (e.g., hosting, analytics), under confidentiality obligations",
              "With Google and its partners for advertising purposes as described in Section 5",
              "If required by law, court order, or governmental authority",
              "In connection with a merger, acquisition, or sale of assets, with appropriate notice to users",
            ]} />
          </Section>

          <Section title="5. Advertising — Google AdSense">
            <P>This Site uses Google AdSense, an advertising service provided by Google LLC. Google AdSense uses cookies to serve ads based on your prior visits to this Site and other sites on the internet. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our Site and/or other sites on the internet.</P>
            <P>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" style={{ color: "#1A3A6A" }}>Google Ad Settings</a>. You can also opt out of third-party vendor use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" style={{ color: "#1A3A6A" }}>aboutads.info</a>.</P>
            <P>For more information on how Google uses data from sites that use its services, visit <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" style={{ color: "#1A3A6A" }}>Google's Privacy & Terms</a>.</P>
          </Section>

          <Section title="6. Cookies">
            <P>We use the following types of cookies:</P>
            <Ul items={[
              "Essential cookies: Required for the Site to function (e.g., security, session management)",
              "Analytics cookies: Help us understand how visitors interact with the Site (e.g., Google Analytics)",
              "Advertising cookies: Used by Google AdSense to deliver relevant ads",
            ]} />
            <P>You can control cookies through your browser settings. Note that disabling certain cookies may affect Site functionality.</P>
          </Section>

          <Section title="7. Children's Privacy">
            <P>This Site is not directed to children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.</P>
          </Section>

          <Section title="8. Data Retention">
            <P>We retain server log data for up to 90 days for security and debugging purposes. Search queries processed by our AI API are not stored in a personally identifiable way beyond the duration of the request.</P>
          </Section>

          <Section title="9. Your Rights">
            <P>Depending on your location, you may have rights under applicable privacy laws (including GDPR and CCPA) to access, correct, delete, or restrict processing of your personal data, or to opt out of the sale of personal information. To exercise these rights, contact us at the address below. We do not sell personal information.</P>
          </Section>

          <Section title="10. Third-Party Links">
            <P>The Site may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.</P>
          </Section>

          <Section title="11. Changes to This Policy">
            <P>We may update this Privacy Policy from time to time. We will post the revised policy on this page with an updated "Last updated" date. Your continued use of the Site after changes are posted constitutes acceptance of the revised policy.</P>
          </Section>

          <Section title="12. Contact Us" last>
            <P>If you have questions or concerns about this Privacy Policy, please contact us at:</P>
            <div style={{ background: "#F5F1E8", borderRadius: 10, padding: "14px 18px", border: "1px solid #D8D0C4", fontFamily: "monospace", fontSize: 13, color: "#4A3F35", lineHeight: 1.8 }}>
              Is it in the Bible?<br />
              {SITE_URL}<br />
              contact@isitinthebible.com
            </div>
          </Section>

        </div>

        <p style={{ textAlign: "center", marginTop: 32, fontSize: 13, color: "#8A7D72", fontFamily: "monospace" }}>
          <a href="/" style={{ color: "#1A3A6A", textDecoration: "none" }}>← Back to Home</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;
          <a href="/terms" style={{ color: "#1A3A6A", textDecoration: "none" }}>Terms of Use</a>
        </p>
      </div>
    </main>
  );
}

// ─── Small layout helpers ─────────────────────────────────────────────────────
function Section({ title, children, last }: { title: string; children: React.ReactNode; last?: boolean }) {
  return (
    <section style={{ marginBottom: last ? 0 : 32, paddingBottom: last ? 0 : 32, borderBottom: last ? "none" : "1px solid #EDE8DA" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 600, color: "#1A1612", marginBottom: 12, letterSpacing: "-.2px" }}>{title}</h2>
      {children}
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14.5, color: "#4A3F35", lineHeight: 1.8, marginBottom: 10, margin: "0 0 10px" }}>{children}</p>;
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ margin: "8px 0 10px 0", paddingLeft: 20 }}>
      {items.map((item) => (
        <li key={item} style={{ fontSize: 14.5, color: "#4A3F35", lineHeight: 1.75, marginBottom: 4 }}>{item}</li>
      ))}
    </ul>
  );
}