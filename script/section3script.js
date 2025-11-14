  fetch("data/music_film.json")
    .then((response) => response.json())
    .then((allsts) => {
      console.log(allsts);
      let currentLang = localStorage.getItem("lang") || "en";

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

      function displaystInfo(id) {
        let index = id.replace("st", "") - 1;
        console.log(index);
        document.getElementById("st-iframe").src = allsts[index].yt_link;
        document.getElementById("st-title").innerText =
          allsts[index].music_title;
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

      // language switch helpers (no library)
      function updateLangButtons() {
        document.querySelectorAll(".lang-btn").forEach((b) => {
          b.classList.toggle("active", b.id === "lang-" + currentLang);
        });
      }

      function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem("lang", lang);
        updateLangButtons();
        const activeLi = document.querySelector(".sts-list li.active");
        const id = activeLi ? activeLi.id : "st1";
        // update displayed info to reflect new language
        displaystInfo(id);
      }

      // set initial language UI
      updateLangButtons();

      // Listen for messages from parent window (index.html) to change language
      window.addEventListener("message", (e) => {
        if (e && e.data && e.data.lang) {
          const incoming = String(e.data.lang).toLowerCase();
          setLanguage(incoming);
        }
      });

      // Display the first soundtrack info at load
      displayST("st1");
    });