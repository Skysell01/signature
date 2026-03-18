"use client";

import { useMemo } from "react";

export default function Contact() {
  const sections = useMemo(
    () => [
     
      {
        id: "support-policy",
        title: "Contact",
        content: (
          <div className="space-y-4">
           
            <ul className="list-disc pl-6 space-y-2">
               <li><strong>Company Name:</strong> ASTRASOUL DIGITAL LLP</li>
               <li><strong>Address :</strong>C-910, CID Colony, Mahanagar Lucknow, Uttar Pradesh 226006</li>
               <li><strong>GST No :</strong>09ABRCS9008B1Z3</li>
               <li><strong>Phone :</strong>9198050093</li>
              <li><strong>Email Support:</strong> <a className="underline" href="mailto:orders@thesignaturestudio.in">orders@thesignaturestudio.in</a></li>
              <li><strong>Working Hours:</strong> Monday–Saturday, 10:00 AM – 6:00 PM (IST)</li>
              <li><strong>Response Time:</strong> We respond to all inquiries within 24 hours. Urgent issues are prioritised..</li>
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
            <div className="mt-12 rounded-2xl bg-black from-brand-50 to-pink-50 p-5 border border-pink-100">
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
