document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.code === "KeyE") {
    e.preventDefault();
    console.log("Atalho acionado!");
    import("./modules/botaoAcionador.js")
      .then((module) => module.verificarERodarModulo())
      .catch((err) => {
        console.error("Falha ao carregar módulo:", err);
      });
  }
});

// Menu do Tampermonkey (precisa existir no contexto do userscript)
if (typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand("Mostrar Toast EXBR", mostrarToastInstrucao);
}

// === Toast flutuante ===
function mostrarToastInstrucao() {
  const existing = document.getElementById("exbr-toast");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "exbr-toast";
  div.innerHTML = `
      <button aria-label="Fechar" title="Fechar" style="...">×</button>
      <div><strong>Extensão carregada</strong></div>
      <div>Funciona apenas nas páginas permitidas.</div>
    `;

  Object.assign(div.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "14px 18px",
    background: "rgba(25,25,25,0.95)",
    color: "#f1f1f1",
    borderRadius: "12px",
    zIndex: "2147483647",
    opacity: "0",
    transition: "opacity .3s ease",
  });

  document.body.appendChild(div);

  requestAnimationFrame(() => {
    div.style.opacity = "1";
  });

  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 300);
  }, 5000);
}

// Mostrar toast no carregamento inicial
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mostrarToastInstrucao);
} else {
  mostrarToastInstrucao();
}
