document.addEventListener("DOMContentLoaded", () => {

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

  const btnChangePwd = document.getElementById("btnChangePwd");

  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // تسجيل الدخول
  btnLogin.addEventListener("click", () => {
    db.ref("medecin/password").once("value").then(snapshot => {
      const savedPwd = snapshot.val() || "docteur123";
      if (mdpInput.value.trim() === savedPwd) {
        loginCard.style.display = "none";
        medContent.style.display = "block";
        afficherRendezVous();
      } else {
        loginError.textContent = "Mot de passe incorrect !";
      }
    });
  });

  // تغيير كلمة المرور
  btnChangePwd.addEventListener("click", () => {
    db.ref("medecin/password").once("value").then(snapshot => {
      const currentPwd = snapshot.val() || "docteur123";
      const ancien = prompt("أدخل كلمة المرور الحالية:");
      if (ancien !== currentPwd) { alert("❌ كلمة المرور الحالية غير صحيحة"); return; }
      const nouveau = prompt("أدخل كلمة المرور الجديدة:");
      if (!nouveau || nouveau.trim() === "") { alert("❌ كلمة المرور الجديدة غير صالحة"); return; }
      db.ref("medecin/password").set(nouveau).then(() => {
        alert("✔️ تم تغيير كلمة المرور بنجاح!");
      });
    });
  });

  // إضافة وحذف وعرض المواعيد كما في الكود السابق
  const btnAddHandler = () => {
    const nom = nomAdd.value.trim();
    const tel = telAdd.value.trim();
    if (!nom || !tel) { alert("Veuillez remplir tous les champs !"); return; }
    const ref = db.ref("rendezvous");
    ref.once("value").then(snapshot => {
      const numero = snapshot.numChildren() + 1;
      ref.push({ nom, tel, numero, date: new Date().toLocaleDateString("fr-FR"), checked: false });
      nomAdd.value = "";
      telAdd.value = "";
    });
  };
  btnAdd.addEventListener("click", btnAddHandler);

  function afficherRendezVous() {
    const ref = db.ref("rendezvous");
    ref.on("value", snapshot => {
      rdvTable.innerHTML = "";
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
            <button class="btn-check" data-id="${child.key}" style="background:green;color:white;margin-right:5px;">✔</button>
            <button class="btn-delete" data-id="${child.key}" style="background:red;color:white;">🗑️</button>
          </td>
        `;
        rdvTable.appendChild(tr);
      });
      remainingSpan.textContent = remaining;

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

      document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", e => {
          const id = e.currentTarget.getAttribute("data-id");
          db.ref("rendezvous/" + id).remove();
        });
      });
    });
  }

});
