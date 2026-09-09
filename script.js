const root = document.documentElement;
const header = document.querySelector("[data-header]");
const progress = document.querySelector(".scroll-progress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? (window.scrollY / max) * 100 : 0;
  progress?.style.setProperty("--scroll", `${value}%`);
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

window.addEventListener("scroll", updateScroll, { passive: true });
updateScroll();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14, rootMargin: "0px 0px -8%" }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const countUp = (element) => {
  const target = Number(element.dataset.count || 0);
  const start = performance.now();
  const duration = 950;

  const tick = (now) => {
    const elapsed = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - elapsed, 3);
    element.textContent = String(Math.round(target * eased)).padStart(2, "0");
    if (elapsed < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

if (!reduceMotion) {
  const visual = document.querySelector("[data-parallax]");
  const image = visual?.querySelector("img");

  visual?.addEventListener("pointermove", (event) => {
    const bounds = visual.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 12;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 12;
    image?.style.setProperty("--parallax-x", `${x}px`);
    image?.style.setProperty("--parallax-y", `${y}px`);
  });

  visual?.addEventListener("pointerleave", () => {
    image?.style.setProperty("--parallax-x", "0px");
    image?.style.setProperty("--parallax-y", "0px");
  });

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--ry", `${(x - 0.5) * 4}deg`);
      card.style.setProperty("--rx", `${(0.5 - y) * 4}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--ry", "0deg");
      card.style.setProperty("--rx", "0deg");
    });
  });
}
