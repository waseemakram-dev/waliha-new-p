"use client";

import { useEffect, useRef, useState } from "react";

/**
 * High-performance Lazy Video component.
 * - Displays the captured first frame (poster) as a crisp image continuously.
 * - Defers video download until user scrolls within 300px of the element.
 * - Keeps the first frame image visible while video buffers and downloads.
 * - Smoothly reveals the video only when playback actually begins.
 * - Pauses when out of viewport to preserve device resources.
 */
export default function LazyVideo({
  src,
  poster,
  ariaLabel,
  className = "",
  loop = true,
  muted = true,
  playsInline = true,
  type = "video/mp4",
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    if (!target) return;

    // Trigger video loading 300px before it enters the viewport
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (videoRef.current) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          // Pause when out of view to save CPU/GPU and data
          if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        }
      },
      {
        rootMargin: "300px 0px 300px 0px",
        threshold: 0.05,
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePlaying = () => {
    setIsPlaying(true);
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#101016",
        overflow: "hidden",
      }}
    >
      {/* 1st Frame Poster: stays visible as an image until video starts playing */}
      {poster && (
        <img
          src={poster}
          alt={ariaLabel || "Video preview frame"}
          aria-hidden="true"
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "opacity 0.4s ease-out",
            opacity: isPlaying ? 0 : 1,
            pointerEvents: "none",
            zIndex: 1,
          }}
        />
      )}

      {/* Video element: only buffers when scrolled near, plays smoothly */}
      <video
        ref={videoRef}
        className={className}
        poster={poster || undefined}
        aria-label={ariaLabel}
        autoPlay={inView}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        preload={inView ? "auto" : "none"}
        onPlaying={handlePlaying}
        onCanPlay={() => {
          if (inView && videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(() => {});
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          position: "relative",
          zIndex: 0,
        }}
      >
        {inView && <source src={src} type={type} />}
      </video>
    </div>
  );
}
