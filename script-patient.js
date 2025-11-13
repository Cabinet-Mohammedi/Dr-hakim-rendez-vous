document.addEventListener("DOMContentLoaded", () => {
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

  // Initialisation Firebase
  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const ref = db.ref("rendezvous");

  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const infoReservation = document.getElementById("infoReservation");

  // === Lors de la réservation ===
  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();
    if (!nom || !tel) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Compter combien existent déjà
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1;
      const totalAvant = snapshot.numChildren(); // avant ajout
      const date = new Date().toLocaleDateString("fr-FR");

      // Ajouter le patient
      ref.push({ nom, tel, numero, date, checked: false });

      // Afficher son numéro et le nombre avant lui
      infoReservation.textContent = `✅ Votre numéro de rendez-vous : ${numero}. Patients avant vous : ${totalAvant}`;

      nomInput.value = "";
      telInput.value = "";

      // Commencer à suivre le changement automatique
      surveillerPosition(tel);
    });
  });

  // === Suivi automatique des patients restants ===
  function surveillerPosition(tel) {
    ref.on("value", snapshot => {
      if (!snapshot.exists()) return;

      // Trier les rendez-vous par numéro croissant
      const data = Object.values(snapshot.val()).sort((a, b) => a.numero - b.numero);

      // Ne garder que ceux qui ne sont pas encore traités
      const enAttente = data.filter(d => !d.checked);

      // Trouver le patient actuel
      const patient = data.find(d => d.tel === tel);

      if (!patient) return;

      // Trouver sa position parmi les en attente
      const avant = enAttente.findIndex(d => d.tel === tel);

      if (avant === -1) {
        infoReservation.textContent = "👨‍⚕️ Votre tour est terminé ou en cours.";
      } else if (avant === 0) {
        infoReservation.textContent = "🩺 C'est votre tour ! Veuillez vous présenter.";
      } else {
        infoReservation.textContent = `⏳ Il reste ${avant} patient(s) avant vous.`;
      }
    });
  }
});
