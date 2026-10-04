"use client";

import { useEffect } from "react";
import { SiteHeader, SiteFooter } from "./SiteChrome";
import LazyVideo from "./LazyVideo";
import { CLOUDINARY_ASSETS, PORTFOLIO_VIDEOS } from "../lib/cloudinary";

export default function Home() {
  useEffect(() => {
    const heroVideo = document.getElementById("heroVideo");
    const aboutSection = document.getElementById("aboutSection");
    const spiderThread = document.querySelector(".spider-thread-container");
    document.documentElement.classList.add("js-animations");

    const configureVideo = () => {
      if (!heroVideo) return;
      heroVideo.muted = true;
      heroVideo.loop = false;
      heroVideo.playbackRate = 1.7;
      heroVideo.play().catch(() => {});
    };

    const keepVideoSpeed = () => {
      if (heroVideo) heroVideo.playbackRate = 1.7;
    };

    const holdFinalFrame = () => {
      if (!heroVideo) return;
      heroVideo.pause();
      if (Number.isFinite(heroVideo.duration)) heroVideo.currentTime = heroVideo.duration;
    };

    let spiderAnimationFrame = null;
    const updateSpiderPosition = () => {
      if (!spiderThread || !aboutSection) return;
      const sectionTop = aboutSection.getBoundingClientRect().top;
      const animationStart = window.innerHeight * 0.65;
      const animationEnd = window.innerHeight * 0.15;
      const rawProgress = (animationStart - sectionTop) / (animationStart - animationEnd);
      const progress = Math.min(1, Math.max(0, rawProgress));
      const isMobile = window.innerWidth <= 600;
      const startPosition = isMobile ? -85 : -130;
      const endPosition = isMobile ? 45 : 75;
      const translateY = startPosition + (endPosition - startPosition) * progress;
      spiderThread.style.setProperty("--spider-drop-position", `${translateY}px`);
      spiderAnimationFrame = null;
    };

    const requestSpiderUpdate = () => {
      if (spiderAnimationFrame === null) {
        spiderAnimationFrame = window.requestAnimationFrame(updateSpiderPosition);
      }
    };

    const animationGroups = [
      [".about-banner-bar", "reveal-from-top"],
      [".avatar-sticker-wrapper", "reveal-from-left"],
      [".about-info-col", "reveal-from-right"],
      [".details-block", "reveal-from-left"],
      [".about-details-img", "reveal-from-right"],
      [".work-title-backdrop", "reveal-fade"],
      [".work-spider", "reveal-from-top"],
      [".work-title-group", "reveal-from-bottom"],
      [".work-categories", "reveal-from-left"],
      [".work-category-banner", "reveal-wipe"],
      [".video-showcase-intro", "reveal-from-bottom"],
      [".portfolio-video-card", "reveal-from-bottom"],
      [".motion-backdrop", "reveal-fade"],
      [".motion-copy", "reveal-from-left"],
      [".motion-character", "reveal-from-right"],
      [".motion-bottom-bar", "reveal-wipe"],
      [".motion-video-card", "reveal-from-bottom"],
      [".social-creatives-backdrop", "reveal-fade"],
      [".social-creatives-heading", "reveal-from-left"],
      [".social-video-card", "reveal-from-bottom"],
      [".product-design-backdrop", "reveal-fade"],
      [".product-design-heading", "reveal-from-left"],
      [".product-design-artwork", "reveal-from-right"],
      [".product-gallery-card", "reveal-from-bottom"],
    ];

    const animatedElements = [];

    animationGroups.forEach(([selector, animationClass]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        element.classList.add("scroll-reveal", animationClass);
        element.style.setProperty("--reveal-delay", `${(index % 8) * 70}ms`);
        animatedElements.push(element);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    animatedElements.forEach((element) => revealObserver.observe(element));

    heroVideo?.addEventListener("loadedmetadata", configureVideo);
    heroVideo?.addEventListener("play", keepVideoSpeed);
    heroVideo?.addEventListener("ended", holdFinalFrame);
    window.addEventListener("scroll", requestSpiderUpdate, { passive: true });
    window.addEventListener("resize", requestSpiderUpdate);

    configureVideo();
    updateSpiderPosition();

    return () => {
      heroVideo?.removeEventListener("loadedmetadata", configureVideo);
      heroVideo?.removeEventListener("play", keepVideoSpeed);
      heroVideo?.removeEventListener("ended", holdFinalFrame);
      window.removeEventListener("scroll", requestSpiderUpdate);
      window.removeEventListener("resize", requestSpiderUpdate);
      revealObserver.disconnect();
      document.documentElement.classList.remove("js-animations");
      if (spiderAnimationFrame !== null) window.cancelAnimationFrame(spiderAnimationFrame);
    };
  }, []);

  return (
    <>
      <div className="paper-texture"></div>

      <div className="portfolio-container" id="portfolioContainer">
        <SiteHeader />

        {/* HERO SECTION - PRIORITY VIDEO */}
        <section className="hero-section" id="heroSection">
          <div className="hero-video-wrapper">
            <video
              className="hero-video"
              id="heroVideo"
              autoPlay
              muted
              playsInline
              preload="auto"
              poster={CLOUDINARY_ASSETS.heroVideoPoster}
            >
              <source src={CLOUDINARY_ASSETS.heroVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="about-section" id="aboutSection">
          <div className="about-banner-bar">
            <h2 className="about-banner-title">ABOUT ME</h2>
          </div>

          <div className="about-container">
            <div className="about-avatar-col">
              <div className="avatar-sticker-wrapper">
                <img
                  src={CLOUDINARY_ASSETS.walihaAvatar}
                  alt="Creative Creator"
                  className="avatar-sticker-img"
                  id="aboutAvatarImg"
                />
              </div>
            </div>

            <div className="about-info-col">
              <div className="spider-thread-container">
                <div className="hanging-spider">
                  <img
                    src={CLOUDINARY_ASSETS.spider}
                    alt="Hanging Spider"
                    className="spider-img"
                  />
                </div>
              </div>

              <div className="about-header-group">
                <div className="about-greeting-row">
                  <span className="about-greeting">Hi, I’m</span>
                  <span className="about-aka">Based in Pakistan</span>
                </div>
                <h1 className="about-name">Waliha Idrees</h1>
                <p className="about-role">Brand &amp; Visual Graphics Designer</p>
              </div>

              <div className="about-description">
                <p>I design creative, eye-catching graphics and visual brand experiences that help brands stand out.</p>
                <p>I focus on creativity, brand identity, and visual impact — starting with your vision.</p>
                <p>Then I craft stunning, memorable graphic designs through research, concepts, visual aesthetics, and refinement.</p>
              </div>

              <div className="software-tools-row">
                <div className="tool-icon-card" title="Adobe Premiere Pro">
                  <img src={CLOUDINARY_ASSETS.icons.pr} alt="Premiere Pro" className="software-icon" />
                </div>
                <div className="tool-icon-card" title="Adobe After Effects">
                  <img src={CLOUDINARY_ASSETS.icons.ae} alt="After Effects" className="software-icon" />
                </div>
                <div className="tool-icon-card" title="Adobe Photoshop">
                  <img src={CLOUDINARY_ASSETS.icons.ps} alt="Photoshop" className="software-icon" />
                </div>
                <div className="tool-icon-card" title="Adobe Illustrator">
                  <img src={CLOUDINARY_ASSETS.icons.ai} alt="Illustrator" className="software-icon" />
                </div>
                <div className="tool-icon-card" title="DaVinci Resolve">
                  <img src={CLOUDINARY_ASSETS.icons.davinci} alt="DaVinci Resolve" className="software-icon" />
                </div>
                <div className="tool-icon-card" title="Figma">
                  <img src={CLOUDINARY_ASSETS.icons.figma} alt="Figma" className="software-icon" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT DETAILS SECTION */}
        <section className="about-details-section" id="aboutDetailsSection">
          <div className="about-details-container">
            <div className="about-details-content">
              <div className="details-block">
                <h2 className="details-heading">MY EXPERIENCE</h2>
                <p className="details-intro">
                  I build thoughtful brand identities and visual experiences through research, creative concepts, strong aesthetics, and careful refinement.
                </p>
                <p className="details-intro">
                  My experience covers brand design, social media graphics, print design, UI/UX layouts, packaging, and visual communication.
                </p>

                <div className="experience-list">
                  <div className="experience-item">
                    <h3>Senior Graphics Designer</h3>
                    <span>Freelancer | 2024 – 2025</span>
                  </div>
                  <div className="experience-item">
                    <h3>Brand &amp; Visual Designer</h3>
                    <span>Creative Studio | 2022 – 2023</span>
                  </div>
                  <div className="experience-item">
                    <h3>UI/UX &amp; Graphics Designer</h3>
                    <span>Design Agency | 2021 – 2022</span>
                  </div>
                  <div className="experience-item">
                    <h3>Degree in Graphic Design &amp; Arts</h3>
                    <span>University | 2017 – 2021</span>
                  </div>
                </div>
              </div>

              <div className="details-block expertise-block">
                <h2 className="details-heading">CREATIVE EXPERTISE</h2>
                <ul className="expertise-list">
                  <li>Logo &amp; Brand Identity</li>
                  <li>Adobe Photoshop &amp; Illustrator</li>
                  <li>Social Media &amp; Banner Design</li>
                  <li>Poster &amp; Flyer Design</li>
                  <li>Typography &amp; Color Theory</li>
                  <li>UI/UX &amp; Visual Layouts</li>
                </ul>
              </div>
            </div>

            <div className="about-details-visual" aria-hidden="true">
              <img
                src={CLOUDINARY_ASSETS.artworks.aboutDetailsVisual}
                alt=""
                className="about-details-img"
              />
            </div>
          </div>
        </section>

        {/* WORK SECTION */}
        <section className="work-section" id="workSection">
          <div className="work-heading-area">
            <div className="work-title-backdrop" aria-hidden="true">MY WORK</div>

            <img
              src={CLOUDINARY_ASSETS.spider}
              alt=""
              className="work-spider"
              aria-hidden="true"
            />

            <div className="work-title-group">
              <h2 className="work-title">MY WORK</h2>
              <p className="work-subtitle">SELECTED VISUAL WORKS</p>
            </div>

            <ul className="work-categories" aria-label="Work categories">
              <li>VIDEO EDITING</li>
              <li>MOTION DESIGN</li>
              <li>GRAPHIC DESIGNING</li>
            </ul>
          </div>

          <div className="work-category-banner">
            <h3>VIDEO EDITING</h3>
          </div>

          <div className="video-showcase">
            <div className="video-showcase-intro">
              <h4>AI <span>×</span> EDITING <span>×</span> SOUND</h4>
              <p>
                <strong>Note:</strong> AI was integrated into the creative workflow, while the final videos were further developed through professional <b>editing, compositing, motion design</b> and <b>sound design</b> using <b>Adobe Premiere Pro, After Effects</b> and other industry-standard tools.
              </p>
            </div>

            <div className="portfolio-video-grid portfolio-video-grid-top">
              {PORTFOLIO_VIDEOS.editing.slice(0, 3).map((item) => (
                <div key={item.id} className={`portfolio-video-card ${item.className}`}>
                  <LazyVideo
                    src={item.src}
                    poster={item.poster}
                    ariaLabel={item.label}
                  />
                </div>
              ))}
            </div>

            <div className="portfolio-video-grid portfolio-video-grid-bottom">
              {PORTFOLIO_VIDEOS.editing.slice(3, 7).map((item) => (
                <div key={item.id} className={`portfolio-video-card ${item.className}`}>
                  <LazyVideo
                    src={item.src}
                    poster={item.poster}
                    ariaLabel={item.label}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MOTION INTRO SECTION */}
        <section className="motion-intro-section" id="motionDesignSection">
          <div className="motion-backdrop" aria-hidden="true">
            <span>MOTION</span>
            <span>DESIGN</span>
            <span>MOTION</span>
          </div>

          <div className="motion-copy">
            <p className="motion-label">MOTION DESIGN</p>
            <h2>GET READY</h2>
            <p className="motion-kicker">TO SWING INTO</p>
            <span className="motion-script">Motion</span>
          </div>

          <img
            src={CLOUDINARY_ASSETS.artworks.motionCharacter}
            alt="Motion designer character illustration"
            className="motion-character"
          />

          <div className="motion-bottom-bar" aria-hidden="true"></div>
        </section>

        {/* MOTION GALLERY SECTION */}
        <section className="motion-gallery-section" aria-label="Motion design projects">
          <div className="motion-gallery-grid motion-gallery-top">
            {PORTFOLIO_VIDEOS.motion.slice(0, 4).map((item) => (
              <div key={item.id} className={`motion-video-card ${item.cardClass}`}>
                <LazyVideo
                  src={item.src}
                  poster={item.poster}
                  ariaLabel={item.label}
                />
              </div>
            ))}
          </div>

          <div className="motion-gallery-grid motion-gallery-bottom">
            {PORTFOLIO_VIDEOS.motion.slice(4, 6).map((item) => (
              <div key={item.id} className={`motion-video-card ${item.cardClass}`}>
                <LazyVideo
                  src={item.src}
                  poster={item.poster}
                  ariaLabel={item.label}
                />
              </div>
            ))}
          </div>
        </section>

        {/* SOCIAL CREATIVES SECTION */}
        <section className="social-creatives-section" id="socialCreativesSection">
          <div className="social-creatives-backdrop" aria-hidden="true">DESIGNS</div>

          <div className="social-creatives-grid">
            <div className="social-creatives-heading">
              <p>SOCIAL MEDIA</p>
              <h2>CREATIVES</h2>
            </div>

            {PORTFOLIO_VIDEOS.social.map((item) => (
              <div key={item.id} className="social-video-card">
                <LazyVideo
                  src={item.src}
                  poster={item.poster}
                  ariaLabel={item.label}
                />
              </div>
            ))}
          </div>
        </section>

        {/* PRODUCT DESIGN SECTION */}
        <section className="product-design-section" id="productDesignSection">
          <div className="product-design-backdrop" aria-hidden="true">
            <span>PRODUCT</span>
            <span>DESIGN</span>
          </div>

          <div className="product-design-heading">
            <p>PRODUCT PACKAGING</p>
            <h2>DESIGN</h2>
          </div>

          <img
            src={CLOUDINARY_ASSETS.artworks.productDesignArtwork}
            alt="MangoFizz beverage packaging design with illustrated creator"
            className="product-design-artwork"
          />
        </section>

        {/* PRODUCT GALLERY SECTION */}
        <section className="product-gallery-section" aria-label="Product packaging projects">
          <div className="product-gallery-grid">
            {PORTFOLIO_VIDEOS.products.map((item) => (
              <figure key={item.id} className="product-gallery-card">
                <img src={item.src} alt={item.alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>
    </>
  );
}
