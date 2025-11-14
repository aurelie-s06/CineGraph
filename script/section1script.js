titregraph = "Pourcentage de genres dans les films nominés aux Oscars par décennie";

fetch("data/graphTablev4.json")
  .then((response) => response.json())
  .then((data) => {
    const allDecades = [
      ...new Set(data.flatMap((g) => g.decades.map((d) => d.decade))),
    ].sort();

    const colors = [
      "rgba(255, 99, 132, 0.7)",
      "rgba(54, 162, 235, 0.7)",
      "rgba(255, 206, 86, 0.7)",
      "rgba(75, 192, 192, 0.7)",
      "rgba(153, 102, 255, 0.7)",
      "rgba(255, 159, 64, 0.7)",
      "rgba(199, 199, 199, 0.7)",
    ];

    const datasets = data.map((genreData, index) => {
      const values = allDecades.map((dec) => {
        const d = genreData.decades.find((x) => x.decade === dec);
        return d ? d.value : 0;
      });

      const color = colors[index % colors.length];

      return {
        label: genreData.genre,
        data: values,
        borderColor: color,
        backgroundColor: color.replace("0.7", "0.2"), // effet de remplissage léger
        fill: true,
        tension: 0.4, // courbes plus douces
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBackgroundColor: color,
      };
    });

    const ctx = document.getElementById("oscarsChart").getContext("2d");

    const chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: allDecades,
        datasets: datasets,
      },
      options: {
        responsive: true,
        interaction: {
          mode: "nearest",
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: titregraph,
            color: "#FFFFFF",
            font: {
              size: 20,
              weight: "bold",
              family: "Poppins",
            },
          },
          legend: {
            position: "bottom",
            labels: {
              color: "#FFFFFF",
              font: {
                family: "Poppins",
                size: 14,
              },
            },
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
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0,0,0,0.8)",
            titleColor: "#FFF",
            bodyColor: "#FFF",
            bodyFont: {
              family: "Poppins",
              size: 13,
            },
          },
        },
        scales: {
          y: {
            title: {
              display: true,
              text: "Pourcentage (%)",
              color: "#FFFFFF",
              font: { size: 16, weight: "bold", family: "Poppins" },
            },
            ticks: { color: "#FFFFFF" },
            grid: {
              color: "rgba(255,255,255,0.2)",
              borderColor: "#FFFFFF",
              lineWidth: 1,
            },
          },
          x: {
            title: {
              display: true,
              text: "Décennies",
              color: "#FFFFFF",
              font: { size: 16, weight: "bold", family: "Poppins" },
            },
            ticks: { color: "#FFFFFF" },
            grid: {
              color: "rgba(255,255,255,0.2)",
              borderColor: "#FFFFFF",
              lineWidth: 1,
            },
          },
        },
      },
    });
  });

