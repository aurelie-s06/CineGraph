let graphTable = []
fetch("formattedGenres.json")
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            let genre = element.genre
            let found = 0
            
            for (var i = 0; i < graphTable.length; i++) {
                if (genre === graphTable[i]) {
                    found = 1;
                }
            }
            if (found == 1) {
                console.log(genre + ' existe déjà');
            } else {
                graphTable.push(genre);
            }
        });
    })