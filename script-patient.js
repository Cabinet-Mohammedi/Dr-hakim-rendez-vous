const btnReserve = document.getElementById("btnReserve");
const nomInput = document.getElementById("nom");
const telInput = document.getElementById("tel");
const infoReservation = document.getElementById("infoReservation");

// Firebase déjà initialisé dans firebase-config.js
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

    rdvRef.push({ nom, tel, numero, date });

    alert(`Votre numéro de rendez-vous : ${numero}\nPatients avant vous : ${total}`);

    nomInput.value = "";
    telInput.value = "";
  });
});
