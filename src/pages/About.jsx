"use client";

import { useMemo } from "react";

export default function About() {
  const sections = useMemo(
    () => [
      {
        id: "about-company",
        title: "About Us",
        content: (
         <div className="space-y-4">
  <p>
    <strong>TheSignatureStudio</strong> is a digital product platform operated by 
    <strong> ASTRASOUL DIGITAL LLP</strong>. It focuses on creating 
    personalized and creative digital products designed to provide customers 
    with unique and meaningful experiences.
  </p>

  <p>
    At TheSignatureStudio, we specialize in delivering high-quality customized 
    digital creations that combine creativity, design, and modern technology. 
    Our goal is to provide customers with beautifully crafted digital products 
    that are easy to access and enjoyable to use.
  </p>

  <p>
    As part of ASTRASOUL DIGITAL LLP, we are committed to maintaining 
    high standards of quality, customer satisfaction, and innovation while 
    delivering reliable digital services to customers across India.
  </p>
</div>
        )
      },

      {
        id: "mission",
        title: "Our Mission",
        content: (
          <div className="space-y-4">
            <p>
              Our mission is to provide reliable, innovative, and
              customer-focused digital services while maintaining transparency,
              quality, and trust in everything we deliver.
            </p>

            <p>
              We aim to simplify online services and make digital experiences
              accessible, fast, and valuable for our customers.
            </p>
          </div>
        )
      },

      {
        id: "company-info",
        title: "Company Information",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Company Name:</strong> ASTRASOUL DIGITAL LLP
              </li>

              <li>
                <strong>GST Number:</strong> 09ABRCS9008B1Z3
              </li>

              <li>
                <strong>Registered Address:</strong> C-910 CID Colony,
                Mahanagar, Lucknow, Uttar Pradesh 226006, India
              </li>

              <li>
                <strong>Business Type:</strong> Digital Media & Online Services
              </li>
            </ul>
          </div>
        )
      },

      {
        id: "contact",
        title: "Contact Information",
        content: (
          <div className="space-y-4">
            <ul className="list-disc pl-6 space-y-2">

              <li>
                <strong>Phone:</strong> +91 9198050093
              </li>

              <li>
                <strong>Email:</strong>{" "}
                <a
                  className="underline"
                  href="mailto:orders@thesignaturestudio.in"
                >
                 orders@thesignaturestudio.in
                </a>
              </li>

              <li>
                <strong>Working Hours:</strong> Monday – Saturday,
                10:00 AM – 6:00 PM (IST)
              </li>

              <li>
                <strong>Response Time:</strong> We usually respond within
                24 hours.
              </li>
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
            About Us • ASTRASOUL DIGITAL LLP
          </h1>

          <p className="mt-3 text-slate-600 max-w-2xl">
            Learn more about our company, our mission, and how we provide
            innovative digital services for customers across India.
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
                  <span className="font-semibold text-brand-800">
                    {s.title}
                  </span>
                  <span className="text-brand-500 group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
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
            <div className="mt-12 rounded-2xl bg-gradient-to-r from-brand-50 to-pink-50 p-5 border border-pink-100">
              <p className="text-sm text-white-700">
                <strong>ASTRASOUL DIGITAL LLP</strong> operates in
                compliance with applicable Indian laws and regulations.
              </p>

              <p className="text-sm mt-2">
                GST No: <strong>09ABRCS9008B1Z3</strong>
              </p>

              <p className="text-sm mt-2">
                Address: C-910 CID Colony, Mahanagar, Lucknow, Uttar Pradesh
                226006, India
              </p>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-slate-600 text-sm">
              © {new Date().getFullYear()} ASTRASOUL DIGITAL LLP. All
              Rights Reserved.
            </div>

            <div className="flex items-center gap-3 text-sm">
              {sections.map((s) => (
                <a
                  key={s.id}
                  className="underline hover:text-brand-600"
                  href={`#${s.id}`}
                >
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