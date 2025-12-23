document.addEventListener("DOMContentLoaded", () => {
  
  const btnLogin = document.getElementById("btnLogin");
  const emailInput = document.getElementById("emailMedecin");
  const mdpInput = document.getElementById("mdpMedecin");
  const loginCard = document.getElementById("loginCard");
  const loginError = document.getElementById("loginError");
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");

  const medContent = document.getElementById("medContent");
  const btnLogout = document.getElementById("btnLogout");
  
  const nomAdd = document.getElementById("nomAdd");
  const telAdd = document.getElementById("telAdd");
  const btnAdd = document.getElementById("btnAdd");
  const rdvTableBody = document.getElementById("rdvTable") ? document.getElementById("rdvTable").querySelector("tbody") : null;
  const remainingSpan = document.getElementById("remaining");

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();
  const auth = firebase.auth(); 

  auth.onAuthStateChanged((user) => {

    if (loginCard && medContent) {
        if (user) {

            loginCard.style.display = "none";
            medContent.style.display = "block";
            afficherRendezVous();
        } else {
            loginCard.style.display = "block";
            medContent.style.display = "none";
            if (rdvTableBody) {
                rdvTableBody.innerHTML = "";
            }
        }
    }
  });

  if (btnLogin) { 
      btnLogin.addEventListener("click", () => {
          const email = emailInput.value.trim();
          const password = mdpInput.value.trim();

          if (!email || !password) {
              loginError.textContent = "Veuillez entrer l'adresse e-mail et le mot de passe";
              return;
          }

          auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
              loginError.textContent = ""; 
            })
            .catch((error) => {
              console.error("Login Error:", error.code, error.message);
              
              if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                   loginError.textContent = "L'email ou le mot de passe est incorrect";
              } else {
                   loginError.textContent = "Une erreur s'est produite lors de la connexion. Veuillez réessayer.";
              }
            });
      }); 
  }

  // 

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
        auth.signOut().then(() => {
            alert("Déconnexion réussie");
        }).catch((error) => {
            console.error("Logout Error:", error);
        });
    });
  }

  if (forgotPasswordLink) { 
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();

        const email = emailInput ? emailInput.value.trim() : ''; 

        if (!email) {
            alert("Veuillez d'abord saisir l'adresse e-mail dans le champ de connexion");
            return;
        }

        auth.sendPasswordResetEmail(email)
            .then(() => {
                alert(`Un lien de réinitialisation de mot de passe a été envoyé à l'e-mail ${email}.`);
            })
            .catch((error) => {
                console.error("Forgot Password Error:", error);
                alert("Une erreur s'est produite. Assurez-vous que l'e-mail est correct et enregistré.");
            });
    });
  }


  if (btnAdd) {
    btnAdd.addEventListener("click", () => {
      if (!auth.currentUser) { alert("Vous devez vous connecter d'abord pour ajouter un rendez-vous."); return; }

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
  }

  // === 5. Afficher les rendez-vous ===
  function afficherRendezVous() {
    if (!rdvTableBody) return; 

    const ref = db.ref("rendezvous");
    ref.on("value", snapshot => {
      rdvTableBody.innerHTML = "";
      let remaining = 0;

    
      snapshot.forEach(child => {
        const data = child.val();
        if (!data.checked) remaining++;

        const tr = document.createElement("tr");
        tr.style.background = data.checked ? "#f28b82" : "white";

        tr.innerHTML = `
          <td>${data.numero}</td>
          <td>${data.nom}</td>
          <td>${data.tel}</td>
          <td>${data.date}</td>
          <td>
            <button class="btn-check" data-id="${child.key}" style="background:green; color:white; margin-right:5px;">
              ✅
            </button>
            <button class="btn-delete" data-id="${child.key}" style="background:red; color:white;">🗑️</button>
          </td>
        `;
        rdvTableBody.appendChild(tr);
      });

      if(remainingSpan) {
        remainingSpan.textContent = remaining;
      }

      // === Bouton toggle "tem découverte" ===
      document.querySelectorAll(".btn-check").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.currentTarget.getAttribute("data-id");
          const refPatient = db.ref("rendezvous/" + id);

          refPatient.once("value").then(snap => {
            const current = snap.val().checked;
            refPatient.update({ checked: !current }); 
          });
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

