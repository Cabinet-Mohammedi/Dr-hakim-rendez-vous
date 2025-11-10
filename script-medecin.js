document.addEventListener("DOMContentLoaded", () => {
  // === Sélection des éléments ===
  const btnLogin = document.getElementById("btnLogin");
  const mdpInput = document.getElementById("mdpMedecin");
  const loginCard = document.getElementById("loginCard");
  const medContent = document.getElementById("medContent");
  const loginError = document.getElementById("loginError");

  const nomAdd = document.getElementById("nomAdd");
  const telAdd = document.getElementById("telAdd");
  const btnAdd = document.getElementById("btnAdd");
  const rdvTable = document.getElementById("rdvTable").querySelector("tbody");
  const remainingSpan = document.getElementById("remaining");

  // === Initialisation Firebase ===
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // === Vérifier si mot de passe déjà sauvegardé ===
  if (localStorage.getItem("mdpMedecin") === "docteur123") {
    loginCard.style.display = "none";
    medContent.style.display = "block";
    afficherRendezVous();
  }

  // === Connexion médecin ===
  btnLogin.addEventListener("click", () => {
    if (mdpInput.value.trim() === "docteur123") {
      localStorage.setItem("mdpMedecin", "docteur123");
      loginCard.style.display = "none";
      medContent.style.display = "block";
      afficherRendezVous();
    } else {
      loginError.textContent = "Mot de passe incorrect !";
    }
  });

  // === Ajouter un rendez-vous ===
  btnAdd.addEventListener("click", () => {
    const nom = nomAdd.value.trim();
    const tel = telAdd.value.trim();

    if (!nom || !tel) { alert("Veuillez remplir tous les champs !"); return; }

    const ref = db.ref("rendezvous");
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1;
      ref.push({
        nom,
        tel,
        numero,
        date: new Date().toLocaleDateString("fr-FR"),
        checked: false
      });
      nomAdd.value = "";
      telAdd.value = "";
    });
  });

  // === Afficher les rendez-vous ===
  function afficherRendezVous() {
    const ref = db.ref("rendezvous");
    ref.on("value", snapshot => {
      rdvTable.innerHTML = "";
      let remaining = 0;

      snapshot.forEach(child => {
        const data = child.val();
        if (!data.checked) remaining++;

        const tr = document.createElement("tr");
        if (data.checked) tr.classList.add("checked");

        tr.innerHTML = `
          <td>${data.numero}</td>
          <td>${data.nom}</td>
          <td>${data.tel}</td>
          <td>${data.date}</td>
          <td>
            <button class="btn-check" data-id="${child.key}" ${data.checked ? "disabled" : ""}>✅</button>
            <button class="btn-delete" data-id="${child.key}">🗑️</button>
          </td>
        `;
        rdvTable.appendChild(tr);
      });

      remainingSpan.textContent = remaining;

      // === Bouton "tem découverte" ===
      document.querySelectorAll(".btn-check").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.currentTarget.getAttribute("data-id");
          db.ref("rendezvous/" + id).update({ checked: true });
        });
      });

      // === Bouton supprimer ===
      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.currentTarget.getAttribute("data-id");
          db.ref("rendezvous/" + id).remove();
        });
      });
    });
  }
});
