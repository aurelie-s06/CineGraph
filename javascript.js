document.addEventListener("DOMContentLoaded", function () {
  const btnScroll = document.querySelector(".scroll-down");
  if (btnScroll) {
    btnScroll.addEventListener("click", function () {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth",
      });
    });
  }

  fetch("data/composers.json")
    .then((response) => response.json())
    .then((data) => {
      const podiumContainer = document.querySelector(".couronne-compo");
      const carousel = document.querySelector(".carousel.full");
      const podiumOrder = ["John Williams", "Hans Zimmer", "Ennio Morricone"];
      podiumOrder.forEach((name, index) => {
        const composer = data.Podium.find(
          (c) => `${c.Affichage.Prénom} ${c.Affichage.Nom}` === name
        );
        if (!composer) return;

        const p = document.createElement("p");
        p.classList.add("compositeurs");
        if (index === 0) p.classList.add("premier");
        if (index === 1) p.classList.add("deuxieme");
        if (index === 2) p.classList.add("troisieme");
        p.innerHTML = `<span>${
          composer.Affichage.Prénom
        }</span> <span>${composer.Affichage.Nom.toUpperCase()}</span>`;
        podiumContainer.appendChild(p);
      });

      data.Podium.forEach((composer) => {
        const info = composer.Affichage;
        const slide = document.createElement("div");
        slide.classList.add("slide", "full");

        slide.innerHTML = `
        <h3 class="nom-compositeur">${info.Prénom} ${info.Nom}</h3>
        <div class="slide-content">
          <div class="slide-left">
            <div class="info-compositeur">
              <img src="${info.Tronche}" alt="${info.Nom}" class="image-compo"/>
              <p class="description">${info.Description}</p>
            </div>
            <div class="musique-connue">
              <h4>Musique la plus connue :</h4>
              <p><strong>${info.Musique_la_plus_connue.Film}</strong> (${
          info.Musique_la_plus_connue.Date
        })<br>
              Réalisateur : ${info.Musique_la_plus_connue.Réalisateur}</p>
              <audio controls class="audio-player">
              <source src="${
                info.Musique_la_plus_connue.Musique
              }" type="audio/mp3" />
              </audio>
            </div>
          </div>

          <div class="slide-right">
            <h4>Nominations (${info.Nombre_de_nominations})</h4>
            ${info.Nominations.map(
              (nom) => `
                <div class="film_description">
                  <img src="${nom.Affiche}" alt="${nom.Film}" class="affiche_film"/>
                  <div class="film-info">
                    <h5>${nom.Film}</h5>
                    <p>${nom.Oscar}</p>
                  </div>
                </div>
              `
            ).join("")}
          </div>
        </div>
      `;
        carousel.appendChild(slide);
      });

      const slides = document.querySelectorAll(".slide.full");
      const btnLeft = document.querySelector(".carousel-btn.left");
      const btnRight = document.querySelector(".carousel-btn.right");
      let currentIndex = 0;

      function showSlide(index) {
        const total = slides.length;
        if (index < 0) index = total - 1;
        if (index >= total) index = 0;
        carousel.style.transform = `translateX(-${index * 100}%)`;
        currentIndex = index;
      }

      btnLeft.addEventListener("click", () => showSlide(currentIndex - 1));
      btnRight.addEventListener("click", () => showSlide(currentIndex + 1));

      showSlide(0);
    });

  fetch("data/genres_musiques.json")
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
    });

  /* test  */
  console.clear();

  class musicPlayer {
    constructor() {
      this.play = this.play.bind(this);
      this.playBtn = document.getElementById("play");
      this.playBtn.addEventListener("click", this.play);
      this.controlPanel = document.getElementById("control-panel");
      this.infoBar = document.getElementById("info");
    }

    play() {
      let controlPanelObj = this.controlPanel,
        infoBarObj = this.infoBar;
      Array.from(controlPanelObj.classList).find(function (element) {
        return element !== "active"
          ? controlPanelObj.classList.add("active")
          : controlPanelObj.classList.remove("active");
      });

      Array.from(infoBarObj.classList).find(function (element) {
        return element !== "active"
          ? infoBarObj.classList.add("active")
          : infoBarObj.classList.remove("active");
      });
    }
  }

  const newMusicplayer = new musicPlayer();
});
