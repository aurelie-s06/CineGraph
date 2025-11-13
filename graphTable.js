let graphTable = []
let yearsTable = []
let somme = 0
fetch("genresv1.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            yearsTable.push(element.year)
        })
    })
fetch("formattedGenres.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {

            //créer un objet pour chaque genre
            let genre = element.genre
            let foundgenre = 0
            for (var i = 0; i < graphTable.length; i++) {
                if (genre === graphTable[i].genre) {
                    foundgenre = 1;
                }
            }
            if (foundgenre == 1) {
            } else {
                let obj = {
                    'genre': genre,
                    'years': []
                }
                graphTable.push(obj)
            }

            //selectionner le bon objet genre
            let genreobj = graphTable.find((obj) => obj.genre === genre);


            //créer un objet pour chaque année
            let year = element.year
            let foundyear = 0
            for (var i = 0; i < genreobj.years.length; i++) {
                if (year === genreobj.years[i].year) {
                    foundyear = 1;
                }
            }
            if (foundyear == 1) {
            } else {
                let obj = {
                    'year': year,
                    'value': 0
                }
                genreobj.years.push(obj)
            }

            //ajouter les valeurs pour la bonne année
            let yearvalueobj = genreobj.years.find((obj) => obj.year === year);

            yearvalueobj.value += element.value

            let occurrences = 0
            yearsTable.forEach(el => {
                if (el == year) {
                    occurrences += 1
                }
            })

            yearvalueobj.value = element.value/occurrences * 100

        });
    })

console.log(graphTable)