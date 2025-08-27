// navegacao.js

const API_URL =
  "https://supabase.exbrhabbo.com/rest/v1/clusters_reports?select=*%2Cmember%3Aenrollments%21clusters_reports_member_fkey%28id%2Cnickname%29%2Creport_model%3Acluster_report_models%28*%29%2Caccepted_by%3Aenrollments%21clusters_reports_accepted_by_fkey%28id%2Cnickname%29&order=created_at.desc&accepted=is.null&cluster=eq.e34ee431-8e67-456d-8216-fce1b8a9a60b&offset=0&limit=100";

const HEADERS = {
  apikey:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
  Authorization:
    "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyODc0Njc2MCwiZXhwIjo0ODg0NDIwMzYwLCJyb2xlIjoiYW5vbiJ9.PfUXWWBShhau-OE27c8GbPuIP8p3afvItzxi0Xpel0E",
};

export function inserirBadgeNavegacao(atualizacaoInterval = 60000) {
  const anchorSelector =
    "body > div > section > div > div.flex.items-center.gap-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.border.border-input.bg-background.shadow-sm.hover\\:bg-accent.hover\\:text-accent-foreground.h-8.rounded-md.px-3.text-xs";

  function criarDivInfo(anchor) {
    if (!anchor) return null; // proteção extra

    let divInfo = document.getElementById("exbr-div-info");
    if (!divInfo) {
      divInfo = document.createElement("div");
      divInfo.id = "exbr-div-info";

      Object.assign(divInfo.style, {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        position: "absolute",
        padding: "0px 9px",
        backgroundColor: "#080809",
        color: "#fff",
        border: "1px solid rgb(39,39,39)",
        fontSize: ".75rem",
        borderRadius: "5px",
        height: `${anchor.offsetHeight}px`,
        minWidth: "80px",
        cursor: "pointer",
        transition: "background-color 0.25s ease",
      });

      const icon = document.createElement("img");
      icon.src =
        "https://www.habbo.com.br/habbo-imaging/badge/b10114s36044s40114s43114s17014328b05c552e870a455a7f2be1f8ad914.gif";
      Object.assign(icon.style, {
        width: "14px",
        height: "14px",
      });

      const separator = document.createElement("div");
      separator.textContent = "|";
      Object.assign(separator.style, {
        color: "rgb(120,120,120)",
        fontWeight: "bold",
      });

      const textContainer = document.createElement("div");
      textContainer.id = "exbr-div-text";
      Object.assign(textContainer.style, {
        whiteSpace: "nowrap",
      });

      divInfo.appendChild(icon);
      divInfo.appendChild(separator);
      divInfo.appendChild(textContainer);

      divInfo.addEventListener("mouseenter", () => {
        divInfo.style.backgroundColor = "#27272A";
      });

      divInfo.addEventListener("mouseleave", () => {
        divInfo.style.backgroundColor = "#080809";
      });

      if (anchor.parentElement) {
        anchor.parentElement.style.position = "relative";
        anchor.parentElement.appendChild(divInfo);
      }
    }
    return divInfo;
  }

  async function atualizarDivInfo() {
    const anchor = document.querySelector(anchorSelector);
    if (!anchor) return; // não faz nada se o botão não estiver na tela

    const divInfo = criarDivInfo(anchor);
    if (!divInfo) return;

    const textContainer = divInfo.querySelector("#exbr-div-text");

    try {
      const res = await fetch(API_URL, { headers: HEADERS });
      const data = await res.json();

      const valor = data.length || 0;
      const displayValor = valor > 100 ? "99+" : valor;

      textContainer.textContent = `Pendentes: ${displayValor}`;
      textContainer.style.position = "relative";
      textContainer.style.top = "1px";

      divInfo.style.top = `${
        anchor.offsetTop + (anchor.offsetHeight / 2 - divInfo.offsetHeight / 2)
      }px`;
      divInfo.style.left = `${anchor.offsetLeft - 120}px`;

      // === Tooltip ===
      let tooltip = document.getElementById("exbr-tooltip");
      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "exbr-tooltip";
        tooltip.style.position = "fixed";
        tooltip.style.background = "#111";
        tooltip.style.color = "#fff";
        tooltip.style.padding = "4px 8px";
        tooltip.style.fontSize = "12px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.zIndex = "9999";
        tooltip.style.display = "none";
        document.body.appendChild(tooltip);
      }

      divInfo.onmouseenter = (e) => {
        tooltip.textContent = `${valor} ações não aceitas na central`;
        tooltip.style.display = "block";
      };

      divInfo.onmousemove = (e) => {
        const offset = 12;
        let top = e.clientY + offset;
        let left = e.clientX + offset;

        const tooltipRect = tooltip.getBoundingClientRect();
        if (left + tooltipRect.width > window.innerWidth) {
          left = e.clientX - tooltipRect.width - offset;
        }
        if (top + tooltipRect.height > window.innerHeight) {
          top = e.clientY - tooltipRect.height - offset;
        }

        tooltip.style.top = top + "px";
        tooltip.style.left = left + "px";
      };

      divInfo.onmouseleave = () => {
        tooltip.style.display = "none";
      };

      divInfo.onclick = () => {
        window.location.href =
          "https://ofc.exbrhabbo.com/externos/e34ee431-8e67-456d-8216-fce1b8a9a60b/central";
      };
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }

  function observarAnchor() {
    const anchor = document.querySelector(anchorSelector);
    if (anchor) {
      atualizarDivInfo();
      setInterval(atualizarDivInfo, atualizacaoInterval);
      observer.disconnect();
    }
  }

  const observer = new MutationObserver(observarAnchor);
  observer.observe(document.body, { childList: true, subtree: true });

  observarAnchor();
}
