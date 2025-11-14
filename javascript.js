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

  // Charger les données
  fetch("data/composers.json")
    .then((response) => response.json())
    .then((data) => {
      composers = data.Podium;
      Carousel();
    });

  // Changer Langue -- Relier au index.html
  window.addEventListener("message", (event) => {
    if (event.data.lang) {
      currentLang = event.data.lang.toLowerCase();
      Carousel();
    }
  });

  // === Fonction Carousel ===
  function Carousel() {
    carousel.innerHTML = "";

    // Créer les slides
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
            <p class="description-compo">${info.Description[0][currentLang]}</p>
          </div>
        </div>

        <div class="container-info-music">
          <h4 id="titre4-slider-music">Musique la plus connue :</h4>
          <div class="info-music">
            <div class="music-text">
              <p>
                <strong>${
                  info.Musique_la_plus_connue.Film[0][currentLang]
                }</strong> (${info.Musique_la_plus_connue.Date})<br>
                ${info.Musique_la_plus_connue.Réalisateur[0][currentLang]}
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
          <h4 id="titre4-slider-film">Nominations (${
            info.Nombre_de_nominations
          })</h4>
          <div class="info-film">
            ${info.Nominations.map(
              (nom) => `
                <div class="film-item">
                  <img src="${nom.Affiche}" alt="${nom.Film[0][currentLang]}" class="affiche_film"/>
                  <div class="text-film">
                    <h5>${nom.Film[0][currentLang]}</h5>
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
    traduction(currentLang);
  }

  // === Navigation ===
  function setupNavigation() {
    const slides = document.querySelectorAll(".slide");

    if (!wrapper.querySelector(".carousel-nav")) {
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

      navContainer.appendChild(btnLeft);
      navContainer.appendChild(btnRight);
      wrapper.appendChild(navContainer);
    }

    function updateNavNames(index) {
      const leftName = document.querySelector(".left-name");
      const rightName = document.querySelector(".right-name");

      const prevIndex = (index - 1 + composers.length) % composers.length;
      const nextIndex = (index + 1) % composers.length;

      leftName.textContent = composers[prevIndex].Affichage.Nom;
      rightName.textContent = composers[nextIndex].Affichage.Nom;
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

  // === Audio ===
  function setupAudio() {
    document.querySelectorAll(".btn-play").forEach((btn) => {
      btn.onclick = () => {
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
      };
    });

    currentAudio.onended = () => {
      if (currentButton) {
        const iconPlay = currentButton.querySelector(".icon-play");
        const iconPause = currentButton.querySelector(".icon-pause");
        iconPlay.classList.remove("hidden");
        iconPause.classList.add("hidden");
      }
    };
  }

  function traduction(lang) {
    fetch("data/contenuLangue.json")
      .then((res) => res.json())
      .then((data) => {
        const t = data[lang][0];
        document.getElementById("titre4-slider-music").textContent =
          t["titre4-slider-music"];
      });
  }

  const containers = document.querySelectorAll(
    ".container-premier, .container-deuxieme, .container-troisieme"
  );

  if (containers[0]) containers[0].classList.add("active");

  containers.forEach((container, index) => {
    container.addEventListener("click", () => {
      containers.forEach((c) => c.classList.remove("active"));
      container.classList.add("active");
    });
  });
});

/* Graphique */

fetch("graphTablev2.json")
  .then((response) => response.json())
  .then((data) => {
    const allYears = [
      ...new Set(data.flatMap((g) => g.years.map((y) => y.year))),
    ].sort();

    const colors = [
      "rgba(255, 99, 132, 0.8)",
      "rgba(54, 162, 235, 0.8)",
      "rgba(255, 206, 86, 0.8)",
      "rgba(75, 192, 192, 0.8)",
      "rgba(153, 102, 255, 0.8)",
      "rgba(255, 159, 64, 0.8)",
      "rgba(199, 199, 199, 0.8)",
    ];

    const datasets = data.map((genreData, index) => {
      const values = allYears.map((yearObj) => {
        const y = genreData.years.find((y) => y.year === yearObj);
        return y ? y.value : 0;
      });

      const color = colors[index % colors.length];

      return {
        label: genreData.genre,
        data: values,
        borderColor: color,
        backgroundColor: color,
        fill: false,
        tension: 0.2,
        originalColor: color,
      };
    });

    const ctx = document.getElementById("oscarsChart").getContext("2d");
    const chart = new Chart(ctx, {
      type: "line",
      data: { 
        labels: allYears,
        datasets: datasets,
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: "Pourcentage de genres dans les films nominés aux Oscars par année",
          },
          legend: {
            onClick: (e, legendItem, legend) => {
              const index = legendItem.datasetIndex;
              const chartInstance = legend.chart;
              const meta = chartInstance.getDatasetMeta(index);
              const allHiddenExceptSelected = chartInstance.data.datasets.every(
                (d, i) => {
                  if (i === index) return true;
                  return chartInstance.getDatasetMeta(i).hidden === true;
                }
              );

              if (allHiddenExceptSelected) {
                chartInstance.data.datasets.forEach((d, i) => {
                  chartInstance.getDatasetMeta(i).hidden = false;
                });
              } else {
                chartInstance.data.datasets.forEach((d, i) => {
                  chartInstance.getDatasetMeta(i).hidden = i !== index;
                });
              }

              chartInstance.update();
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Pourcentage (%)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Année",
            },
          },
        },
      },
    });
  });

  //activer les projecteurs

  document.getElementById('light1').addEventListener('click', function(){
    this.classList.add('active')
    console.log('caca')
  })
  document.getElementById('light2').addEventListener('click', function(){
    this.classList.add('active')
    console.log('caca')
  })
  document.getElementById('light3').addEventListener('click', function(){
    this.classList.add('active')
    console.log('caca')
  })