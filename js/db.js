const dbMatchPromised = idb.open("match-schedule", 1, (upgradeDb) => {
  const matchesObjectStore = upgradeDb.createObjectStore("matches", {
    keyPath: "competition.id",
  });
  matchesObjectStore.createIndex("competition.name", "competition.name", {
    unique: false,
  });

  const teamsObjectStore = upgradeDb.createObjectStore("teams", {
    keyPath: "competition.id",
  });
  teamsObjectStore.createIndex("competition.name", "competition.name", {
    unique: false,
  });

  const standingsObjectStore = upgradeDb.createObjectStore("standings", {
    keyPath: "competition.id",
  });
  standingsObjectStore.createIndex("competition.name", "competition.name", {
    unique: false,
  });
});

// Save

function saveMatch(match) {
  dbMatchPromised
    .then((db) => {
      const tx = db.transaction("matches", "readwrite");
      const store = tx.objectStore("matches");
      console.log(match);
      store.add(match);
      return tx.complete;
    })
    .then(() => {
      console.log("Match berhasil di simpan");
    });
}

function saveTeam(team) {
  dbMatchPromised
    .then((db) => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.add(team);
      return tx.complete;
    })
    .then(() => {
      console.log("Team berhasil di simpan");
    });
}
// Delete

function deleteMatch(match) {
  dbMatchPromised
    .then((db) => {
      const tx = db.transaction("matches", "readwrite");
      const store = tx.objectStore("matches");
      console.log(match);
      store.delete(parseInt(match));
      return tx.complete;
    })
    .then(() => {
      console.log("Match berhasil di hapus");
    });
}

function deleteTeam(team) {
  dbMatchPromised
    .then((db) => {
      const tx = db.transaction("teams", "readwrite");
      const store = tx.objectStore("teams");
      store.delete(parseInt(team));
      return tx.complete;
    })
    .then(() => {
      console.log("Team berhasil di hapus");
    });
}

// Show

function getAll() {
  return new Promise((resolve, reject) => {
    dbMatchPromised
      .then((db) => {
        const tx = db.transaction("matches", "readonly");
        const store = tx.objectStore("matches");
        return store.getAll();
      })
      .then((match) => {
        resolve(match);
      });
  });
}

function getMatchById(id) {
  return new Promise((resolve, reject) => {
    dbMatchPromised
      .then((db) => {
        const tx = db.transaction("matches", "readonly");
        const store = tx.objectStore("matches");
        return store.get(parseInt(id));
      })
      .then((match) => {
        resolve(match);
      });
  });
}

function getTeamById(id) {
  return new Promise((resolve, reject) => {
    dbMatchPromised
      .then((db) => {
        const tx = db.transaction("teams", "readonly");
        const store = tx.objectStore("teams");
        return store.get(parseInt(id));
      })
      .then((teams) => {
        resolve(teams);
      });
  });
}
