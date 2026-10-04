"use client";

import { useEffect } from "react";
import { SiteHeader, SiteFooter } from "./SiteChrome";

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
      },
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

          <section className="hero-section" id="heroSection">


            <div className="hero-video-wrapper">
              <video
                className="hero-video"
                id="heroVideo"
                autoPlay
                muted
                playsInline>
                <source src="/assets/hero_video.mp4?v=2" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

          </section>


          <section className="about-section" id="aboutSection">


            <div className="about-banner-bar">
              <h2 className="about-banner-title">ABOUT ME</h2>
            </div>


            <div className="about-container">


              <div className="about-avatar-col">
                <div className="avatar-sticker-wrapper">
                  <img src="/assets/waliha.png" alt="Creative Creator" className="avatar-sticker-img" id="aboutAvatarImg" />
                </div>
              </div>


              <div className="about-info-col">


                <div className="spider-thread-container">
                  <div className="hanging-spider">
                    <img src="/assets/spider.png" alt="Hanging Spider" className="spider-img" />
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
                    <img src="/assets/icon_pr.png" alt="Premiere Pro" className="software-icon" />
                  </div>
                  <div className="tool-icon-card" title="Adobe After Effects">
                    <img src="/assets/icon_ae.png" alt="After Effects" className="software-icon" />
                  </div>
                  <div className="tool-icon-card" title="Adobe Photoshop">
                    <img src="/assets/icon_ps.png" alt="Photoshop" className="software-icon" />
                  </div>
                  <div className="tool-icon-card" title="Adobe Illustrator">
                    <img src="/assets/icon_ai.png" alt="Illustrator" className="software-icon" />
                  </div>
                  <div className="tool-icon-card" title="DaVinci Resolve">
                    <img src="/assets/icon_davinci.png" alt="DaVinci Resolve" className="software-icon" />
                  </div>
                  <div className="tool-icon-card" title="Figma">
                    <img src="/assets/icon_figma.png" alt="Figma" className="software-icon" />
                  </div>
                </div>

              </div>

            </div>

          </section>


          <section className="about-details-section" id="aboutDetailsSection">
            <div className="about-details-container">

              <div className="about-details-content">
                <div className="details-block">
                  <h2 className="details-heading">MY EXPERIENCE</h2>
                  <p className="details-intro">I build thoughtful brand identities and visual experiences through research, creative concepts, strong aesthetics, and careful refinement.</p>
                  <p className="details-intro">My experience covers brand design, social media graphics, print design, UI/UX layouts, packaging, and visual communication.</p>

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
                <img src="/assets/ChatGPT Image Sep 27, 2026, 05_18_39 PM.png" alt="" className="about-details-img" />
              </div>

            </div>
          </section>


          <section className="work-section" id="workSection">
            <div className="work-heading-area">
              <div className="work-title-backdrop" aria-hidden="true">MY WORK</div>

              <img src="/assets/spider.png" alt="" className="work-spider" aria-hidden="true" />

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
                <p><strong>Note:</strong> AI was integrated into the creative workflow, while the final videos were further developed through professional <b>editing, compositing, motion design</b> and <b>sound design</b> using <b>Adobe Premiere Pro, After Effects</b> and other industry-standard tools.</p>
              </div>

              <div className="portfolio-video-grid portfolio-video-grid-top">
                <div className="portfolio-video-card portrait-video">
                  <video autoPlay muted loop playsInline preload="metadata" aria-label="AI video editing project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/be37f760057a8cdb326b9f835b8cde1d.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="portfolio-video-card portrait-video">
                  <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/8e10053d06712b22dab05e90cf91b441.jpg" aria-label="AI cinematic video project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/1c68480ead5277bb24c9de047469959f.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="portfolio-video-card landscape-video">
                  <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/7cfbce4b288ab8089d6d6905aeec3334.jpg" aria-label="Motion design video project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/b95b51fda8852ade95786d8ffc566258.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <div className="portfolio-video-grid portfolio-video-grid-bottom">
                <div className="portfolio-video-card landscape-video">
                  <video autoPlay muted loop playsInline preload="metadata" aria-label="Cinematic editing project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/917d618be713436689e4343859987f70.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="portfolio-video-card portrait-video">
                  <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/b78cfcab544b8ef7df9ae2caafce80f2.jpg" aria-label="Social media video project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/2c3e9cdd40164010d56e1513a122bf94.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="portfolio-video-card portrait-video">
                  <video autoPlay muted loop playsInline preload="metadata" aria-label="Promotional video project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/65134291c048b24901c67c00fdffffa6.mp4" type="video/mp4" />
                  </video>
                </div>

                <div className="portfolio-video-card portrait-video">
                  <video autoPlay muted loop playsInline preload="metadata" aria-label="Creative editing project">
                    <source src="https://kzgraphix.my.canva.site/_assets/video/db2263a3170e6595581b48975bb61c64.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>
          </section>


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

            <img src="/assets/ChatGPT Image Sep 27, 2026, 05_51_13 PM.png" alt="Motion designer character illustration" className="motion-character" />

            <div className="motion-bottom-bar" aria-hidden="true"></div>
          </section>


          <section className="motion-gallery-section" aria-label="Motion design projects">
            <div className="motion-gallery-grid motion-gallery-top">
              <div className="motion-video-card motion-video-portrait">
                <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/51224c5362582c9d134bc5a3137711ca.jpg" aria-label="Motion design project one">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/cf0d57644417714d25bf4e9fc2d43a02.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="motion-video-card motion-video-portrait">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Motion design project two">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/e5aa850706ed2f6ad5aa67514b51056e.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="motion-video-card motion-video-poster">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Motion design project three">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/6c7b8e0de4fae7359353a8661e3997d8.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="motion-video-card motion-video-wide">
                <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/8d77f184fad57f8a508a417f3bd996b8.jpg" aria-label="Motion design project four">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/4ffbfabb1c4e7314112b114c3d6b35e8.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div className="motion-gallery-grid motion-gallery-bottom">
              <div className="motion-video-card motion-video-wide">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Motion design project five">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/7f523dc25fd6853985a56bb8af3d4cdb.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="motion-video-card motion-video-wide">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Motion design project six">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/df5f5c6ed7d4eb8b8cef0fcc85911195.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </section>


          <section className="social-creatives-section" id="socialCreativesSection">
            <div className="social-creatives-backdrop" aria-hidden="true">DESIGNS</div>

            <div className="social-creatives-grid">
              <div className="social-creatives-heading">
                <p>SOCIAL MEDIA</p>
                <h2>CREATIVES</h2>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/6bebd587d26efa790863146a83ec7c7a.jpg" aria-label="Social media creative one">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/928c3dac3809fee29bbf78cb2affe548.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Social media creative two">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/95f34f6368c6ebd64ed42d2e4e9e4851.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Social media creative three">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/eb3f3cd21cd923ef03e621da675838c9.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Social media creative four">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/951f03bf982336ec2db638bc305bbe6e.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Social media creative five">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/fc2f9dd4e04d6e937c320b1a50bde991.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/467a82610d597cc376fe63728e724c03.jpg" aria-label="Social media creative six">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/d9ba2923f2f833087b589d0733e23174.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" poster="https://kzgraphix.my.canva.site/_assets/video/521255f35060ff1eee9014a7a2aceb45.jpg" aria-label="Social media creative seven">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/82fe78e8c67fca694aaf1c49fbd35cad.mp4" type="video/mp4" />
                </video>
              </div>

              <div className="social-video-card">
                <video autoPlay muted loop playsInline preload="metadata" aria-label="Social media creative eight">
                  <source src="https://kzgraphix.my.canva.site/_assets/video/6bda1eb70a6c6eefdcf23a6af9fdf072.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </section>


          <section className="product-design-section" id="productDesignSection">
            <div className="product-design-backdrop" aria-hidden="true">
              <span>PRODUCT</span>
              <span>DESIGN</span>
            </div>

            <div className="product-design-heading">
              <p>PRODUCT PACKAGING</p>
              <h2>DESIGN</h2>
            </div>

            <img src="/assets/ChatGPT Image Sep 27, 2026, 06_04_19 PM.png" alt="MangoFizz beverage packaging design with illustrated creator" className="product-design-artwork" />
          </section>


          <section className="product-gallery-section" aria-label="Product packaging projects">
            <div className="product-gallery-grid">
              <figure className="product-gallery-card">
              <img src="https://kzgraphix.my.canva.site/_assets/media/754f18096f0fc2fe6da12d7394b61f6e.png" alt="Product packaging design project one" />
              </figure>

              <figure className="product-gallery-card">
              <img src="https://kzgraphix.my.canva.site/_assets/media/49ff9a622ff9a6538a0ebf8a4d4d10e8.png" alt="Product packaging design project two" />
              </figure>

              <figure className="product-gallery-card">
              <img src="https://kzgraphix.my.canva.site/_assets/media/6c98678c071e0f172e6706ab3098038f.png" alt="Product packaging design project three" />
              </figure>
            </div>
          </section>

          <SiteFooter />

        </div>
    </>
  );
}
