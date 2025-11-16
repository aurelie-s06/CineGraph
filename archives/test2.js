async function getFilmsAnnee(annee) {
    const response = await fetch('/data/genresv1.json');
    const data = await response.json();

    let quantite = 0;
    data.forEach(element => {
        if (element.year == annee) quantite++;
    });

    return quantite;
}

async function getFilmsGenre(genreIndex, annee) {
    const response = await fetch('/data/graphTablev1.json');
    const data = await response.json();

    const genreObj = data[genreIndex];
    if (!genreObj) return 0;

    const found = genreObj.years.find(el => el.year == annee);
    return found ? found.value : 0;
}

async function getPourcent(genreIndex, annee) {
    const totalAnnee = await getFilmsAnnee(annee);
    const totalGenre = await getFilmsGenre(genreIndex, annee);

    if (totalAnnee === 0) return 0;
    return (totalGenre / totalAnnee) * 100;
}

// ----------- VERSION QUI RENVOIE TON FORMAT EXACT -----------
async function buildFinalData() {
    console.log('Traitement des données...')
    const res = await fetch('/data/graphTablev1.json');
    const data = await res.json();

    const finalData = [];

    for (let i = 0; i < data.length; i++) {
        const genreName = data[i].genre;
        const decadesArray = [];

        // Parcours des décennies 1920 → 2020
        for (let dec = 1920; dec <= 2020; dec += 10) {
            let values = [];

            // Chaque année de la décennie
            for (let year = dec; year < dec + 10 && year <= 2025; year++) {
                const percent = await getPourcent(i, year);
                if (percent > 0) values.push(percent);
            }

            // Une seule valeur par décennie (moyenne)
            const decadeValue =
                values.length > 0
                    ? values.reduce((a, b) => a + b, 0) / values.length
                    : 0;

            decadesArray.push({
                decade: String(dec),
                value: decadeValue,
            });
        }

        finalData.push({
            genre: genreName,
            decades: decadesArray
        });
    }

    console.log(finalData);
    return finalData;
}

buildFinalData();
