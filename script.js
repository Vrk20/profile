const revealItems = document.querySelectorAll(".reveal");
const countItems = document.querySelectorAll(".count");
const filterButtons = document.querySelectorAll(".filter-button");
const timelineItems = document.querySelectorAll(".timeline-item");
const yearNode = document.querySelector("#year");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.classList.add("is-visible");

      if (entry.target.classList.contains("stats")) {
        animateCounts();
      }
    });
  },
  { threshold: 0.2 }
);

revealItems.forEach((item) => revealObserver.observe(item));

let countsAnimated = false;

function animateCounts() {
  if (countsAnimated) {
    return;
  }

  countsAnimated = true;

  countItems.forEach((item) => {
    const target = Number(item.dataset.target || 0);
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      item.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    timelineItems.forEach((item) => {
      const category = item.dataset.category || "";
      const shouldShow = filter === "all" || category.includes(filter);
      item.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
