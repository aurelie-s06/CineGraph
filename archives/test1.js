async function getFilmsAnnee(annee) {
    const response = await fetch('/data/genresv1.json');
    const data = await response.json();

    let quantite = 0;

    data.forEach(element => {
        if (element.year == annee) {
            quantite++;
        }
    });

    
    console.log('Quantite totale film (année) : '+quantite)
    return quantite;
}

async function getFilmsGenre(genreIndex, annee) {
    const response = await fetch('/data/graphTablev1.json');
    const data = await response.json();

    const genreObj = data[genreIndex];
    if (!genreObj) return 0;

    const found = genreObj.years.find(el => el.year == annee);
    const quantite = found.value
    console.log('Quantite film (genre) : '+quantite)
    return quantite;
}

async function getPourcent(genreIndex, annee) {
    const totalAnnee = await getFilmsAnnee(annee);
    const totalGenre = await getFilmsGenre(genreIndex, annee);
    if (totalAnnee === 0) return 0;

    const pourcent = (totalGenre / totalAnnee) * 100

    console.log('pourcentage : '+pourcent)
    return pourcent;
}

async function transformData() {
    const response = await fetch('/data/graphTablev1.json');
    const data = await response.json();

    for (let i = 0; i < data.length; i++) {
        const genreBlock = data[i];

        for (const yearObj of genreBlock.years) {
            const year = yearObj.year;
            yearObj.value = await getPourcent(i, year); // i = index du genre
        }
    }
    console.log(data)
    return data;
}

console.log(transformData())
