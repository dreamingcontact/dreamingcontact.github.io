/* Dreaming the Sound of Contact — page interactions */
(function () {
  "use strict";

  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mqTouch  = window.matchMedia('(pointer: coarse)');

  const videos = Array.from(document.querySelectorAll('video'));

  // --- scroll-reveal (fade-in on first entry) ------------
  if (!mqReduce.matches && 'IntersectionObserver' in window) {
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    const ro = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => ro.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // --- in-viewport autoplay ------------------------------
  if (!mqReduce.matches && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting, intersectionRatio }) => {
        if (isIntersecting && intersectionRatio >= 0.5) {
          target.play().catch(() => { /* autoplay blocked; leave poster */ });
        } else {
          target.pause();
        }
      });
    }, { threshold: [0, 0.5, 1] });
    videos.forEach(v => io.observe(v));
  }

  // --- hover autoplay (desktop pointers only) ------------
  if (!mqReduce.matches && !mqTouch.matches) {
    videos.forEach(v => {
      v.addEventListener('mouseenter', () => { v.play().catch(() => {}); });
      v.addEventListener('mouseleave', () => { v.pause(); });
    });
  }

  // --- copy bibtex ---------------------------------------
  const copyBtn = document.getElementById('copy-bib');
  const bib     = document.getElementById('bib');
  if (copyBtn && bib) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(bib.textContent.trim());
        const prev = copyBtn.textContent;
        copyBtn.textContent = 'Copied ✓';
        copyBtn.disabled = true;
        setTimeout(() => { copyBtn.textContent = prev; copyBtn.disabled = false; }, 1500);
      } catch (e) {
        copyBtn.textContent = 'Copy failed';
      }
    });
  }
})();
