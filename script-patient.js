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

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const ref = db.ref("rendezvous");

  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const infoReservation = document.getElementById("infoReservation");

  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();
    if (!nom || !tel) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

    // Ajouter le rendez-vous
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1;
      const date = new Date().toLocaleDateString("fr-FR");

      ref.push({ nom, tel, numero, date, checked: false });

      // Affichage immédiat du numéro et des patients avant vous
      const totalAvant = snapshot.numChildren(); // patients avant ajout
      infoReservation.textContent = `✅ Votre numéro de rendez-vous : ${numero}. Patients avant vous : ${totalAvant}`;

      nomInput.value = "";
      telInput.value = "";
    });
  });
});
