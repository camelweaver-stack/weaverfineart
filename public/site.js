(function () {
  const form = document.querySelector("#work-filters");
  const list = document.querySelector("#work-list");
  const countEl = document.querySelector("#work-count");
  const empty = document.querySelector("#filter-empty");

  if (form && list && countEl && empty) {
    const cards = [...list.querySelectorAll("[data-artist]")];

    const apply = () => {
      const data = new FormData(form);
      const artist = String(data.get("artist") ?? "");
      const region = String(data.get("region") ?? "");
      const medium = String(data.get("medium") ?? "");
      const price = String(data.get("price") ?? "");
      const size = String(data.get("size") ?? "");
      const status = String(data.get("status") ?? "");
      let shown = 0;

      for (const card of cards) {
        const ok =
          (!artist || card.dataset.artist === artist) &&
          (!region || card.dataset.region === region) &&
          (!medium || card.dataset.medium === medium) &&
          (!price || card.dataset.priceBand === price) &&
          (!size || card.dataset.size === size) &&
          (!status || card.dataset.status === status);
        card.hidden = !ok;
        if (ok) shown += 1;
      }

      countEl.textContent = shown === 1 ? "1 work" : `${shown} works`;
      empty.hidden = shown !== 0;
    };

    form.addEventListener("input", apply);
    form.addEventListener("change", apply);
    form.addEventListener("reset", () => {
      requestAnimationFrame(apply);
    });
  }

  const params = new URLSearchParams(window.location.search);
  const artist = params.get("artist");
  const artistField = document.querySelector("#want-artist");
  if (artist && artistField instanceof HTMLInputElement && artistField.value.trim() === "") {
    artistField.value = artist;
  }

  const about = params.get("about");
  const message = document.querySelector("#contact-message");
  if (about && message instanceof HTMLTextAreaElement && message.value.trim() === "") {
    message.value = `Regarding ${about}.\n\n`;
  }
})();
