// ======================================================
// CONFIGURAÇÃO DE LINK ÚNICO (VERSÃO VENDÁVEL)
// ======================================================
const params = new URLSearchParams(window.location.search);
const casalId = params.get("casal") || "default";

// Helpers para LocalStorage isolado por casal
const storageKey = key => `${casalId}_${key}`;

// ======================================================
// SITE 1 — CRIAÇÃO DO PRESENTE
// ======================================================
const btnConcluir = document.getElementById("concluir");

if (btnConcluir) {
  btnConcluir.addEventListener("click", () => {
    const frase = document.getElementById("frase").value.trim();
    const dataInicio = document.getElementById("dataInicio").value;
    const senha = document.getElementById("senha").value;
    const imagens = document.getElementById("imagens").files;

    if (!frase || !dataInicio || !senha || imagens.length === 0) {
      alert("Preencha todos os campos antes de continuar ❤️");
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
  });
}

// ======================================================
// SITE 2 — RESULTADO FINAL
// ======================================================
const fraseFinal = document.getElementById("fraseFinal");

if (fraseFinal) {
  // ------------------
  // TELA DE SENHA
  // ------------------
  const telaSenha = document.getElementById("telaSenha");
  const conteudo = document.getElementById("conteudo");
  const btnSenha = document.getElementById("btnSenha");

  const senhaSalva = localStorage.getItem(storageKey("senha"));

  btnSenha.onclick = () => {
    const senhaDigitada = document.getElementById("senhaInput").value;

    if (senhaDigitada === senhaSalva) {
      telaSenha.style.display = "none";
      conteudo.style.display = "block";
    } else {
      alert("Senha incorreta 💔");
    }
  };

  // ------------------
  // ANIMAÇÃO DE ABERTURA
  // ------------------
  const abertura = document.getElementById("abertura");
  if (abertura) {
    setTimeout(() => {
      abertura.style.display = "none";
    }, 4000);
  }

  // ------------------
  // DADOS DO CASAL
  // ------------------
  const frase = localStorage.getItem(storageKey("frase"));
  const dataInicio = new Date(localStorage.getItem(storageKey("dataInicio")));
  const fotos = JSON.parse(localStorage.getItem(storageKey("fotos"))) || [];

  fraseFinal.innerText = frase;

  const hoje = new Date();
  const dias = Math.floor((hoje - dataInicio) / (1000 * 60 * 60 * 24));
  document.getElementById("tempo").innerText =
    `Estamos juntos há ${dias} dias ❤️`;

  // ------------------
  // CARROSSEL
  // ------------------
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
    imgAtual.src = fotos[index];
    fraseImagem.innerText = frasesAuto[index % frasesAuto.length];
  }

  document.getElementById("prev").onclick = () => {
    index = (index - 1 + fotos.length) % fotos.length;
    render();
  };

  document.getElementById("next").onclick = () => {
    index = (index + 1) % fotos.length;
    render();
  };

  render();
}
