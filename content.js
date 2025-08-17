// Função para detectar se o Cloudflare ainda está verificando
function isCloudflareChecking() {
  return (
    document.body.classList.contains("cf-challenge") ||
    document.querySelector("#challenge-body-text") !== null ||
    document.querySelector("div[id^='cf-']") !== null
  );
}

// Espera até o Cloudflare liberar a página
function waitForCloudflareClear(callback) {
  const interval = setInterval(() => {
    if (!isCloudflareChecking()) {
      clearInterval(interval);
      callback();
    }
  }, 500); // checa a cada 0,5s
}

// Atalho de teclado: Ctrl+Shift+E
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

// Menu do Tampermonkey
if (typeof GM_registerMenuCommand !== "undefined") {
  GM_registerMenuCommand("Mostrar Toast EXBR", () => {
    waitForCloudflareClear(mostrarToastInstrucao);
  });
}

// === Toast flutuante (versão estilizada) ===
function mostrarToastInstrucao() {
  const existing = document.getElementById("exbr-toast");
  if (existing) existing.remove();

  const div = document.createElement("div");
  div.id = "exbr-toast";
  div.innerHTML = `
      <button aria-label="Fechar" title="Fechar" style="
        position:absolute;
        top:8px;
        right:10px;
        background:transparent;
        border:none;
        color:#bbb;
        font-size:16px;
        line-height:16px;
        cursor:pointer;
        padding:0;
      ">×</button>

      <div style="margin-bottom:6px;">
        <strong>Extensão carregada</strong>
      </div>

      <div style="font-size:13px; line-height:1.4; margin-bottom:8px; color:#ccc;">
        O script da extensão só funciona em:
        <br>
        ➝ <a href="https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b/central" class="toast-link">Central de ações</a>
        <br>
        ➝ <a href="https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b" class="toast-link">Geral</a>
      </div>

      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px;">⚡</span>
        <span><strong>Atalho para injetar o script:</strong><br> Pressione <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>E</kbd></span>
      </div>
    `;

  // Estilo container
  Object.assign(div.style, {
    position: "fixed",
    bottom: "20px",
    left: "20px",
    padding: "14px 18px",
    background: "rgba(25,25,25,0.95)",
    color: "#f1f1f1",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    fontSize: "14px",
    fontFamily: "Segoe UI, Arial, sans-serif",
    zIndex: "2147483647",
    boxShadow: "0 4px 12px rgba(0,0,0,0.6)",
    userSelect: "none",
    opacity: "0",
    transform: "translateY(8px)",
    transition: "opacity .3s ease, transform .3s ease",
  });

  document.body.appendChild(div);

  // Estiliza <kbd>
  div.querySelectorAll("kbd").forEach((kbd) => {
    Object.assign(kbd.style, {
      background: "#333",
      border: "1px solid #555",
      borderRadius: "4px",
      padding: "2px 6px",
      fontSize: "12px",
      fontWeight: "bold",
      boxShadow: "inset 0 -1px 0 rgba(0,0,0,0.5)",
    });
  });

  // Estiliza links
  div.querySelectorAll(".toast-link").forEach((a) => {
    Object.assign(a.style, {
      color: "#4dabf7",
      textDecoration: "none",
      fontWeight: "bold",
      cursor: "pointer",
    });
    a.addEventListener(
      "mouseenter",
      () => (a.style.textDecoration = "underline")
    );
    a.addEventListener("mouseleave", () => (a.style.textDecoration = "none"));
    a.addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = a.getAttribute("href");
    });
  });

  // Botão fechar
  const closeBtn = div.querySelector("button");
  closeBtn.addEventListener(
    "mouseenter",
    () => (closeBtn.style.color = "#fff")
  );
  closeBtn.addEventListener(
    "mouseleave",
    () => (closeBtn.style.color = "#bbb")
  );
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hide();
  });

  // Mostrar animação
  requestAnimationFrame(() => {
    div.style.opacity = "1";
    div.style.transform = "translateY(0)";
  });

  let timer;
  function startTimer() {
    timer = setTimeout(hide, 5000);
  }
  function stopTimer() {
    clearTimeout(timer);
  }

  // Mouse events → pausa e retoma o timer
  div.addEventListener("mouseenter", stopTimer);
  div.addEventListener("mouseleave", startTimer);

  // Inicia o timer
  startTimer();

  function hide() {
    stopTimer();
    div.style.opacity = "0";
    div.style.transform = "translateY(8px)";
    setTimeout(() => div.remove(), 300);
  }
}

// Mostrar toast no carregamento inicial, mas só depois do Cloudflare
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    waitForCloudflareClear(mostrarToastInstrucao);
  });
} else {
  waitForCloudflareClear(mostrarToastInstrucao);
}
