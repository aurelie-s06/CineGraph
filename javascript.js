document.addEventListener("DOMContentLoaded", async () => {
  const carousel = document.querySelector(".carousel");
  const btnLeft = document.querySelector(".carousel-btn.left");
  const btnRight = document.querySelector(".carousel-btn.right");

  // Charger le JSON
  const response = await fetch("data/composers.json");
  const data = await response.json();
  const composers = data.Podium;


  composers.forEach((composer) => {
    const info = composer.Affichage;
    const slide = document.createElement("div");
    slide.classList.add("slide");

    slide.innerHTML = `
  <div class="container-info-compo">
    <img src="${info.Tronche}" alt="${info.Nom}" class="image-compo"/>
    <div class="info-compo">
      <h3 class="nom-compositeur">${info.Prénom} ${info.Nom} <span class="fi fi-${info.Pays_d_origine}"></span></h3>
      <p>${info.Description[0].en}</p>
    </div>
  </div>

  <div class="container-info-music">
    <h4>Musique la plus connue :</h4>
    <div class="info-music">
      <div class="music-text">
        <p>
          <strong>${info.Musique_la_plus_connue.Film[0].en}</strong> (${
      info.Musique_la_plus_connue.Date
    })<br>
          ${info.Musique_la_plus_connue.Réalisateur[0].en}
        </p>
      </div>
      <div class="music-actions">
        <button class="btn-play" data-src="${
          info.Musique_la_plus_connue.Musique
        }">
          <svg class="icon-play" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <svg class="icon-pause hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
            <path d="M6 19h4V5H6zm8-14v14h4V5h-4z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>

  <div class="container-info-film">
    <h4>Nominations (${info.Nombre_de_nominations})</h4>
    <div class="info-film">
      ${info.Nominations.map(
        (nom) => `
          <div class="film-item">
            <img src="${nom.Affiche}" alt="${nom.Film[0].en}" class="affiche_film"/>
            <div class="text-film">
              <h5>${nom.Film[0].en}</h5>
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

  // === Création dynamique des boutons de navigation avec noms ===
  const navContainer = document.createElement("div");
  navContainer.classList.add("carousel-nav");

  btnLeft.innerHTML = `
  <div class="nav-btn">
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28">
      <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6z"/>
    </svg>
    <span class="nav-name left-name"></span>
  </div>
`;

  btnRight.innerHTML = `
  <div class="nav-btn">
    <span class="nav-name right-name"></span>
    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="28" height="28">
      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/>
    </svg>
  </div>
`;


  const wrapper = document.querySelector(".carousel-wrapper");
  navContainer.appendChild(btnLeft);
  navContainer.appendChild(btnRight);
  wrapper.appendChild(navContainer);

  let currentIndex = 0;
  const slides = document.querySelectorAll(".slide");

  function updateNavNames(index) {
    const leftName = document.querySelector(".left-name");
    const rightName = document.querySelector(".right-name");

    const prevIndex = (index - 1 + composers.length) % composers.length;
    const nextIndex = (index + 1) % composers.length;

    leftName.textContent = composers[prevIndex].Affichage.Nom;
    rightName.textContent = composers[nextIndex].Affichage.Nom;
  }

  function showSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    carousel.style.transform = `translateX(-${index * 100}%)`;
    currentIndex = index;
    updateNavNames(currentIndex);
  }

  btnLeft.addEventListener("click", () => showSlide(currentIndex - 1));
  btnRight.addEventListener("click", () => showSlide(currentIndex + 1));

  showSlide(0);

  let currentAudio = new Audio();
  let currentButton = null;

  document.querySelectorAll(".btn-play").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.getAttribute("data-src");
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
        const prevPlay = currentButton.querySelector(".icon-play");
        const prevPause = currentButton.querySelector(".icon-pause");
        prevPlay.classList.remove("hidden");
        prevPause.classList.add("hidden");
      }

      currentAudio.src = src;
      currentAudio.play();

      iconPlay.classList.add("hidden");
      iconPause.classList.remove("hidden");
      currentButton = btn;
    });
  });

  currentAudio.addEventListener("ended", () => {
    if (currentButton) {
      const iconPlay = currentButton.querySelector(".icon-play");
      const iconPause = currentButton.querySelector(".icon-pause");
      iconPlay.classList.remove("hidden");
      iconPause.classList.add("hidden");
    }
  });
});
/*   fetch("data/genres_musiques.json")
    .then((response) => response.json())
    .then((data) => {
      const genreContainer = document.querySelector(".legendes");
      console.log(data);
      const ctx = document.getElementById("myChart");

      // --- Extraire toutes les années présentes dans le JSON ---
      const allYears = new Set();
      data.forEach((genreObj) => {
        Object.keys(genreObj).forEach((key) => {
          if (key !== "Column1") allYears.add(key);
        });
      });
      const years = Array.from(allYears).sort();

      // --- Couleurs pour les genres ---
      const colors = [
        "#1f77b4",
        "#ff7f0e",
        "#2ca02c",
        "#d62728",
        "#9467bd",
        "#8c564b",
        "#e377c2",
      ];

      // --- Créer un dataset par genre ---
      const datasets = data.map((genreObj, index) => {
        const genre = genreObj["Column1"];
        const values = years.map((year) => genreObj[year] || 0);
        const color = colors[index % colors.length];

        return {
          label: genre,
          data: values,
          borderColor: color,
          backgroundColor: color,
          borderWidth: 2,
          fill: false,
          tension: 0.2,
        };
      });

      // --- graphique ---
      const chart = new Chart(ctx, {
        type: "line",
        data: { labels: years, datasets },
        options: {
          plugins: { legend: { display: false } },
          scales: {
            x: { title: { display: true, text: "Année" } },
            y: {
              beginAtZero: true,
              title: { display: true, text: "Nombre de musiques" },
            },
          },
        },
      });
      // --- légende ---
      genreContainer.style.display = "flex";
      genreContainer.style.flexDirection = "column";
      genreContainer.style.gap = "6px";
      genreContainer.style.marginLeft = "20px";

      data.forEach((genreObj, index) => {
        const color = colors[index % colors.length];
        const btn = document.createElement("button");
        btn.textContent = genreObj["Column1"];
        btn.style.background = color;
        btn.style.border = "none";
        btn.style.color = "white";
        btn.style.padding = "5px 10px";
        btn.style.cursor = "pointer";
        btn.style.borderRadius = "6px";
        btn.style.opacity = "1";

        btn.addEventListener("click", () => {
          const isOnlyThisVisible =
            chart.isDatasetVisible(index) &&
            chart.data.datasets.filter((_, i) => chart.isDatasetVisible(i))
              .length === 1;

          if (isOnlyThisVisible) {
            // afficher toutes les courbes à nouveau
            chart.data.datasets.forEach((_, i) => {
              chart.setDatasetVisibility(i, true);
            });
            btn.style.opacity = "1";
          } else {
            // afficher uniquement la courbe sélectionnée
            chart.data.datasets.forEach((_, i) => {
              chart.setDatasetVisibility(i, i === index);
            });
            btn.style.opacity = "0.5";
          }
          chart.update();
        });

        genreContainer.appendChild(btn);
      });
    });*/
