"use client";

import { useMemo } from "react";

export default function PolicyPage() {
  const sections = useMemo(
    () => [
      {
        id: "delivery-policy",
        title: "Shipping and Delivery Policy",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Processing Time:</strong> All orders are processed after payment confirmation.</li>
              <li>
                <strong>Delivery Method:</strong> Your custom digital product will be delivered to the email address
                provided at checkout.
              </li>
              <li><strong>Delivery Time:</strong> Orders are typically delivered within 24–48 hours.</li>
              <li>
                <strong>Non-Delivery:</strong> If you do not receive your product within 48 hours, please contact us
                immediately at <a className="underline" href="mailto:orders@thesignaturestudio.in">orders@thesignaturestudio.in</a> with your order number so we can resolve the issue promptly.
              </li>
            </ul>
          </div>
        )
      },
      {
        id: "refund-policy",
        title: "Refund Policy",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>All Sales Final:</strong> As this is a custom-made digital product, all sales are final once the product has been delivered.</li>
              <li>
                <strong>Refund Exceptions:</strong> Refunds will only be issued if:
                <ul className="list-[circle] pl-6 mt-2 space-y-1">
                  <li>We fail to deliver your order within 48 hours of purchase.</li>
                  <li>There is a proven technical issue or defect in the delivered file.</li>
                </ul>
              </li>
              <li><strong>Refund Timeline:</strong> Approved refunds will be processed within 5–7 business days via your original payment method.</li>
            </ul>
          </div>
        )
      },
      {
        id: "revision-policy",
        title: "Revision Policy",
        content: (
          <div className="space-y-4">
            <p>Extra changes will be charged at ₹500 per revision.</p>
          </div>
        )
      },
      {
        id: "cancellation-policy",
        title: "Cancellation Policy",
        content: (
          <div className="space-y-4">
            <p>Cancellations are not possible once we have started creating your custom product.</p>
          </div>
        )
      },
      {
        id: "privacy-policy",
        title: "Privacy Policy",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Collection:</strong> We only collect the personal details necessary to create and deliver your order.</li>
              <li><strong>Confidentiality:</strong> All personal information (names, dates, details) provided for your product remains strictly confidential.</li>
              <li><strong>Security:</strong> Your data is stored securely and will never be sold or shared with any third party.</li>
            </ul>
          </div>
        )
      },
      {
        id: "Data-retention-policy",
        title: "Data Retention Policy",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Data Collection:</strong> The abandoned data (such as email address or interaction data) may be retained and used for marketing and retargeting purposes, including showing relevant advertisements or sending follow-up communications related to the service or product the user showed interest in.</li>
              <li><strong>Security:</strong> We retain such data only for a limited period necessary for retargeting and marketing optimization. After this period, the data is either deleted or anonymized.</li>
            </ul>
          </div>
        )
      },
      {
        id: "terms",
        title: "Terms & Conditions",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>For Personal Use Only:</strong> This product is for personal use and may not be resold, redistributed, or used commercially.</li>
              <li><strong>Delivery Commitment:</strong> While we aim to deliver all orders within 24–48 hours, delays may occur due to high demand or unforeseen circumstances.</li>
              <li><strong>File Format:</strong> Products are delivered in [JPEG/PNG/PDF] format unless otherwise specified at the time of order.</li>
            </ul>
          </div>
        )
      },
      {
        id: "support-policy",
        title: "Support Policy",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Email Support:</strong> <a className="underline" href="mailto:orders@thesignaturestudio.in">orders@thesignaturestudio.in</a></li>
              <li><strong>Working Hours:</strong> Monday–Saturday, 10:00 AM – 6:00 PM (IST)</li>
              <li><strong>Response Time:</strong> We respond to all inquiries within 24 hours. Urgent issues are prioritised.</li>
            </ul>
          </div>
        )
      }
    ],
    []
  );

  return (
    <main className="relative">
      {/* Header Section */}
      <section className="relative px-6 sm:px-10">
        <div className="mx-auto max-w-5xl pt-16 sm:pt-24 pb-10 sm:pb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Updated • {new Date().toLocaleDateString()}
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-tight text-brand-900">
            The Signature Studio • Policies & Terms
          </h1>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Please review our policies regarding delivery, refunds, revisions, cancellations, privacy, and support.
          </p>

          {/* Quick Nav */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="group rounded-2xl border border-pink-100 bg-black/70 backdrop-blur p-4 hover:shadow-soft transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-brand-800">{s.title}</span>
                  <span className="text-brand-500 group-hover:translate-x-0.5 transition-transform">→</span>
                </div>
                <p className="mt-1 text-sm text-slate-600">
                  Jump to {s.title.toLowerCase()}.
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="px-6 sm:px-10">
        <div className="mx-auto max-w-5xl pb-20">
          <div className="rounded-3xl border border-pink-100 bg-black/80 backdrop-blur shadow-soft p-6 sm:p-10">
            <article className="prose-legal space-y-12">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-28">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {s.title}
                  </div>
                  <h2>{s.title}</h2>
                  {s.content}
                </section>
              ))}
            </article>

            {/* Footer note */}
            <div className="mt-12 rounded-2xl bg-black-to-r from-brand-50 to-pink-50 p-5 border border-pink-100">
              <p className="text-sm text-white-700">
                <strong>Note:</strong> By using our website, you agree to these policies.  
                If you have questions,{" "}
                <a className="underline" href="mailto:orders@thesignaturestudio.in">contact us</a>.
              </p>
                <p>Sakshi Srivastava”</p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-600 text-sm">
              © {new Date().getFullYear()} The Signature Studio. All Rights Reserved.
            </div>
            <div className="flex items-center gap-3 text-sm">
              {sections.map((s) => (
                <a key={s.id} className="underline hover:text-brand-600" href={`#${s.id}`}>
                  {s.title}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
