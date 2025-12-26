// ===== SITE 1 =====
const btnConcluir = document.getElementById("concluir");

if (btnConcluir) {
  btnConcluir.addEventListener("click", () => {
    const frase = document.getElementById("frase").value;
    const dataInicio = document.getElementById("dataInicio").value;
    const imagens = document.getElementById("imagens").files;

    if (!frase || !dataInicio || imagens.length === 0) return;

    const fotos = [];

    Array.from(imagens).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        fotos.push(reader.result);

        if (fotos.length === imagens.length) {
          localStorage.setItem("frase", frase);
          localStorage.setItem("dataInicio", dataInicio);
          localStorage.setItem("fotos", JSON.stringify(fotos));
          window.location.href = "result.html";
        }
      };
      reader.readAsDataURL(file);
    });
  });
}

// ===== SITE 2 =====
const fraseFinal = document.getElementById("fraseFinal");

if (fraseFinal) {
  const frase = localStorage.getItem("frase");
  const dataInicio = new Date(localStorage.getItem("dataInicio"));
  const fotos = JSON.parse(localStorage.getItem("fotos"));

  fraseFinal.innerText = frase;

  // tempo namoro
  const hoje = new Date();
  const dias = Math.floor((hoje - dataInicio) / (1000 * 60 * 60 * 24));
  document.getElementById("tempo").innerText =
    `Estamos juntos há ${dias} dias ❤️`;

  // carrossel
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
