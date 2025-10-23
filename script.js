import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// ⚙️ Config do teu Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDOcf7FcetuH2sENUikQ70wlnB6tvMkquk",
  authDomain: "hogtwars-ricardoamb.firebaseapp.com",
  databaseURL: "https://hogtwars-ricardoamb-default-rtdb.firebaseio.com",
  projectId: "hogtwars-ricardoamb",
  storageBucket: "hogtwars-ricardoamb.firebasestorage.app",
  messagingSenderId: "826195686831",
  appId: "1:826195686831:web:c69c00534f43b41ac2ab5a",
  measurementId: "G-WBBD067F9X"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const casas = ["grifinoria", "sonserina", "lufa-lufa", "corvinal"];

// Se for a página do placar (index)
if (document.title.includes("Placar")) {
  casas.forEach((casa) => {
    const ref = doc(db, "casas", casa);
    onSnapshot(ref, (snap) => {
      const pontos = snap.data().pontos;
      document.querySelector(`#${casa} p`).textContent = pontos;
    });
  });
}

// Se for a página de admin
if (document.title.includes("Administração")) {
  const senhaCorreta = "alohomora"; // 🔑 senha simples
  const btnEntrar = document.getElementById("entrar");
  const inputSenha = document.getElementById("senha");
  const painel = document.getElementById("painel");
  const containerCasas = document.getElementById("casas-admin");

  btnEntrar.addEventListener("click", () => {
    if (inputSenha.value === senhaCorreta) {
      document.getElementById("senha-container").style.display = "none";
      painel.style.display = "block";
      carregarPainel();
    } else {
      alert("Senha incorreta!");
    }
  });

  function carregarPainel() {
    casas.forEach(async (casa) => {
      const ref = doc(db, "casas", casa);
      const snap = await getDoc(ref);
      const pontos = snap.data().pontos;

      const div = document.createElement("div");
      div.className = "casa";
      div.innerHTML = `
        <h2>${casa.toUpperCase()}</h2>
        <p id="${casa}-pontos">${pontos}</p>
        <div>
          <button data-casa="${casa}" data-valor="-10">-10</button>
          <button data-casa="${casa}" data-valor="-5">-5</button>
          <button data-casa="${casa}" data-valor="-1">-1</button>
          <button data-casa="${casa}" data-valor="1">+1</button>
          <button data-casa="${casa}" data-valor="5">+5</button>
          <button data-casa="${casa}" data-valor="10">+10</button>
        </div>
      `;
      containerCasas.appendChild(div);

      onSnapshot(ref, (snapAtualizado) => {
        document.getElementById(`${casa}-pontos`).textContent =
          snapAtualizado.data().pontos;
      });
    });

    containerCasas.addEventListener("click", async (e) => {
      if (e.target.tagName === "BUTTON") {
        const casa = e.target.dataset.casa;
        const valor = parseInt(e.target.dataset.valor);
        const ref = doc(db, "casas", casa);
        const snap = await getDoc(ref);
        const pontosAtuais = snap.data().pontos;
        await updateDoc(ref, { pontos: pontosAtuais + valor });
      }
    });
  }
}
