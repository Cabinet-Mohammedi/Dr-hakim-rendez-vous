document.addEventListener("DOMContentLoaded", () => {
  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const numeroSpan = document.getElementById("numeroPatient");
  const rdvTable = document.getElementById("rdvTable").querySelector("tbody");
  const restantSpan = document.getElementById("restant"); // عنصر لإظهار عدد المتبقي
  const remainingSpan = document.getElementById("remaining");

    // === Initialisation Firebase ===
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();


  btnReserve.addEventListener("click", () => {
    const nom = nomInput.value.trim();
    const tel = telInput.value.trim();

    if (!nom || !tel) {
      alert("Veuillez remplir tous les champs !");
      return;
    }

   const ref = db.ref("rendezvous");
    ref.once("value").then(snapshot => {
      let remaining = 0;
      snapshot.forEach(child => {
        if (!child.val().checked) remaining++; // فقط المرضى الغير مكتملين
      });

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

      numeroSpan.textContent = numero;       // رقم الحجز
      restantSpan.textContent = remaining;   // عدد المرضى قبله
    });
  });
});







