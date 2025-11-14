async function getFilmsAnnee(annee) {
    const response = await fetch('/data/genresv1.json');
    const data = await response.json();

    let quantite = 0;

    data.forEach(element => {
        if (element.year == annee) {
            quantite++;
        }
    });

    return quantite;
}

async function getFilmsGenre(genre, annee) {
    const response = await fetch('/data/graphTablev2.json');
    const data = await response.json();

    // On cherche l'année dans le genre
    const found = data[genre].years.find(element => element.year == annee);
    return found ? found.value : 0; // retourne 0 si pas trouvé
}

// Fonction principale pour afficher le résultat
async function getPourcent(genre, annee) {
    const totalAnnee = await getFilmsAnnee(annee);
    const totalGenre = await getFilmsGenre(genre, annee);
    const pourcent = (totalGenre/totalAnnee)*100
    return(pourcent)
}

async function transformData() {
    const response = await fetch('/data/graphTablev2.json');
    const data = await response.json();
     
    for (const element of data) {
        for (const el of element.years) {
            el.value = await getPourcent(element.index, el.year);
        }
    }

    return data; // si tu veux récupérer le tableau transformé
}


// Exemple d'appel
let annee = 2016;
let genre = 0;

afficherFilms(genre, annee);
