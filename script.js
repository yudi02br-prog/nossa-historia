// ======================================================
// LINK ÚNICO POR CASAL
// ======================================================
const params = new URLSearchParams(window.location.search);
const casalId = params.get("casal") || "default";
const storageKey = key => `${casalId}_${key}`;

// ======================================================
// SITE 1 — CRIAÇÃO DO PRESENTE
// ======================================================
const btnConcluir = document.getElementById("concluir");

if (btnConcluir) {
  btnConcluir.onclick = () => {
    const frase = document.getElementById("frase").value.trim();
    const dataInicio = document.getElementById("dataInicio").value;
    const senha = document.getElementById("senha").value;
    const imagens = document.getElementById("imagens").files;

    if (!frase || !dataInicio || !senha || imagens.length === 0) {
      alert("Preencha todos os campos ❤️");
      return;
    }

    const fotos = [];

    Array.from(imagens).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        fotos.push(reader.result);

        if (fotos.length === imagens.length) {
          localStorage.setItem(storageKey("frase"), frase);
          localStorage.setItem(storageKey("dataInicio"), dataInicio);
          localStorage.setItem(storageKey("senha"), senha);
          localStorage.setItem(storageKey("fotos"), JSON.stringify(fotos));

          window.location.href = `result.html?casal=${casalId}`;
        }
      };
      reader.readAsDataURL(file);
    });
  };
}

// ======================================================
// SITE 2 — RESULTADO FINAL (DOM READY)
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  const fraseFinal = document.getElementById("fraseFinal");
  if (!fraseFinal) return;

  const abertura   = document.getElementById("abertura");
  const telaSenha  = document.getElementById("telaSenha");
  const conteudo   = document.getElementById("conteudo");
  const btnSenha   = document.getElementById("btnSenha");
  const senhaSalva = localStorage.getItem(storageKey("senha"));

  // ======================================================
  // ABERTURA + DELAY DA TELA DE SENHA
  // ======================================================
  if (abertura && telaSenha) {
    telaSenha.style.display = "none";
    conteudo.style.display = "none";

    // mostra a tela de senha após 1s
    setTimeout(() => {
      telaSenha.style.display = "block";
    }, 1000);

    // remove a abertura suavemente
    setTimeout(() => {
      abertura.style.opacity = "0";
      setTimeout(() => abertura.remove(), 1500);
    }, 2500);
  }

  // ======================================================
  // VALIDAÇÃO DE SENHA
  // ======================================================
  btnSenha.onclick = () => {
    const digitada = document.getElementById("senhaInput").value;

    if (digitada === senhaSalva) {
      telaSenha.style.display = "none";
      conteudo.style.display = "block";
    } else {
      alert("Senha incorreta 💔");
    }
  };

  // ======================================================
  // DADOS DO CASAL
  // ======================================================
  const frase = localStorage.getItem(storageKey("frase"));
  const dataInicio = new Date(localStorage.getItem(storageKey("dataInicio")));
  const fotos = JSON.parse(localStorage.getItem(storageKey("fotos"))) || [];

  fraseFinal.innerText = frase;

  // ======================================================
  // CONTADOR DE TEMPO (INTELIGENTE)
  // ======================================================
  function atualizarTempo() {
    const diff = new Date() - dataInicio;

    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const anos = Math.floor(d / 365);
    const restoAno = d % 365;
    const meses = Math.floor(restoAno / 30);
    const dias = restoAno % 30;

    let texto = "Estamos juntos há ";

    if (anos > 0) texto += `${anos} ano${anos > 1 ? "s" : ""}, `;
    if (meses > 0) texto += `${meses} mes${meses > 1 ? "es" : ""}, `;

    texto += `${dias} dias, `;
    texto += `${String(h % 24).padStart(2, "0")}h `;
    texto += `${String(m % 60).padStart(2, "0")}m `;
    texto += `${String(s % 60).padStart(2, "0")}s ❤️`;

    document.getElementById("tempo").innerText = texto;
  }

  atualizarTempo();
  setInterval(atualizarTempo, 1000);

  // ======================================================
  // CARROSSEL (AUTO + MANUAL) COM ZOOM + KEN BURNS
  // ======================================================
  let index = 0;

  const frasesAuto = [
    "Mais um momento inesquecível ❤️",
    "Um capítulo da nossa história 💜",
    "Um amor que só cresce ✨",
    "Memórias que guardo no coração 💫"
  ];

  const imgAtual = document.getElementById("imgAtual");
  const fraseImagem = document.getElementById("fraseImagem");

  function render() {
    imgAtual.classList.remove("zoom", "kenburns");

    setTimeout(() => {
      imgAtual.src = fotos[index];
      fraseImagem.innerText = frasesAuto[index % frasesAuto.length];

      imgAtual.classList.add("zoom");
      imgAtual.classList.add("kenburns");
    }, 120);
  }

  function avancar() {
    index = (index + 1) % fotos.length;
    render();
  }

  document.getElementById("prev").onclick = () => {
    index = (index - 1 + fotos.length) % fotos.length;
    render();
  };

  document.getElementById("next").onclick = avancar;

  render();
  setInterval(avancar, 4000);
});
