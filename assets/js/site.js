document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".like-button").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("liked");
      button.textContent = button.classList.contains("liked") ? "♥" : "♡";
    });
  });

  document.querySelectorAll(".newsletter-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const button = form.querySelector("button");
      if (button) {
        button.textContent = "登録しました";
        setTimeout(() => { button.textContent = "登録"; }, 1800);
      }
    });
  });

  const search = document.querySelector("#site-search");
  if (search) {
    const cards = [...document.querySelectorAll(".article-card")];
    search.addEventListener("input", () => {
      const q = search.value.trim().toLowerCase();
      cards.forEach((card) => {
        const haystack = `${card.dataset.title} ${card.dataset.tags} ${card.dataset.category}`.toLowerCase();
        card.hidden = q && !haystack.includes(q);
      });
    });
  }
});
