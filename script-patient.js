window.addEventListener("load", () => {
  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const infoReservation = document.getElementById("infoReservation");

  if (!firebase.apps.length) {
    alert("Erreur : Firebase n'est pas initialisé.");
    return;
  }

  const db = firebase.database();

  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();

    if (!nom || !tel) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const rdvRef = db.ref("rendezvous");

    rdvRef.once("value").then(snapshot => {
      const total = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      const numero = total + 1;
      const date = new Date().toLocaleDateString("fr-FR");

      // Enregistrer le rendez-vous
      rdvRef.push({ nom, tel, numero, date, etat: "en attente" });

      // Calcul du nombre de patients avant le patient actuel
      const remaining = total; // car total avant ajout = patients avant toi

      infoReservation.innerHTML = `
        ✅ Votre numéro de rendez-vous : <b>${numero}</b><br>
        🧍‍♂️ Patients avant vous : <b>${remaining}</b>
      `;

      nomInput.value = "";
      telInput.value = "";
    })
    .catch(error => {
      console.error("Erreur Firebase:", error);
      alert("Une erreur est survenue. Réessayez plus tard.");
    });
  });
});
