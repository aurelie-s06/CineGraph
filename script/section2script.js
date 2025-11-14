let currentLang = "en";
let composers = [];
let currentIndex = 0;
let currentAudio = new Audio();
let currentButton = null;

document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.querySelector(".carousel");
  const btnLeft = document.querySelector(".carousel-btn.left");
  const btnRight = document.querySelector(".carousel-btn.right");
  const wrapper = document.querySelector(".carousel-wrapper");

  fetch("data/composers.json")
    .then((res) => res.json())
    .then((data) => {
      composers = data.Podium;
      createCarousel();
      updateLanguage(currentLang);
    });

  function createCarousel() {
    carousel.innerHTML = "";

    composers.forEach((composer) => {
      const info = composer.Affichage;
      const slide = document.createElement("div");
      slide.classList.add("slide");

      slide.innerHTML = `
        <div class="container-info-compo">
          <img src="${info.Tronche}" alt="${info.Nom}" class="image-compo"/>
          <div class="info-compo">
            <h3 class="nom-compositeur">${info.Prénom} ${
        info.Nom
      } <span class="fi fi-${info.Pays_d_origine}"></span></h3>
            <p class="description-compo"></p>
          </div>
        </div>

        <div class="container-info-music">
          <h4 class="titre4-slider-music"></h4>
          <div class="info-music">
            <div class="music-text">
              <p></p>
            </div>
            <div class="music-actions">
              <button class="btn-play" data-src="${
                info.Musique_la_plus_connue.Musique
              }">
                <svg class="icon-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32"><path d="M8 5v14l11-7z"/></svg>
                <svg class="icon-pause hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32"><path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="container-info-film">
          <h4 class="titre4-slider-film"></h4>
          <div class="info-film">
            ${info.Nominations.map(
              (nom) => `
              <div class="film-item">
                <img src="${nom.Affiche}" alt="" class="affiche_film"/>
                <div class="text-film">
                  <h5></h5>
                  <p>${nom.Oscar}</p>
                  <a href="${nom.Lien}" class="icone_lien"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                </div>
              </div>
            `
            ).join("")}
          </div>
        </div>
      `;

      carousel.appendChild(slide);
    });

    setupNavigation();
    setupAudio();
  }

  function updateLanguage(lang) {
    currentLang = lang;

    fetch("data/contenuLangue.json")
      .then((res) => res.json())
      .then((contenuLangue) => {
        const textes = contenuLangue[lang][0];

        const slides = document.querySelectorAll(".slide");
        slides.forEach((slide, idx) => {
          const info = composers[idx].Affichage;

          // description
          const descEl = slide.querySelector(".description-compo");
          descEl.textContent = info.Description[0][lang];

          // titre h4 musique
          const h4Music = slide.querySelector(".titre4-slider-music");
          h4Music.textContent = textes["titre4-slider-music"];

          // musique
          const musicP = slide.querySelector(".music-text p");
          musicP.innerHTML = `<strong>${info.Musique_la_plus_connue.Film[0][lang]}</strong> (${info.Musique_la_plus_connue.Date})<br>${info.Musique_la_plus_connue.Réalisateur[0][lang]}`;

          // titre h4 film
          const h4Film = slide.querySelector(".titre4-slider-film");
          h4Film.textContent = `${textes["titre4-slider-film"]} ${info.Prénom} ${info.Nom}`;

          // films
          const filmItems = slide.querySelectorAll(".film-item");
          info.Nominations.forEach((nom, nidx) => {
            const item = filmItems[nidx];
            item.querySelector("img").alt = nom.Film[0][lang];
            item.querySelector("h5").textContent = nom.Film[0][lang];
          });
        });
      });
  }

  // Navigation, audio et podium
  function setupNavigation() {
    const slides = document.querySelectorAll(".slide");

    if (!wrapper.querySelector(".carousel-nav")) {
      const navContainer = document.createElement("div");
      navContainer.classList.add("carousel-nav");
      btnLeft.innerHTML = `<div class="nav-btn"><svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/></svg><span class="nav-name left-name"></span></div>`;
      btnRight.innerHTML = `<div class="nav-btn"><span class="nav-name right-name"></span><svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg></div>`;
      navContainer.appendChild(btnLeft);
      navContainer.appendChild(btnRight);
      wrapper.appendChild(navContainer);
    }

    function updateNavNames(index) {
      const prevIndex = (index - 1 + composers.length) % composers.length;
      const nextIndex = (index + 1) % composers.length;
      document.querySelector(".left-name").textContent =
        composers[prevIndex].Affichage.Nom;
      document.querySelector(".right-name").textContent =
        composers[nextIndex].Affichage.Nom;
    }

    function showSlide(index) {
      const slides = document.querySelectorAll(".slide");
      if (!slides.length) return;
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      carousel.style.transform = `translateX(-${index * 100}%)`;
      currentIndex = index;
      updateNavNames(currentIndex);
    }

    btnLeft.onclick = () => showSlide(currentIndex - 1);
    btnRight.onclick = () => showSlide(currentIndex + 1);
    showSlide(currentIndex);
  }

  function setupAudio() {
    document.querySelectorAll(".btn-play").forEach((btn) => {
      btn.onclick = () => {
        const src = btn.dataset.src;
        const iconPlay = btn.querySelector(".icon-play");
        const iconPause = btn.querySelector(".icon-pause");
        if (currentButton === btn) {
          if (currentAudio.paused) {
            currentAudio.play();
            iconPlay.classList.add("hidden");
            iconPause.classList.remove("hidden");
          } else {
            currentAudio.pause();
            iconPlay.classList.remove("hidden");
            iconPause.classList.add("hidden");
          }
          return;
        }
        if (currentButton) {
          currentButton.querySelector(".icon-play").classList.remove("hidden");
          currentButton.querySelector(".icon-pause").classList.add("hidden");
        }
        currentAudio.src = src;
        currentAudio.play();
        iconPlay.classList.add("hidden");
        iconPause.classList.remove("hidden");
        currentButton = btn;
      };
    });
    currentAudio.onended = () => {
      if (currentButton) {
        currentButton.querySelector(".icon-play").classList.remove("hidden");
        currentButton.querySelector(".icon-pause").classList.add("hidden");
      }
    };
  }

  document.querySelectorAll("button[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.dataset.lang;
      updateLanguage(lang);
    });
  });
});
