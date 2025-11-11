// Connexion Firebase (compat)
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
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const rdvRef = db.ref("rendezvous");

// Lorsqu’un patient valide son rendez-vous
document.getElementById("btnReserver").addEventListener("click", (e) => {
  e.preventDefault();

  const nom = document.getElementById("nom").value.trim();
  const tel = document.getElementById("tel").value.trim();
  const date = document.getElementById("date").value;

  if (!nom || !tel || !date) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  // On compte combien de rendez-vous sont déjà dans la base pour cette date
  rdvRef.orderByChild("date").equalTo(date).once("value", (snapshot) => {
    const total = snapshot.exists() ? snapshot.numChildren() : 0;
    const nouveauNumero = total + 1;

    const nouveauRdv = {
      nom,
      tel,
      date,
      numero: nouveauNumero,
      etat: "en attente"
    };

    rdvRef.push(nouveauRdv, (error) => {
      if (error) {
        alert("Erreur lors de l'enregistrement !");
      } else {
        alert("Rendez-vous enregistré avec succès !");
        document.getElementById("formRdv").reset();
      }
    });
  });
});

// Calcul du "remaining" pour le patient (en direct)
const remainingDiv = document.getElementById("remaining");

function surveillerRemaining(tel) {
  rdvRef.on("value", (snapshot) => {
    if (!snapshot.exists()) {
      remainingDiv.innerText = "Aucun rendez-vous trouvé.";
      return;
    }

    const all = Object.entries(snapshot.val())
      .map(([key, rdv]) => ({ key, ...rdv }))
      .filter(r => r.etat !== "terminé")
      .sort((a, b) => a.numero - b.numero);

    const patient = all.find(r => r.tel === tel);

    if (!patient) {
      remainingDiv.innerText = "Vous n'avez pas de rendez-vous en attente.";
      return;
    }

    const position = all.findIndex(r => r.tel === tel);
    remainingDiv.innerText = `🕐 Il reste ${position} patient(s) avant vous.`;
  });
}

// Permet au patient de vérifier sa position en entrant son numéro
document.getElementById("btnVerifier").addEventListener("click", () => {
  const tel = document.getElementById("telVerif").value.trim();
  if (!tel) {
    alert("Entrez votre numéro de téléphone !");
    return;
  }
  surveillerRemaining(tel);
});
