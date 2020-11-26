const base_url = "https://api.football-data.org/v2";
const config = {
  headers: {
    "X-Auth-Token": "53e75a29f0854ea3952f8511bddf1aac",
  },
};

const status = (res) => {
  if (res.status !== 200) {
    console.log(`Error : ${res.status}`);

    return Promise.reject(new Error(res.statusText));
  } else {
    document.querySelector(".competitions").classList.remove("loader");
    return Promise.resolve(res);
  }
};

const getWeek = () => {
  let now = new Date();
  let dayOfWeek = now.getDay();
  let numDay = now.getDate();

  let start = new Date(now);
  start.setDate(numDay - dayOfWeek);
  start.setHours(0, 0, 0, 0);

  let end = new Date(now);
  end.setDate(numDay + (7 - dayOfWeek));
  end.setHours(0, 0, 0, 0);

  return [start, end];
};

function getTodayMatch() {
  if ("caches" in window) {
    caches.match(`${base_url}/competitions`).then((res) => {
      if (res) {
        res.json().then((data) => {
          let competitionHTML = "";
          console.log(data);
          const competitions = data.competitions.filter((competition) => {
            const competitionID = [2001, 2002, 2003, 2021, 2014, 2015];
            return competitionID.includes(competition.id);
          });

          competitions.forEach((competition) => {
            competitionHTML += `
            <a class="card-link" href="./league.html?id=${competition.id}">
              <div class="competition">
                <img class="emblem-competition" src="${
                  competition.emblemUrl != null
                    ? competition.emblemUrl
                    : competition.area.ensignUrl
                }" alt="img competition" />
                <div class="league">
                  <span class="league-name">${competition.name}</span>
                  <div class="date-competition">
                    <span class="start-date">Start date: ${
                      competition.currentSeason.startDate
                    }</span>
                    <span class="end-date">End date: ${
                      competition.currentSeason.endDate
                    }</span>
                  </div>
                </div>
              </div>
            </a>
        `;
          });
          document.querySelector(".competitions").innerHTML = competitionHTML;
        });
      }
    });
  }

  fetch(`${base_url}/competitions`, config)
    .then(status)
    .then((responses) => {
      return responses.json();
    })
    .then((data) => {
      let competitionHTML = "";

      const competitions = data.competitions.filter((competition) => {
        const competitionID = [2001, 2002, 2003, 2021, 2014, 2015];
        return competitionID.includes(competition.id);
      });

      competitions.forEach((competition) => {
        competitionHTML += `
        <a class="card-link" href="./league.html?id=${competition.id}">
          <div class="competition">
            <img class="emblem-competition" src="${
              competition.emblemUrl != null
                ? competition.emblemUrl
                : competition.area.ensignUrl
            }" alt="img competition" />
            <div class="league">
              <span class="league-name">${competition.name}</span>
              <div class="date-competition">
                <span class="start-date">Start date: ${
                  competition.currentSeason.startDate
                }</span>
                <span class="end-date">End date: ${
                  competition.currentSeason.endDate
                }</span>
              </div>
            </div>
          </div>
        </a>
        `;
      });

      document.querySelector(".competitions").innerHTML = competitionHTML;
    })
    .catch((err) => console.log(err));
}

function getSavedMatches() {
  getAll().then((match) => {
    let competitionHTML = "";

    match.forEach((competition) => {
      console.log(competition);
      competitionHTML += `
        <a class="card-link" href="./league.html?id=${competition.competition.id}&saved=true">
          <div class="competition">
           
            <div class="league">
              <span class="league-name">${competition.competition.name}</span>
                
            </div>
          </div>
        </a>
        `;
    });

    document.querySelector(".competitions").innerHTML = competitionHTML;
  });
}

