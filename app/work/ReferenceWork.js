"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { GrainGradient } from "@paper-design/shaders-react";
import { SiteHeader, SiteFooter } from "../SiteChrome";
import markup from "./reference/markup.json";
import WorkGallery from "./WorkGallery";

const shaderColors = ["#0D2504", "#8EBF24", "#2F590F", "#538C1A"];

function subscribeViewport(callback) {
  window.addEventListener("resize", callback);
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  motion.addEventListener("change", callback);
  return () => { window.removeEventListener("resize", callback); motion.removeEventListener("change", callback); };
}

function HeroShader() {
  const settings = useSyncExternalStore(subscribeViewport,
    () => `${innerWidth < 810 ? "mobile" : innerWidth < 1440 ? "tablet" : "desktop"}:${matchMedia("(prefers-reduced-motion: reduce)").matches}`,
    () => "desktop:true");
  const [size, reduced] = settings.split(":");
  return <GrainGradient colorBack="#FFFFFF" colors={shaderColors} shape="corners"
    softness={0.7} intensity={0.2} noise={0} fit="contain" rotation={7}
    originX={0.6} originY={0.87} scale={size === "desktop" ? 0.35 : 0.21}
    offsetX={size === "mobile" ? 0.3 : size === "tablet" ? 0.32 : 0.25}
    offsetY={0} speed={reduced === "true" ? 0 : 0.5}
    minPixelRatio={1} maxPixelCount={1166400} style={{ width: "100%", height: "100%" }} />;
}

function splitLines(element) {
  const text = element.dataset.originalText || element.textContent;
  element.dataset.originalText = text;
  element.textContent = text;
  const node = element.firstChild;
  const groups = [];
  for (const match of text.matchAll(/\S+/g)) {
    const range = document.createRange();
    range.setStart(node, match.index);
    range.setEnd(node, match.index + match[0].length);
    const top = Math.round(range.getBoundingClientRect().top);
    const last = groups.at(-1);
    if (last?.top === top) last.words.push(match[0]);
    else groups.push({ top, words: [match[0]] });
  }
  const fragment = document.createDocumentFragment();
  groups.forEach(group => {
    const mask = document.createElement("span");
    mask.className = "reference-line-mask";
    const line = document.createElement("span");
    line.className = "reference-line";
    line.textContent = group.words.join(" ");
    mask.append(line);
    fragment.append(mask);
  });
  element.replaceChildren(fragment);
  element.setAttribute("aria-label", text);
}

export default function ReferenceWork() {
  const sourceRef = useRef(null);
  const [shaderTarget, setShaderTarget] = useState(null);
  const attachSource = useCallback(node => {
    sourceRef.current = node;
    setShaderTarget(node?.querySelector("[data-shader-slot]") || null);
  }, []);

  useEffect(() => {
    const scope = sourceRef.current;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let disposed = false;
    let frame = 0;
    const animations = [];
    const textElements = [...scope.querySelectorAll(".text-reveal > h1, .text-reveal > h2, .text-reveal > p")];
    const reveals = [...scope.querySelectorAll("[data-reference-reveal]")];
    const parallax = [...scope.querySelectorAll('[style*="background-image"]')];

    const appearObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      if (element.classList.contains("reference-visible")) {
        appearObserver.unobserve(element);
        return;
      }
      const lines = element.querySelectorAll(".reference-line");
      if (!lines.length) animations.push(element.animate([
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" },
      ], { duration: 1000, easing: "cubic-bezier(.52,.02,.18,1.01)", fill: "both" }));
      lines.forEach((line, index) => {
        animations.push(line.animate([
          { transform: "translateY(80px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ], { duration: 1000, delay: (element.closest("#heroSection") ? 900 : 0) + index * 100, easing: "cubic-bezier(.52,.02,.18,1.01)", fill: "both" }));
      });
      element.classList.add("reference-visible");
      appearObserver.unobserve(element);
    }), { threshold: 0.1 });

    const prepareText = () => {
      if (disposed) return;
      textElements.forEach(element => {
        if (!element.getBoundingClientRect().width) return;
        splitLines(element);
        element.classList.add("reference-text-ready");
        if (!reducedMotion.matches) appearObserver.observe(element);
      });
      reveals.forEach(element => {
        if (!reducedMotion.matches) {
          element.classList.add("reference-appear-ready");
          appearObserver.observe(element);
        } else element.classList.add("reference-visible");
      });
    };
    document.fonts.ready.then(prepareText);

    const updateParallax = () => {
      frame = 0;
      if (reducedMotion.matches) return;
      const viewport = innerHeight;
      parallax.forEach(image => {
        const card = image.closest('a') || image.parentElement;
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewport || !rect.height) return;
        const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - viewport / 2) / ((viewport + rect.height) / 2)));
        image.style.transform = `translate3d(0,${progress * rect.height * 0.08}px,0)`;
      });
      const arrow = scope.querySelector('.framer-17pae5b-container line');
      if (arrow) {
        const progress = Math.min(1, scrollY / Math.max(1, document.documentElement.scrollHeight - innerHeight) * 1.5);
        arrow.setAttribute('y2', String(30 + progress * 150));
      }
    };
    const scheduleParallax = () => { if (!frame) frame = requestAnimationFrame(updateParallax); };
    scheduleParallax();
    const resize = () => { prepareText(); scheduleParallax(); };
    window.addEventListener("scroll", scheduleParallax, { passive: true });
    window.addEventListener("resize", resize);
    reducedMotion.addEventListener("change", resize);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      animations.forEach(animation => animation.cancel());
      appearObserver.disconnect();
      window.removeEventListener("scroll", scheduleParallax);
      window.removeEventListener("resize", resize);
      reducedMotion.removeEventListener("change", resize);
    };
  }, []);

  return <div className="reference-work-page"><SiteHeader /><div className="alta-source" ref={attachSource} dangerouslySetInnerHTML={{ __html: markup }} />{shaderTarget && createPortal(<HeroShader />, shaderTarget)}<WorkGallery /><SiteFooter /></div>;
}
