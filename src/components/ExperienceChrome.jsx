import React, { useEffect, useState } from "react";

export default function ExperienceChrome() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      setProgress(max > 0 ? (root.scrollTop / max) * 100 : 0);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const nodes = [...document.querySelectorAll("[data-reveal]")];
    if (!nodes.length) return;

    const revealInView = () => {
      const limit = window.innerHeight * 0.94;

      nodes.forEach((node) => {
        if (node.classList.contains("is-visible")) return;
        const rect = node.getBoundingClientRect();

        if (rect.top <= limit && rect.bottom >= 0) {
          node.classList.add("is-visible");
        }
      });
    };

    let observer = null;

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: "0px 0px -4% 0px"
        }
      );

      nodes.forEach((node) => observer.observe(node));
    }

    const onViewportChange = () => requestAnimationFrame(revealInView);

    revealInView();
    requestAnimationFrame(revealInView);

    window.addEventListener("scroll", onViewportChange, { passive: true });
    window.addEventListener("resize", onViewportChange);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onViewportChange);
      window.removeEventListener("resize", onViewportChange);
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <div
        className="scroll-progress"
        aria-hidden="true"
        style={{ width: `${progress}%` }}
      />
    </>
  );
}
