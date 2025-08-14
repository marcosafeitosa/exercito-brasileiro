const rotas = [
  // Rota mais específica primeiro
  {
    url: "https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b/central",
    modulo: () => import("./central.js").then((m) => m.centralDeAcoes()),
    aviso: "Script inicializado",
    icone: "https://cdn-icons-png.flaticon.com/512/190/190411.png", // exemplo de ícone
  },
  {
    url: "https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b",
    modulo: () => import("./monitores.js").then((m) => m.exibirMenuMonitores()),
    aviso: "Script inicializado",
    icone: "../avatarimage.png", // sem ícone
  },
];

export function verificarERodarModulo() {
  const urlAtual = window.location.href;

  // Escolhe sempre a rota mais específica
  const rota = rotas
    .filter((r) => urlAtual.startsWith(r.url))
    .sort((a, b) => b.url.length - a.url.length)[0];

  if (rota) {
    rota.modulo();
    console.log("✅ Rota encontrada:", rota.url);
    if (rota.aviso) {
      mostrarAvisoSuspenso(rota.aviso, rota.icone);
    }
  } else {
    console.log("⚠ Nenhum módulo configurado para esta URL:", urlAtual);
  }
}

function mostrarAvisoSuspenso(texto, iconeUrl = null) {
  let container = document.querySelector("#aviso-suspenso-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "aviso-suspenso-container";
    Object.assign(container.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      fontFamily: "Arial, sans-serif",
    });
    document.body.appendChild(container);
  }

  const aviso = document.createElement("div");
  Object.assign(aviso.style, {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "#215e35",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    fontSize: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    opacity: "0",
    transform: "translateX(100%)",
    transition: "opacity 0.4s ease, transform 0.4s ease",
    position: "relative",
    minWidth: "250px",
  });

  // Ícone (se fornecido)
  if (iconeUrl) {
    const icone = document.createElement("img");
    icone.src = iconeUrl;
    icone.style.width = "24px";
    icone.style.height = "24px";
    aviso.appendChild(icone);
  }

  // Texto do aviso
  const spanTexto = document.createElement("span");
  spanTexto.textContent = texto;
  aviso.appendChild(spanTexto);

  // Botão de fechar
  const btnFechar = document.createElement("button");
  btnFechar.innerHTML = "&times;";
  Object.assign(btnFechar.style, {
    background: "transparent",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
    position: "absolute",
    top: "5px",
    right: "8px",
  });
  btnFechar.addEventListener("click", () => {
    removerAviso(aviso);
  });
  aviso.appendChild(btnFechar);

  container.appendChild(aviso);

  // Animação de entrada
  requestAnimationFrame(() => {
    aviso.style.opacity = "1";
    aviso.style.transform = "translateX(0)";
  });

  // Remove automaticamente após 4s
  setTimeout(() => {
    removerAviso(aviso);
  }, 4000);
}

function removerAviso(aviso) {
  aviso.style.opacity = "0";
  aviso.style.transform = "translateX(100%)";
  aviso.addEventListener(
    "transitionend",
    () => {
      aviso.remove();
      const container = document.querySelector("#aviso-suspenso-container");
      if (container && container.children.length === 0) {
        container.remove();
      }
    },
    { once: true }
  );
}

function observarMudancasDeUrl(callback) {
  let oldHref = document.location.href;

  ["pushState", "replaceState"].forEach((method) => {
    const original = history[method];
    history[method] = function () {
      const result = original.apply(this, arguments);
      if (oldHref !== document.location.href) {
        oldHref = document.location.href;
        callback();
      }
      return result;
    };
  });

  window.addEventListener("popstate", () => {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      callback();
    }
  });
}

// Começa a observar
observarMudancasDeUrl(verificarERodarModulo);
