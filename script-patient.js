document.addEventListener("DOMContentLoaded", () => {
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  const btnReserve = document.getElementById("btnReserve");
  const nomInput = document.getElementById("nom");
  const telInput = document.getElementById("tel");
  const remainingSpan = document.getElementById("remaining");

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
      
      const numero = snapshot.numChildren() + 1; // رقم الحجز
      const avant = snapshot.numChildren();       // عدد المرضى قبله

      ref.push({
        nom,
        tel,
        numero,
        date: new Date().toLocaleDateString("fr-FR")
      });

      alert(`Rendez-vous réservé !\nVotre numéro: ${numero}\nNombre de patients avant vous: ${avant}`);

      nomInput.value = "";
      telInput.value = "";
    });
  });
});


