document.addEventListener("DOMContentLoaded", () => {
  // === Configuration Firebase ===
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

  // === Initialisation Firebase ===
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const refRdv = db.ref("rendezvous");

  // === Sélection des éléments ===
  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const infoReservation = document.getElementById("infoReservation");

  // === Lors de la réservation ===
  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();

    if (!nom || !tel) {
      alert("⚠️ Veuillez remplir tous les champs !");
      return;
    }

    // Vérifier si ce patient a déjà réservé
    refRdv.once("value").then(snapshot => {
      const data = snapshot.val() || {};
      const deja = Object.values(data).find(p => p.tel === tel);

      if (deja) {
        infoReservation.textContent = `🩺 Vous êtes déjà enregistré avec le numéro ${deja.numero}.`;
        // Démarrer le suivi en direct
        surveillerPosition(tel);
        return;
      }

      // Créer un nouveau rendez-vous
      const numero = snapshot.numChildren() + 1;
      const date = new Date().toLocaleDateString("fr-FR");
      refRdv.push({ nom, tel, numero, date, checked: false });

      infoReservation.textContent = `✅ Votre numéro : ${numero}. Patients avant vous : ${numero - 1}`;
      nomInput.value = "";
      telInput.value = "";

      // Démarrer le suivi automatique
      surveillerPosition(tel);
    });
  });

  // === Fonction : Suivre la position du patient en direct ===
  function surveillerPosition(tel) {
    refRdv.on("value", snapshot => {
      if (!snapshot.exists()) return;

      const data = Object.values(snapshot.val()).sort((a, b) => a.numero - b.numero);

      // Liste des patients non encore traités
      const enAttente = data.filter(d => !d.checked);
      const patient = data.find(d => d.tel === tel);

      if (!patient) return;

      // Position du patient parmi ceux en attente
      const position = enAttente.findIndex(d => d.tel === tel);

      if (position === -1) {
        infoReservation.textContent = "👨‍⚕️ Votre consultation est terminée.";
      } else if (position === 0) {
        infoReservation.textContent = "🩺 C'est votre tour ! Veuillez vous présenter.";
      } else {
        infoReservation.textContent = `⏳ Il reste ${position} patient(s) avant vous.`;
      }
    });
  }
});