function getCompetition(id) {
  return new Promise((resolve, reject) => {
    const urlParams = new URLSearchParams(window.location.search);
    const idParam = urlParams.get("id");

    if ("caches" in window) {
      caches
        .match(`${base_url}/competitions/${idParam}/matches`)
        .then((res) => {
          if (res) {
            res.json().then((data) => {
              console.log(data);
              let matchHTML = "";
              const weeklyLeague = data.matches.filter((match) => {
                const date = new Date(
                  match.utcDate.replace("T", " ").replace(/-/g, "/")
                );
                let [start, end] = getWeek();
                return +date >= +start && +date < +end;
              });

              const options = {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              };

              const time = {
                hour: "numeric",
                minute: "numeric",
                timeZone: "Asia/Jakarta",
              };

              weeklyLeague.forEach((match) => {
                const date = new Date(
                  match.utcDate.replace("T", " ").replace(/-/g, "/")
                );

                matchHTML += `
            <div class="match">
                  <span class="match-date">${new Intl.DateTimeFormat(
                    "en-US",
                    options
                  ).format(date)}</span>
                  <span class="match-time">${new Intl.DateTimeFormat(
                    "en-US",
                    time
                  ).format(date)} WIB</span>
                  <div class="club-info">
                    <div class="club">
                      <span class="club-name">${match.homeTeam.name}</span>
           
                    </div>
                    <span class="versus">VS</span>
                    <div class="club">
                        <span class="club-name">${match.awayTeam.name}</span>
                    </div>
                  </div>
                </div>
          `;
              });
              document.querySelector(".club-container").innerHTML = matchHTML;
              document.querySelector(
                ".competition-name"
              ).innerText = `${data.competition.name}`;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(data);
            });
          }
        })
        .catch((err) => console.log(err));
    }

    Promise.all([
      fetch(`${base_url}/competitions/${id ? id : idParam}/matches`, config),
      fetch(`${base_url}/competitions/${id ? id : idParam}/teams`, config),
    ])

      .then((responses) => {
        return Promise.all(responses.map((res) => res.json()));
      })
      .then(([data, teams]) => {
        document.querySelector(".club-container").classList.remove("loader");
        let matchHTML = "";
        const weeklyLeague = data.matches.filter((match) => {
          const date = new Date(
            match.utcDate.replace("T", " ").replace(/-/g, "/")
          );
          let [start, end] = getWeek();
          return +date >= +start && +date < +end;
        });

        const options = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        };

        const time = {
          hour: "numeric",
          minute: "numeric",
          timeZone: "Asia/Jakarta",
        };

        weeklyLeague.forEach((match) => {
          const date = new Date(
            match.utcDate.replace("T", " ").replace(/-/g, "/")
          );

          matchHTML += `
            <div class="match">
                  <span class="match-date">${new Intl.DateTimeFormat(
                    "en-US",
                    options
                  ).format(date)}</span>
                  <span class="match-time">${new Intl.DateTimeFormat(
                    "en-US",
                    time
                  ).format(date)} WIB</span>
                  <div class="club-info">
                    <div class="club">
                      <span class="club-name">${match.homeTeam.name}</span>
                      <img class="img-match" src="${teams.teams
                        .filter((team) => {
                          return team.name === match.homeTeam.name;
                        })
                        .map((t) => t.crestUrl)}" />
                    </div>
                    <span class="versus">VS</span>
                    <div class="club">
                      <img class="img-match" src="${teams.teams
                        .filter((team) => {
                          return team.name === match.awayTeam.name;
                        })
                        .map((t) => t.crestUrl)}" />
                        <span class="club-name">${match.awayTeam.name}</span>
                    </div>
                  </div>
                </div>
          `;
        });
        document.querySelector(".club-container").innerHTML = matchHTML;
        document.querySelector(
          ".competition-name"
        ).innerText = `${data.competition.name}`;

        resolve([data, teams]);
      });
  });
}

