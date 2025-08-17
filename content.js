// Importa o módulo principal
import("./modules/botaoAcionador.js")
  .then((module) => module.verificarERodarModulo())
  .catch((err) => {
    console.error("Falha ao carregar módulo:", err);
  });
