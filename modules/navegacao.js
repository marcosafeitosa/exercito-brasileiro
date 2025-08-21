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
  // Criação do badge
  function criarBadge(valorBadge) {
    const badge = document.createElement("span");
    badge.id = "exbr-badge";

    badge.textContent = valorBadge > 100 ? "99+" : valorBadge;
    const rightPos = valorBadge > 9 ? "11px" : "12px";

    Object.assign(badge.style, {
      color: "white",
      position: "absolute",
      right: rightPos,
    });

    return badge;
  }

  // Tooltip suspenso no body
  function adicionarTooltip() {
    const target = document.querySelector(
      "#radix-\\:R1cumkq\\: > nav > ul > li:nth-child(4) > div.hidden.lg\\:block"
    );
    if (!target) return;

    let tooltip = document.getElementById("exbr-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "exbr-tooltip";

      Object.assign(tooltip.style, {
        width: "189.492px",
        position: "fixed",
        padding: "4px 8px",
        backgroundColor: " #080809",
        color: "#fff",
        border: "solid 1px rgb(39, 39, 39)",
        fontSize: "12px",
        borderRadius: "3px",
        opacity: "0",
        pointerEvents: "none",
        transition: "opacity 0.2s ease",
        whiteSpace: "nowrap",
        zIndex: "10000",
      });

      document.body.appendChild(tooltip);

      target.addEventListener("mouseenter", () => {
        const badge = document.getElementById("exbr-badge");
        const valor = badge ? badge.textContent : "0";
        tooltip.textContent = `Ações na Central: ${valor}`;

        // Posiciona tooltip em relação ao target
        const rect = target.getBoundingClientRect();
        tooltip.style.top = `${rect.top - 30}px`;
        tooltip.style.left = `${rect.right + 0}px`;
        tooltip.style.opacity = "1";
      });

      target.addEventListener("mouseleave", () => {
        tooltip.style.opacity = "0";
      });
    }
  }

  // Atualiza badge
  async function atualizarBadge() {
    const target = document.querySelector(
      "#radix-\\:R1cumkq\\: > nav > ul > li:nth-child(4) > div.hidden.lg\\:block"
    );
    if (!target) return;

    target.style.display = "flex";
    target.style.justifyContent = "center";

    try {
      const res = await fetch(API_URL, { headers: HEADERS });
      const data = await res.json();
      const valor = data.length || 0;
      const displayValor = valor > 100 ? "99+" : valor;

      let badge = document.getElementById("exbr-badge");
      if (!badge) {
        badge = criarBadge(valor);
        target.appendChild(badge);
      } else {
        badge.textContent = displayValor;
        badge.style.right = valor > 9 ? "10px" : "18px";
      }

      // Chama o tooltip
      setTimeout(() => {
        adicionarTooltip();
      }, 600);
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
  }

  // Observa botão de ancoragem
  const anchorSelector =
    "body > div > section > div > div.flex.items-center.gap-4 > button.inline-flex.items-center.justify-center.whitespace-nowrap.font-medium.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-1.focus-visible\\:ring-ring.disabled\\:pointer-events-none.disabled\\:opacity-50.border.border-input.bg-background.shadow-sm.hover\\:bg-accent.hover\\:text-accent-foreground.h-8.rounded-md.px-3.text-xs";

  function observarAnchor() {
    const anchor = document.querySelector(anchorSelector);
    if (anchor) {
      atualizarBadge();

      // Atualizações periódicas
      setInterval(atualizarBadge, atualizacaoInterval);

      observer.disconnect();
    }
  }

  const observer = new MutationObserver(observarAnchor);
  observer.observe(document.body, { childList: true, subtree: true });

  // Tentativa inicial
  observarAnchor();
}
