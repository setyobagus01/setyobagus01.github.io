document.addEventListener("DOMContentLoaded", () => {
  // Activasi sidebar nav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);

  const loadNav = () => {
    fetch("nav.html")
      .then((res) => {
        if (res.status != 200) return;
        return res.text();
      })
      .then((data) => {
        document.querySelectorAll(".topnav, .sidenav").forEach((elm) => {
          elm.innerHTML = data;
        });

        document.querySelectorAll(".topnav a, .sidenav a").forEach((elm) => {
          elm.addEventListener("click", (e) => {
            // Tutup sidenav
            const sidenav = document.querySelector(".sidenav");
            M.Sidenav.getInstance(sidenav).close();

            // Muat konten halaman yang dipanggil
            page = e.target.getAttribute("href").substr(1);
            loadPage(page);
          });
        });
      })
      .catch((err) => console.log(err));
  };
  loadNav();

  const loadPage = async (page) => {
    const content = document.querySelector("#body-content");
    await fetch(`pages/${page}.html`)
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
        if (page == "home") {
          getTodayMatch();
        } else if (page == "saved") {
          getSavedMatches();
        }
        content.innerHTML = data;
      });
  };

  let page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);
});