function getSavedMatchById() {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  Promise.all([getMatchById(idParam), getTeamById(idParam)])
    .then(([match, teams]) => {
      let matchHTML = "";
      const weeklyLeague = match.matches.filter((match) => {
        const date = new Date(
          match.utcDate.replace("T", " ").replace(/-/g, "/")
        );
        let [start, end] = getWeek();
        return +date >= +start && +date < +end;
      });

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      const time = {
        hour: "numeric",
        minute: "numeric",
        timeZone: "Asia/Jakarta",
      };

      weeklyLeague.forEach((match) => {
        const date = new Date(
          match.utcDate.replace("T", " ").replace(/-/g, "/")
        );

        matchHTML += `
            <div class="match">
                  <span class="match-date">${new Intl.DateTimeFormat(
                    "en-US",
                    options
                  ).format(date)}</span>
                  <span class="match-time">${new Intl.DateTimeFormat(
                    "en-US",
                    time
                  ).format(date)} WIB</span>
                  <div class="club-info">
                    <div class="club">
                      <span class="club-name">${match.homeTeam.name}</span>
                      <img class="img-match" src="${teams.teams
                        .filter((team) => {
                          return team.name === match.homeTeam.name;
                        })
                        .map((t) => t.crestUrl)}" />
                    </div>
                    <span class="versus">VS</span>
                    <div class="club">
                      <img class="img-match" src="${teams.teams
                        .filter((team) => {
                          return team.name === match.awayTeam.name;
                        })
                        .map((t) => t.crestUrl)}" />
                        <span class="club-name">${match.awayTeam.name}</span>
                    </div>
                  </div>
                </div>
          `;
      });
      document.querySelector(".club-container").innerHTML = matchHTML;
      document.querySelector(
        ".competition-name"
      ).innerText = `${match.competition.name}`;
    })
    .catch((err) => console.log(err));
}

