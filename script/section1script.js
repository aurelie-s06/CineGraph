/* Graphique */

fetch("data/graphTablev3.json")
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
