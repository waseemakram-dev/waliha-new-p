/* =========================================================
   KZ GRAPHIX / WALIHA PORTFOLIO - SCRIPT
   - Smooth Video Playback & Handling
   - Smooth Scroll & Page Navigation
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const heroVideo = document.getElementById('heroVideo');
  const navPage1 = document.getElementById('navPage1');
  const navPage2 = document.getElementById('navPage2');
  const aboutBtn = document.getElementById('aboutBtn');
  const aboutSection = document.getElementById('aboutSection');
  const workSection = document.getElementById('workSection');
  const spiderThread = document.querySelector('.spider-thread-container');

  // Configure video playback rules: 1.7x speed, play once, freeze on final frame
  if (heroVideo) {
    heroVideo.muted = true;
    heroVideo.loop = false;

    const configureSpeedAndPlay = () => {
      heroVideo.playbackRate = 1.7; // 1.7x faster playback
      const playPromise = heroVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay waiting for user gesture:", error);
        });
      }
    };

    // Apply speed as soon as metadata or play event fires
    heroVideo.addEventListener('loadedmetadata', configureSpeedAndPlay);
    heroVideo.addEventListener('play', () => {
      heroVideo.playbackRate = 1.7;
    });

    configureSpeedAndPlay();

    // When video finishes, stay on the last frame (do not restart)
    heroVideo.addEventListener('ended', () => {
      heroVideo.pause();
      // Ensure it holds the final finished frame
      heroVideo.currentTime = heroVideo.duration;
      console.log("Hero video finished: staying frozen on final frame.");
    });
  }



  // Navigation Tab Switcher (Page 1 vs Page 2)
  if (navPage1 && navPage2) {
    navPage1.addEventListener('click', () => {
      navPage1.classList.add('active');
      navPage2.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    navPage2.addEventListener('click', () => {
      navPage2.classList.add('active');
      navPage1.classList.remove('active');
      if (workSection) {
        workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // Move the spider down and back up according to the user's scroll position.
  if (spiderThread && aboutSection) {
    let spiderAnimationFrame = null;

    const updateSpiderPosition = () => {
      const sectionTop = aboutSection.getBoundingClientRect().top;
      // Keep the spider at its banner position until About Me is active.
      const animationStart = window.innerHeight * 0.65;
      const animationEnd = window.innerHeight * 0.15;
      const rawProgress = (animationStart - sectionTop) / (animationStart - animationEnd);
      const progress = Math.min(1, Math.max(0, rawProgress));
      const isMobile = window.innerWidth <= 600;
      const startPosition = isMobile ? -85 : -130;
      const endPosition = isMobile ? 45 : 75;
      const translateY = startPosition + ((endPosition - startPosition) * progress);

      spiderThread.style.setProperty('--spider-drop-position', `${translateY}px`);
      spiderAnimationFrame = null;
    };

    const requestSpiderUpdate = () => {
      if (spiderAnimationFrame === null) {
        spiderAnimationFrame = window.requestAnimationFrame(updateSpiderPosition);
      }
    };

    window.addEventListener('scroll', requestSpiderUpdate, { passive: true });
    window.addEventListener('resize', requestSpiderUpdate);
    updateSpiderPosition();
  }

  console.log("Portfolio Hero Video loaded cleanly without any text cutoff!");
});
