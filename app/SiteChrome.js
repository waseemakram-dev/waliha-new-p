"use client";

import { useEffect, useRef, useState } from "react";
import "./site-chrome.css";

const email = "walihaidrees0987@gmail.com";
const links = [
  ["Home", "heroSection"],
  ["Work", "workSection"],
  ["About", "aboutSection"],
  ["Motion", "motionDesignSection"],
  ["Contact", "contactSection"],
];

function Navigation({ onNavigate }) {
  return links.map(([label, id]) => (
    <a key={id} href={`#${id}`} onClick={onNavigate}>
      <span className="chrome-link-label">{label}</span>
      <span className="chrome-link-hover" aria-hidden="true">{label}</span>
    </a>
  ));
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const header = useRef(null);
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event) => {
      if (!header.current?.contains(event.target)) setOpen(false);
    };
    const handleKeys = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", handleKeys);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open]);

  return (
    <header className={`chrome-header ${open ? "is-open" : ""}`} ref={header}>
      <div className="chrome-header-row">
        <a className="chrome-brand" href="#heroSection" onClick={() => setOpen(false)}>Waliha<sup>®</sup></a>
        <button ref={trigger} className="chrome-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="chrome-menu" onClick={() => setOpen(!open)}>
          <span /><span /><span /><span />
        </button>
      </div>
      <div className="chrome-menu" id="chrome-menu" inert={!open} aria-hidden={!open}>
        <nav aria-label="Main navigation"><Navigation onNavigate={() => setOpen(false)} /></nav>
        <div className="chrome-menu-info">
          <div><p>Based in</p><span>Pakistan</span><span>Brand &amp; visual design</span></div>
          <div><p>Contacts</p><a href="tel:+923176497197">+92 317 6497197</a><a href={`mailto:${email}`}>{email}</a></div>
        </div>
        <a className="chrome-menu-cta" href="#contactSection" onClick={() => setOpen(false)}>Get in touch <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const wordmark = useRef(null);
  const word = useRef(null);

  useEffect(() => {
    let active = true;
    const fit = () => {
      if (!active || !wordmark.current || !word.current) return;
      word.current.style.fontSize = "100px";
      const width = word.current.getBoundingClientRect().width;
      const available = wordmark.current.clientWidth;
      word.current.style.fontSize = `${100 * (available - 2) / width}px`;
    };
    const observer = new ResizeObserver(fit);
    observer.observe(wordmark.current);
    document.fonts.ready.then(fit);
    return () => { active = false; observer.disconnect(); };
  }, []);

  const prepareEmail = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Portfolio enquiry from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\nName: ${data.get("name")}\nReply to: ${data.get("email")}`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <footer className="chrome-footer" id="contactSection">
      <div className="chrome-footer-inner">
        <div className="chrome-contact-top">
          <section className="chrome-contact-details" aria-labelledby="connect-title">
            <h2 id="connect-title">Stay Connected</h2>
            <div className="chrome-email-block"><p>Start a conversation</p><a href={`mailto:${email}`}>{email}</a></div>
            <div className="chrome-footer-columns">
              <div className="chrome-location"><p>Pakistan <span className="chrome-spider-mark" aria-hidden="true">✳</span></p><span>Waliha Idrees<br />Brand &amp; Visual Graphics Designer</span><a href="tel:+923176497197">+92 317 6497197</a></div>
              <nav className="chrome-footer-nav" aria-label="Footer navigation"><p>Navigation</p><Navigation /></nav>
              <div className="chrome-footer-contact"><p>Contact</p><a href={`mailto:${email}`}>Email</a><a href="https://wa.me/923176497197" target="_blank" rel="noreferrer">WhatsApp</a></div>
            </div>
          </section>
          <form className="chrome-form" onSubmit={prepareEmail}>
            <p className="chrome-form-brand">Waliha<sup>®</sup></p>
            <h3>Let me know about<br />your project</h3>
            <label>Name<input type="text" name="name" placeholder="Your name" autoComplete="name" required /></label>
            <label>Email<input type="email" name="email" placeholder="Email address" autoComplete="email" required /></label>
            <label>Message<textarea name="message" placeholder="Start typing here" rows={3} required /></label>
            <button type="submit">Submit <span aria-hidden="true">→</span></button>
            <p className="chrome-form-note">Opens your email app with a prepared message.</p>
          </form>
        </div>
        <div ref={wordmark} className="chrome-wordmark" aria-label="Waliha"><span ref={word}>Waliha<sup>®</sup></span></div>
        <div className="chrome-footer-bottom"><a href="#heroSection">Back to top <span aria-hidden="true">↗</span></a><p>© 2026 Waliha Idrees. All rights reserved.</p></div>
      </div>
    </footer>
  );
}
