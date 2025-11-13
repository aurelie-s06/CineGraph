let formattedGenres = []
fetch("genresv1.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let year = element.year
            let genres = element.genre.split(", ")
            let value = 1 / genres.length
            genres.forEach(genre => {
                let object = {
                    'year': year,
                    "value": value,
                    "genre": genre
                }
                formattedGenres.push(object)
                console.log(object)
            })

        });
    })

