// ======================================================
// LINK ÚNICO POR CASAL
// ======================================================
const params = new URLSearchParams(window.location.search);
const casalId = params.get("casal") || "default";
const storageKey = key => `${casalId}_${key}`;

// ======================================================
// SITE 1 — CRIAÇÃO
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
// SITE 2 — RESULTADO
// ======================================================
const fraseFinal = document.getElementById("fraseFinal");

if (fraseFinal) {
  // SENHA
  const telaSenha = document.getElementById("telaSenha");
  const conteudo = document.getElementById("conteudo");
  const btnSenha = document.getElementById("btnSenha");
  const senhaSalva = localStorage.getItem(storageKey("senha"));

  btnSenha.onclick = () => {
    if (document.getElementById("senhaInput").value === senhaSalva) {
      telaSenha.style.display = "none";
      conteudo.style.display = "block";
    } else {
      alert("Senha incorreta 💔");
    }
  };

  // DADOS
  const frase = localStorage.getItem(storageKey("frase"));
  const dataInicio = new Date(localStorage.getItem(storageKey("dataInicio")));
  const fotos = JSON.parse(localStorage.getItem(storageKey("fotos"))) || [];

  fraseFinal.innerText = frase;

  // TEMPO EM TEMPO REAL
  function atualizarTempo() {
    const diff = new Date() - dataInicio;
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    const a = Math.floor(d / 365);

    document.getElementById("tempo").innerText =
      `Estamos juntos há ${a} anos, ${d % 365} dias, ` +
      `${String(h % 24).padStart(2,"0")}h ` +
      `${String(m % 60).padStart(2,"0")}m ` +
      `${String(s % 60).padStart(2,"0")}s ❤️`;
  }

  atualizarTempo();
  setInterval(atualizarTempo, 1000);

  // CARROSSEL SUAVE
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
    imgAtual.style.transform = "translateX(100%)";
    setTimeout(() => {
      imgAtual.src = fotos[index];
      fraseImagem.innerText = frasesAuto[index % frasesAuto.length];
      imgAtual.style.transform = "translateX(0)";
    }, 300);
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
}
