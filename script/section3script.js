let contenulangue = {};

fetch("data/contenulangue.json")
  .then((res) => res.json())
  .then((data) => {
    contenulangue = data;
  });

fetch("data/music_film.json")
  .then((response) => response.json())
  .then((allsts) => {
    //console.log(allsts);
    let currentLang = "en";

    const sts_listdiv = document.querySelector(".sts-list ol");
    const sts_infodiv = document.querySelector(".sts-info");

    sts_listdiv.innerHTML = "";

    allsts.forEach((st) => {
      let element_list =
        '<li id="st' +
        st.range +
        '"><p class = "st-range">' +
        st.range +
        "</p><p>" +
        st.music_title +
        " - " +
        st.film_title +
        "</p></li>";
      sts_listdiv.innerHTML += element_list;
    });

    function setActiveClass(id) {
      document.getElementById(id).classList.add("active");
      document.querySelectorAll(".sts-list li").forEach((div) => {
        if (div.id !== id) {
          div.classList.remove("active");
        }
      });
    }

    function transitionInfo(value) {
      sts_infodiv.style.opacity = value;
    }

    const langButtons = document.querySelectorAll(".lang-menu button");

    langButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedLang = btn.dataset.lang;
        localStorage.setItem("lang", selectedLang);
        currentLang = selectedLang;
        const activeLi = document.querySelector(".sts-list li.active");
        if (activeLi) {
          let index = activeLi.id.replace("st", "") - 1;
          document.getElementById("st-description").innerText =
            allsts[index].music_description[0][currentLang];

          const ventesText = contenulangue[currentLang][0].ventes;
          const soldValue = document.getElementById("st-sold").innerText;
          document.getElementById(
            "ventes"
          ).innerHTML = `${ventesText.before} <span id="st-sold">${soldValue}</span> ${ventesText.after}`;
        }
      });
    });

    function displaystInfo(id) {
      let index = id.replace("st", "") - 1;
      //console.log(index);
      document.getElementById("st-iframe").src = allsts[index].yt_link;
      document.getElementById("st-title").innerText = allsts[index].music_title;
      document.getElementById("st-singer").innerText =
        allsts[index].music_singer;
      document.getElementById("st-film-title").innerText =
        allsts[index].film_title;
      document.getElementById("st-film-director").innerText =
        allsts[index].film_director;
      document.getElementById("st-film-date").innerText =
        allsts[index].film_date;
      document.getElementById("st-sold").innerText = allsts[index].sold;
      document.getElementById("st-description").innerText =
        allsts[index].music_description[0][currentLang];
      document.getElementById("film-link").href = allsts[index].film_link;
      document.getElementById("music-link").href = allsts[index].music_link;
    }

    function displayST(stId) {
      setActiveClass(stId);
      transitionInfo(0);
      setTimeout(() => displaystInfo(stId), 300);
      setTimeout(() => transitionInfo(1), 300);
    }

    sts_listdiv.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const stId = li.id;
        displayST(stId);
      });
    });

    displayST("st1");
  });
