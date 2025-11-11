document.addEventListener("DOMContentLoaded", () => {
  // === Config Firebase (même que chez le médecin) ===
  const firebaseConfig = {
    apiKey: "AIzaSyBIrVOglgZALaaK6IwPwqHMiynBGD4Z3JM",
    authDomain: "mohammedi-cabinet.firebaseapp.com",
    databaseURL: "https://mohammedi-cabinet-default-rtdb.firebaseio.com",
    projectId: "mohammedi-cabinet",
    storageBucket: "mohammedi-cabinet.firebasestorage.app",
    messagingSenderId: "666383356275",
    appId: "1:666383356275:web:09de11f9dfa2451d843506",
    measurementId: "G-VT06BFXNP1"
  };

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const ref = db.ref("rendezvous");

  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const infoReservation = document.getElementById("infoReservation");

  // === Réserver un rendez-vous ===
  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();
    if (!nom || !tel) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // On compte combien existent déjà
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1;
      const date = new Date().toLocaleDateString("fr-FR");

      ref.push({
        nom,
        tel,
        numero,
        date,
        checked: false
      });

      infoReservation.textContent = `✅ Votre numéro de rendez-vous est ${numero}.`;
      nomInput.value = "";
      telInput.value = "";

      // Après la réservation, commencer à surveiller la position
      surveillerPosition(tel);
    });
  });

  // === Fonction pour suivre la position (remaining) ===
  function surveillerPosition(tel) {
    ref.on("value", snapshot => {
      if (!snapshot.exists()) {
        infoReservation.textContent = "Aucun rendez-vous trouvé.";
        return;
      }

      // Récupérer et trier par numéro
      const data = Object.values(snapshot.val()).sort((a, b) => a.numero - b.numero);

      // Filtrer les patients encore en attente (checked == false)
      const enAttente = data.filter(d => !d.checked);

      // Trouver le patient actuel
      const patient = data.find(d => d.tel === tel);

      if (!patient) {
        infoReservation.textContent = "Vous n'avez pas de rendez-vous.";
        return;
      }

      // Calculer combien avant lui
      const avant = enAttente.findIndex(d => d.tel === tel);

      if (avant === -1) {
        infoReservation.textContent = "👨‍⚕️ Votre tour est en cours ou déjà passé.";
      } else if (avant === 0) {
        infoReservation.textContent = "🩺 C'est votre tour ! Veuillez vous présenter.";
      } else {
        infoReservation.textContent = `⏳ Il reste ${avant} patient(s) avant vous.`;
      }
    });
  }
});
