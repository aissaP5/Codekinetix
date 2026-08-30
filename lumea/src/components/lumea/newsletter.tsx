"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Magnetic from "./magnetic";
import Reveal from "./reveal";
import { useToast } from "./toast";
import { prefersReducedMotion } from "./smooth-scroll";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const successRef = useRef<HTMLParagraphElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (subscribed && successRef.current) {
      // Lite mode still gets a gentle fade
      gsap.fromTo(
        successRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: prefersReducedMotion() ? 0.5 : 0.9,
          ease: "power2.out",
        }
      );
    }
  }, [subscribed]);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast({
        title: "One more thing —",
        description: "Please enter a valid email address to join The List.",
      });
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast({
      title: "Welcome to The List",
      description: "Your first quiet note from the atelier is on its way.",
    });
  };

  return (
    <section id="list" className="relative overflow-hidden py-28 lg:py-40">
      {/* Soft blush halo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blush/40 blur-[120px]"
      />

      <div className="container-lumea max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">The List</p>
          <h2 className="mt-7 font-display text-[clamp(2.6rem,5.5vw,4.8rem)] font-light leading-[1.04] text-cocoa">
            Begin your <em className="italic text-clay">ritual</em>
          </h2>
          <p className="mx-auto mt-7 max-w-md text-sm leading-7 text-taupe">
            Seasonal rituals, private releases and quiet notes from the atelier.
            Twice a month — never more.
          </p>
        </Reveal>

        {subscribed ? (
          <p
            ref={successRef}
            className="mt-12 font-display text-2xl italic text-clay"
          >
            Welcome to the ritual. Your first note is on its way.
          </p>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto mt-12 flex max-w-md items-center gap-4 border-b border-cocoa/25 pb-3 transition-colors duration-500 focus-within:border-cocoa/60"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              autoComplete="email"
              className="w-full bg-transparent py-2 text-sm text-cocoa outline-none placeholder:text-taupe/60"
            />
            <Magnetic strength={0.45}>
              <button
                type="submit"
                aria-label="Join The List"
                className="grid size-12 place-items-center rounded-full border border-cocoa/30 text-cocoa transition-colors duration-500 hover:bg-cocoa hover:text-cream"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </Magnetic>
          </form>
        )}

        <p className="mt-8 text-[9px] uppercase tracking-[0.25em] text-taupe/70">
          No noise. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
