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
        p.innerHTML = `<span>${composer.Affichage.Prénom}</span> <span>${composer.Affichage.Nom.toUpperCase()}</span>`;
        podiumContainer.appendChild(p);
      });

      data.Podium.forEach((composer) => {
        const slide = document.createElement("div");
        slide.classList.add("slide", "full");

        slide.innerHTML = `
          <h3>${composer.Affichage.Prénom} ${composer.Affichage.Nom}</h3>
          <div class="slide-content">
            <div class="slide-left">
              <img src="${composer.Affichage.Tronche}" alt="${composer.Affichage.Nom}" class="image-compo"/>
              <p>${composer.Affichage.Description}</p>
            </div>
            <div class="slide-right">
              ${composer.Affichage.Nominations.map(
                (nom) => `
                  <div class="film_description">
                    <img src="${nom.Affiche}" alt="${nom.Film}" class="affiche_film"/>
                    <em>${nom.Film} (${nom.Oscar})</em>
                  </div>
                `
              ).join('')}
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
});





/* fetch("DataFilm_40000.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);


    data.forEach((d) => {
      if (d.genres_list) {
        d.genres = JSON.parse(d.genres_list.replace(/'/g, '"'));
      } else {
        d.genres = [];
      }
    });

    // fréquence genre
    const genreCounts = {};
    data.forEach((d) => {
      d.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });


    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((g) => g[0]);

    // 2000
    const years = [
      ...new Set(data.map((d) => d.release_year).filter((y) => y >= 2000)),
    ].sort((a, b) => a - b);

    // datasets
    const dataset = {};
    topGenres.forEach((genre) => {
      dataset[genre] = years.map(
        (year) =>
          data.filter(
            (d) => d.release_year === year && d.genres.includes(genre)
          ).length
      );
    });


    const canvas = document.getElementById("myChart");
    const ctx = canvas.getContext("2d");

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxVal = Math.max(...Object.values(dataset).flat());

    // axes
    ctx.font = "14px Arial";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // y
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [0, Math.ceil(maxVal / 2), maxVal].forEach((v) => {
      const y = canvas.height - padding - (v / maxVal) * height;
      ctx.fillText(v, padding - 10, y);
      /* ctx.strokeText("Films", 50, 50); 
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
    });

    // x
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    years.forEach((y, i) => {
      const x = padding + i * (width / (years.length - 1));
      ctx.fillText(y, x, canvas.height - padding + 10);
    });


    const colors = [
  "#AC0302",
  "#E85C0D",
  "#fbe281ff", 
  "#D4A017",
  "#A64D79"
];

    topGenres.forEach((genre, idx) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[idx];
      ctx.lineWidth = 3;

      dataset[genre].forEach((val, i) => {
        const x = padding + i * (width / (years.length - 1));
        const y = canvas.height - padding - (val / maxVal) * height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.stroke();

      // points
      ctx.fillStyle = colors[idx];
      dataset[genre].forEach((val, i) => {
        const x = padding + i * (width / (years.length - 1));
        const y = canvas.height - padding - (val / maxVal) * height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // légende
    const legendY = canvas.height - 20; 
    const legendXStart = padding;
    const spacing = 150;
    ctx.font = "14px Arial";

    topGenres.forEach((genre, i) => {
      const x = legendXStart + i * spacing;
      ctx.fillStyle = colors[i];
      ctx.fillRect(x, legendY - 10, 12, 12);
      ctx.fillStyle = "White";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(genre, x + 18, legendY - 4);

    });
  });
 */