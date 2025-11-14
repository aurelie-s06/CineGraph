/* Ce code permet de regrouper les années en décennies, il aditionne donc les valeurs de chaque année pour en avoir une seule par decennies */

fetch("data/graphTablev3.json")
    .then(response => response.json())
    .then(data => {
        const result = groupByDecade(data);
        console.log(JSON.stringify(result, null, 2));
    })
    .catch(err => console.error("Erreur chargement JSON :", err));

function groupByDecade(data) {
    return data.map(genreObj => {
        const decadeMap = {};

        genreObj.years.forEach(entry => {
            const year = parseInt(entry.year, 10);
            const value = entry.value;

            // Décennie
            const decade = Math.floor(year / 10) * 10;

            if (!decadeMap[decade]) {
                decadeMap[decade] = 0;
            }
            decadeMap[decade] += value;
        });

        // Conversion en tableau 
        const decadesArray = Object.keys(decadeMap)
            .sort((a, b) => a - b)
            .map(decade => ({
                decade: decade,
                value: parseFloat(decadeMap[decade].toFixed(4)) // arrondi optionnel
            }));

        return {
            genre: genreObj.genre,
            decades: decadesArray
        };
    });
}