function getStandings(id) {
  const urlParams = new URLSearchParams(window.location.search);
  const idParam = urlParams.get("id");
  return new Promise((resolve, reject) => {
    if ("caches" in window) {
      caches
        .match(`${base_url}/competitions/${idParam}/standings`)
        .then((res) => {
          if (res) {
            res.json().then((data) => {
              let standingHTML = "";
              let headerHTML = "";
              if (data.competition.id == "2001") {
                const standingTotal = data.standings.filter(
                  (standing) => standing.type == "TOTAL"
                );

                standingTotal.forEach((standing) => {
                  headerHTML += `
            <span class="group-name">${standing.group}</span>
            <table class="highlight">
              <thead>
                <tr>
                    <th class="club-title">Klub</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>GM</th>
                    <th>GA</th>
                    <th>SG</th>
                    <th>Poin</th>
                    <th>Past 5 Games</th>
                </tr>
              </thead>
              <tbody class="standings">
      
              </tbody>
            </table>
            `;
                });
                document.querySelector(".group-wrapper").innerHTML = headerHTML;

                standingTotal.map((standing, index) => {
                  standingHTML = standing.table.map((group) => {
                    return `
                  <tr>
                    <td class="club-list">
                    <div class="club-standing">
                        <span class="number">${group.position}. </span>
                        <img class="img-club" src="${group.team.crestUrl}" alt="klub">
                        <span class="standing=name">${group.team.name}</span>
                    </div>
                    </td>
                    <td>${group.playedGames}</td>
                    <td>${group.won}</td>
                    <td>${group.draw}</td>
                    <td>${group.lost}</td>
                    <td>${group.goalsFor}</td>
                    <td>${group.goalsAgainst}</td>
                    <td>${group.goalDifference}</td>
                    <td>${group.points}</td>
                    <td>${group.form}</td>
                </tr>
              `;
                  });
                });

                document.querySelectorAll(".standings").forEach((standing) => {
                  standing.innerHTML = standingHTML;
                });
              } else {
                headerHTML = `
            <table class="highlight">
              <thead class="club-header">
                <tr>
                    <th class="club-title">Klub</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>GM</th>
                    <th>GA</th>
                    <th>SG</th>
                    <th>Poin</th>
                    <th>Past 5 Games</th>
                </tr>
              </thead>
              <tbody class="standings">
      
              </tbody>
            </table>
            `;
                data.standings[0].table.forEach((standing) => {
                  standingHTML += `
            <tr>
                <td class="club-list">
                    <div class="club-standing">
                        <span class="number">${standing.position}</span>
                        <img class="img-club" src="${standing.team.crestUrl}" alt="klub">
                        <span class="standing=name">${standing.team.name}</span>
                    </div>
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
                <td>${standing.form}</td>
            </tr>
          `;
                });
                document.querySelector(".group-wrapper").innerHTML = headerHTML;
                document.querySelector(".standings").innerHTML = standingHTML;
              }

              document.querySelector(
                ".competition-name"
              ).innerText = `${data.competition.name}`;
              // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
              resolve(data);
            });
          }
        });
    }

    fetch(`${base_url}/competitions/${id ? id : "2021"}/standings`, config)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        let standingHTML = "";
        let headerHTML = "";
        if (data.competition.id == "2001") {
          const standingTotal = data.standings.filter(
            (standing) => standing.type == "TOTAL"
          );

          standingTotal.forEach((standing) => {
            headerHTML += `
            <span class="group-name">${standing.group}</span>
            <table class="highlight">
              <thead>
                <tr>
                    <th class="club-title">Klub</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>GM</th>
                    <th>GA</th>
                    <th>SG</th>
                    <th>Poin</th>
                    <th>Past 5 Games</th>
                </tr>
              </thead>
              <tbody class="standings">
      
              </tbody>
            </table>
            `;
          });
          document.querySelector(".group-wrapper").innerHTML = headerHTML;

          standingTotal.map((standing, index) => {
            standingHTML = standing.table.map((group) => {
              return `
                  <tr>
                    <td class="club-list">
                    <div class="club-standing">
                        <span class="number">${group.position}. </span>
                        <img class="img-club" src="${group.team.crestUrl}" alt="klub">
                        <span class="standing=name">${group.team.name}</span>
                    </div>
                    </td>
                    <td>${group.playedGames}</td>
                    <td>${group.won}</td>
                    <td>${group.draw}</td>
                    <td>${group.lost}</td>
                    <td>${group.goalsFor}</td>
                    <td>${group.goalsAgainst}</td>
                    <td>${group.goalDifference}</td>
                    <td>${group.points}</td>
                    <td>${group.form}</td>
                </tr>
              `;
            });
          });

          document.querySelectorAll(".standings").forEach((standing) => {
            standing.innerHTML = standingHTML;
          });
        } else {
          headerHTML = `
            <table class="highlight">
              <thead class="club-header">
                <tr>
                    <th class="club-title">Klub</th>
                    <th>M</th>
                    <th>M</th>
                    <th>S</th>
                    <th>K</th>
                    <th>GM</th>
                    <th>GA</th>
                    <th>SG</th>
                    <th>Poin</th>
                    <th>Past 5 Games</th>
                </tr>
              </thead>
              <tbody class="standings">
      
              </tbody>
            </table>
            `;
          data.standings[0].table.forEach((standing) => {
            standingHTML += `
            <tr>
                <td class="club-list">
                    <div class="club-standing">
                        <span class="number">${standing.position}</span>
                        <img class="img-club" src="${standing.team.crestUrl}" alt="klub">
                        <span class="standing=name">${standing.team.name}</span>
                    </div>
                </td>
                <td>${standing.playedGames}</td>
                <td>${standing.won}</td>
                <td>${standing.draw}</td>
                <td>${standing.lost}</td>
                <td>${standing.goalsFor}</td>
                <td>${standing.goalsAgainst}</td>
                <td>${standing.goalDifference}</td>
                <td>${standing.points}</td>
                <td>${standing.form}</td>
            </tr>
          `;
          });
          document.querySelector(".group-wrapper").innerHTML = headerHTML;
          document.querySelector(".standings").innerHTML = standingHTML;
        }

        document.querySelector(
          ".competition-name"
        ).innerText = `${data.competition.name}`;
        resolve(data);
      });
  });
}
