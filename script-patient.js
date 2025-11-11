import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";
import { db } from "./firebase-config.js";

const btnReserve = document.getElementById("btnReserve");
const nomInput = document.getElementById("nomPatient");
const telInput = document.getElementById("telPatient");
const infoReservation = document.getElementById("infoReservation");

btnReserve.addEventListener("click", () => {
  const nom = nomInput.value.trim();
  const tel = telInput.value.trim();

  if (!nom || !tel) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const rdvRef = ref(db, "rendezvous");

  onValue(
    rdvRef,
    (snapshot) => {
      const total = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
      const numero = total + 1;
      const date = new Date().toLocaleDateString("fr-FR");

      push(rdvRef, { nom, tel, numero, date });

      infoReservation.textContent = `Votre numéro de rendez-vous : ${numero}. Nombre de patients avant vous : ${total}`;
    },
    { onlyOnce: true }
  );

  // Réinitialiser les champs
  nomInput.value = "";
  telInput.value = "";
});

});


