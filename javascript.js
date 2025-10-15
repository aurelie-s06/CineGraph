// Charger le fichier JSON
fetch("DataFilm_40000.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);

    // 1. Parser les genres (conversion de la chaîne en tableau)
    data.forEach((d) => {
      if (d.genres_list) {
        d.genres = JSON.parse(d.genres_list.replace(/'/g, '"'));
      } else {
        d.genres = [];
      }
    });

    // 2. Compter la fréquence de chaque genre
    const genreCounts = {};
    data.forEach((d) => {
      d.genres.forEach((g) => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    // 3. 5 genres les plus fréquents
    const topGenres = Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map((g) => g[0]);

    // 4. Années à partir de 2000
    const years = [
      ...new Set(data.map((d) => d.release_year).filter((y) => y >= 2000)),
    ].sort((a, b) => a - b);

    // 5. Construire les datasets
    const dataset = {};
    topGenres.forEach((genre) => {
      dataset[genre] = years.map(
        (year) =>
          data.filter(
            (d) => d.release_year === year && d.genres.includes(genre)
          ).length
      );
    });

    // 6. Canvas
    const canvas = document.getElementById("myChart");
    const ctx = canvas.getContext("2d");

    const padding = 60;
    const width = canvas.width - 2 * padding;
    const height = canvas.height - 2 * padding;
    const maxVal = Math.max(...Object.values(dataset).flat());

    // === AXES ===
    ctx.font = "14px Arial";
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // === AXE Y ===
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    [0, Math.ceil(maxVal / 2), maxVal].forEach((v) => {
      const y = canvas.height - padding - (v / maxVal) * height;
      ctx.fillText(v, padding - 10, y);
      /* ctx.strokeText("Films", 50, 50); */
      ctx.beginPath();
      ctx.moveTo(padding - 5, y);
      ctx.lineTo(padding, y);
      ctx.stroke();
    });

    // === AXE X ===
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    years.forEach((y, i) => {
      const x = padding + i * (width / (years.length - 1));
      ctx.fillText(y, x, canvas.height - padding + 10);
    });

    // === COURBES ===
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

      // Points sur la courbe
      ctx.fillStyle = colors[idx];
      dataset[genre].forEach((val, i) => {
        const x = padding + i * (width / (years.length - 1));
        const y = canvas.height - padding - (val / maxVal) * height;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    });

    // === LÉGENDE ===
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
