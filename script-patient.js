document.addEventListener("DOMContentLoaded", () => {
  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nomPatient");
  const telInput = document.getElementById("telPatient");
  const numeroSpan = document.getElementById("numeroPatient");

  // === Initialisation Firebase ===
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // === Ajouter un rendez-vous ===
  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();

    if (!nom || !tel) { 
      alert("Veuillez remplir tous les champs !");
      return; 
    }

    const ref = db.ref("rendezvous");
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1; // رقم المريض الجديد
      ref.push({
        nom,
        tel,
        numero,
        date: new Date().toLocaleDateString("fr-FR"),
        checked: false
      });

      nomInput.value = "";
      telInput.value = "";

      numeroSpan.textContent = numero; // رقم الحجز فقط
    });
  });
});
