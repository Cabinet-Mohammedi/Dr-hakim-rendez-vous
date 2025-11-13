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

  // === Lors du clic sur "Réserver" ===
  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();

    if (!nom || !tel) {
      infoReservation.textContent = "⚠️ Veuillez remplir tous les champs.";
      infoReservation.style.color = "red";
      return;
    }

    // Lecture des rendez-vous existants
    refRdv.once("value").then(snapshot => {
      const data = snapshot.val() || {};

      // Calcul du nombre total et du nombre non traités
      const total = Object.keys(data).length;
      const nonTraites = Object.values(data).filter(p => !p.checked).length;

      // Création du nouveau rendez-vous
      const numero = total + 1;
      const date = new Date().toLocaleDateString("fr-FR");

      refRdv.push({ nom, tel, numero, date, checked: false });

      // Affichage du message clair dans la page
      infoReservation.style.color = "green";
      infoReservation.style.marginTop = "10px";
      infoReservation.style.fontWeight = "bold";
      infoReservation.innerHTML = `
        ✅ Votre numéro est <strong>${numero}</strong>.<br>
        👥 Il reste <strong>${nonTraites}</strong> patient(s) avant vous.
      `;

      // Réinitialiser les champs
      nomInput.value = "";
      telInput.value = "";
    });
  });
});
