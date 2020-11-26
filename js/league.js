document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const idParams = urlParams.get("id");
  const isFromSaved = urlParams.get("saved");
  const save = document.querySelector("#save");
  const deleteBtn = document.querySelector("#delete");

  const loadTabs = () => {
    fetch("tabs.html")
      .then((res) => {
        if (res.status != 200) return;
        return res.text();
      })
      .then((data) => {
        if (!isFromSaved) {
          document.querySelector("#tab-nav").innerHTML = data;
        }

        document.querySelectorAll("#tab-nav a").forEach((elm) => {
          elm.addEventListener("click", (e) => {
            // Muat konten halaman yang dipanggil

            page = e.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      })
      .catch((err) => console.log(err));
  };

  const loadList = () => {
    fetch("listleague.html")
      .then((res) => {
        if (res.status != 200) return;
        return res.text();
      })
      .then((data) => {
        document.querySelector("#matches").innerHTML = data;

        const league = document.querySelector("#matches");

        league.addEventListener("change", (e) => {
          const urlParams = window.location.href;
          window.location.replace(
            urlParams.replace(
              /(id=).*/,
              "$1" + e.target.value + window.location.hash
            )
          );
        });
      })
      .catch((err) => console.log(err));
  };

  const loadListStanding = async () => {
    await fetch("listleague.html")
      .then((res) => {
        if (res.status != 200) return;
        return res.text();
      })
      .then((data) => {
        document.querySelector("#id-standing").innerHTML = data;

        const standings = document.querySelector("#id-standing");

        standings.addEventListener("change", (e) => {
          const urlParams = window.location.href;
          window.location.replace(
            urlParams.replace(
              /(id=).*/,
              "$1" + e.target.value + window.location.hash
            )
          );
        });
      })
      .catch((err) => console.log(err));
  };

  const loadPage = async (page) => {
    const content = document.querySelector("#league-content");
    await fetch(`pages/league/${page}.html`)
      .then((res) => {
        if (res.status == 200) {
          return res.text();
        } else if (res.status == 404) {
          content.innerHTML =
            "<p class='white-text bolder-text'>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      })
      .then((data) => {
        content.innerHTML = data;
      });

    if (page == "match") {
      if (isFromSaved) {
        save.style.display = "none";
        deleteBtn.style.display = "block";
        getSavedMatchById();
      } else {
        save.style.display = "block";
        deleteBtn.style.display = "none";

        const matches = getCompetition(idParams);

        save.addEventListener("click", () => {
          console.log("FAB Clicked");
          matches.then(([data, teams]) => {
            saveMatch(data);
            saveTeam(teams);
          });
        });
      }

      loadList();
    } else if (page == "standings") {
      save.style.display = "none";
      deleteBtn.style.display = "none";
      getStandings(idParams);

      loadListStanding();
    }

    deleteBtn.addEventListener("click", () => {
      deleteMatch(idParams);
      deleteTeam(idParams);
      window.location.reload();
    });
  };

  let page = window.location.hash.substr(1);
  if (page == "") page = "match";

  loadPage(page);

  loadTabs();
});
