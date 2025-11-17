
let oscarsChart = null;

let contenuLangue = {
  "fr":
  {
    "x": "Décénnie",
    "y": "Proportion parmis les films nommés (%)"
  }
  ,
  "en":
  {
    "x": "Decade",
    "y": "Proportion among the nominated films (%)"
  }

}
let currentLang = "en"

function setGraph() {
  fetch("data/GraphFinal.json")
    .then((response) => response.json())
    .then((data) => {
      const allDecades = [
        ...new Set(data.flatMap((g) => g.decades.map((d) => d.decade))),
      ].sort();

      if (oscarsChart) {
        oscarsChart.destroy();
      }

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
          backgroundColor: color.replace("0.7", "0.2"),
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointBackgroundColor: color,
        };
      });

      const ctx = document.getElementById("oscarsChart").getContext("2d");

      oscarsChart = new Chart(ctx, {
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
            // ----- Légende -----
            legend: {
              position: "bottom",
              align: "center",
              labels: {
                color: "#FFFFFF",
                font: {
                  size: 13,
                  weight: "bold",
                  family: "Poppins, sans-serif",
                  style: "normal",
                },
                usePointStyle: true,
                pointStyle: "circle",
                boxWidth: 15,
                padding: 15,
              },
              onHover: (event, legendItem, legend) => {
                event.native.target.style.cursor = "pointer";
              },
              onLeave: (event, legendItem, legend) => {
                event.native.target.style.cursor = "default";
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
                size: 11,
                weight: "bold",
                family: "Poppins, sans-serif",
                style: "normal",
              },
              callbacks: {
                label: function (context) {
                  return context.dataset.label + ": " + context.raw.toFixed(1) + "%";
                }
              }
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: contenuLangue[currentLang].y,
                color: "#FFFFFF",
                font: {
                  size: 15,
                  weight: "bold",
                  family: "Poppins, sans-serif",
                  style: "normal",
                },
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
                text: contenuLangue[currentLang].x,
                color: "#FFFFFF",
                font: {
                  size: 15,
                  weight: "bold",
                  family: "Poppins, sans-serif",
                  style: "normal",
                },
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
}

//premier appel
setGraph(currentLang)

document.querySelectorAll("#traduire button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const lang = btn.dataset.lang;
    langBtn.innerHTML = btn.textContent + ' <span>▾</span>';
    setGraph(lang);
    langSelect.classList.remove("open");
  });
});