let dataAtualSelecionada = null;
let observerLupas = null;
let divFlutuante = null;
let lupasJaAtivadas = localStorage.getItem("lupasAtivadas") === "true";
import { BUSCAR_NICKNAME, DADOS_MONITORES, API_KEY, AUTH_TOKEN } from "./utils";

export async function exibirMenuMonitores() {
  console.log("Lista de membros.");
  const container = document.querySelector(
    "body > div > section > main > section > main > div > div.p-6.pt-0 > div > div.items-center.justify-between.space-y-2.lg\\:flex.lg\\:space-y-0 > div.flex.flex-1.flex-wrap.items-center.gap-2"
  );

  if (!container) return;
  container.style.justifyContent = "space-between";

  if (!document.getElementById("identificador-datas")) {
    const novaDiv = document.createElement("div");
    novaDiv.id = "identificador-datas";
    novaDiv.style.display = "flex";
    novaDiv.style.alignItems = "center";
    novaDiv.style.gap = "12px";
    novaDiv.style.padding = "0px 14px";
    novaDiv.style.borderRadius = "6px";
    novaDiv.style.border = "1px solid rgb(38 38 38)";
    novaDiv.style.fontSize = "10px";
    novaDiv.style.color = "rgb(161, 161, 161)";
    novaDiv.style.backgroundColor = "#1e1e1e";

    const label = document.createElement("span");
    label.textContent = "Data para fechamento:";

    const diaSelect = document.createElement("select");
    diaSelect.id = "dia-fechamento";
    Object.assign(diaSelect.style, {
      padding: "4px 10px",
      borderRadius: "4px",
      border: "none",
      backgroundColor: "#1e1e1e",
      color: "white",
      fontWeight: "500",
      cursor: "pointer",
      minWidth: "60px",
    });

    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();

    for (let i = 1; i <= ultimoDia; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = i.toString().padStart(2, "0");
      diaSelect.appendChild(option);
    }

    const diaSalvo = localStorage.getItem("diaSelecionado");
    if (diaSalvo) {
      diaSelect.value = diaSalvo;
      dataAtualSelecionada = diaSalvo;
    } else {
      dataAtualSelecionada = diaSelect.value;
    }

    const buscaWrapper = document.createElement("div");
    buscaWrapper.style.display = "flex";
    buscaWrapper.style.alignItems = "center";

    const botaoBuscar = document.createElement("button");
    botaoBuscar.title = "Buscar";
    Object.assign(botaoBuscar.style, {
      cursor: "pointer",
      border: "none",
      background: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "4px",
      borderRadius: "4px",
      color: "rgb(161, 161, 161)",
      transition: "color 0.2s ease-in-out",
    });

    botaoBuscar.onmouseenter = () => (botaoBuscar.style.color = "white");
    botaoBuscar.onmouseleave = () =>
      (botaoBuscar.style.color = "rgb(161, 161, 161)");

    botaoBuscar.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      `;

    botaoBuscar.onclick = () => {
      const dia = diaSelect.value;
      localStorage.setItem("diaSelecionado", dia);
      dataAtualSelecionada = dia;
      localStorage.setItem("lupasAtivadas", "true");
      lupasJaAtivadas = true;

      removerTodasLupas();
      adicionarLupas();

      if (observerLupas) observerLupas.disconnect();
      iniciarObserverLupas();

      // após (re)inserir lupas, garanta a (re)ordenação
      scheduleInitSorting();
    };

    diaSelect.addEventListener("change", () => {
      const novoDia = diaSelect.value;
      localStorage.setItem("diaSelecionado", novoDia);
      dataAtualSelecionada = novoDia;
    });

    buscaWrapper.appendChild(botaoBuscar);
    novaDiv.appendChild(label);
    novaDiv.appendChild(diaSelect);
    novaDiv.appendChild(buscaWrapper);
    container.appendChild(novaDiv);

    if (lupasJaAtivadas) {
      adicionarLupas();
      iniciarObserverLupas();
      scheduleInitSorting();
    }
  }
}

function removerTodasLupas() {
  document
    .querySelectorAll("td.td-lupa-monitores")
    .forEach((td) => td.remove());
}
console.log("TESTE");

function criarOuAtualizarDivFlutuante(htmlConteudo) {
  if (!divFlutuante) {
    divFlutuante = document.createElement("div");
    divFlutuante.id = "div-flutuante-monitores";
    Object.assign(divFlutuante.style, {
      position: "fixed",
      left: "50%",
      bottom: "3px",
      transform: "translate(-50%, -10%)",
      borderRadius: "6px",
      border: "1px solid rgb(38 38 38)",
      width: "98vw",
      backgroundColor: "rgb(0 0 0 / 60%)",
      color: "white",
      borderTop: "2px solid rgb(38 38 38)",
      padding: "12px",
      boxSizing: "border-box",
      overflowY: "auto",
      zIndex: 9999,
      display: "flex",
      flexDirection: "row",
      gap: "20px",
      flexWrap: "wrap",
      position: "fixed",
    });

    // botão fechar
    const botaoFechar = document.createElement("button");
    botaoFechar.id = "fechar-div-flutuante";
    botaoFechar.textContent = "×";
    Object.assign(botaoFechar.style, {
      position: "absolute",
      top: "8px",
      right: "16px",
      background: "transparent",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      fontWeight: "bold",
      lineHeight: "1",
    });
    botaoFechar.onclick = () => {
      divFlutuante.style.display = "none";
    };

    divFlutuante.appendChild(botaoFechar);

    // container só para o conteúdo dinâmico
    const conteudoDiv = document.createElement("div");
    conteudoDiv.id = "conteudo-flutuante";
    conteudoDiv.style.width = "100%";
    conteudoDiv.style.display = "flex";
    conteudoDiv.style.gap = "30px";
    divFlutuante.appendChild(conteudoDiv);

    document.body.appendChild(divFlutuante);
  }

  // atualiza apenas o container do conteúdo
  const conteudoDiv = divFlutuante.querySelector("#conteudo-flutuante");
  conteudoDiv.innerHTML = htmlConteudo;

  divFlutuante.style.display = "flex";
}

function adicionarLupas() {
  if (!dataAtualSelecionada) return;

  const aplicarLupa = (celula) => {
    const tr = celula.parentElement;
    if (!tr) return;
    const tdIrmao = celula.nextElementSibling;
    if (tdIrmao && tdIrmao.classList.contains("td-lupa-monitores")) return;

    const tdLupa = document.createElement("td");
    tdLupa.className = "td-lupa-monitores";
    Object.assign(tdLupa.style, {
      width: "32px",
      textAlign: "center",
      verticalAlign: "middle",
      cursor: "pointer",
      padding: "4px",
    });
    tdLupa.title = `Ação com dia ${dataAtualSelecionada}`;
    tdLupa.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      `;

    tdLupa.addEventListener("click", async (e) => {
      e.stopPropagation();
      const linha = e.target.closest("tr");
      const celulaNickname = linha?.querySelector("td:nth-child(2)");
      const nickname = celulaNickname?.textContent.trim();
      if (!nickname) return;

      const memberId = await pegarIdMembro(nickname);
      const relatorios = await pegarRelatoriosMembro(memberId);
      const html = gerarHtmlRelatorios(nickname, relatorios);
      criarOuAtualizarDivFlutuante(html);
    });

    tr.insertBefore(tdLupa, tdIrmao || null);
  };

  document.querySelectorAll("table").forEach((table) => {
    table.querySelectorAll("tbody tr td:nth-child(4)").forEach(aplicarLupa);
  });
}

function iniciarObserverLupas() {
  observerLupas = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1 && node.matches("tr")) {
          const celula = node.querySelector("td:nth-child(4)");
          if (celula) {
            const tdIrmao = celula.nextElementSibling;
            if (tdIrmao && tdIrmao.classList.contains("td-lupa-monitores"))
              return;

            const tdLupa = document.createElement("td");
            tdLupa.className = "td-lupa-monitores";
            Object.assign(tdLupa.style, {
              width: "32px",
              textAlign: "center",
              verticalAlign: "middle",
              cursor: "pointer",
              padding: "4px",
            });
            tdLupa.title = `Ação com dia ${dataAtualSelecionada}`;
            tdLupa.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                  viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              `;

            tdLupa.addEventListener("click", async (e) => {
              e.stopPropagation();
              const linha = e.target.closest("tr");
              const celulaNickname = linha?.querySelector("td:nth-child(2)");
              const nickname = celulaNickname?.textContent.trim();
              if (!nickname) return;

              const memberId = await pegarIdMembro(nickname);
              const relatorios = await pegarRelatoriosMembro(memberId);
              const html = gerarHtmlRelatorios(nickname, relatorios);
              criarOuAtualizarDivFlutuante(html);
            });

            celula.parentElement.insertBefore(tdLupa, tdIrmao || null);
          }
        }
      });
    }
  });

  document.querySelectorAll("table").forEach((table) => {
    observerLupas.observe(table, { childList: true, subtree: true });
  });
}

const reinserirSeletorData = new MutationObserver(() => {
  const container = document.querySelector(
    "body > div > section > main > section > main > div > div.p-6.pt-0 > div > div.items-center.justify-between.space-y-2.lg\\:flex.lg\\:space-y-0 > div.flex.flex-1.flex-wrap.items-center.gap-2"
  );

  if (container && !document.getElementById("identificador-datas")) {
    exibirMenuMonitores();
  }
});
reinserirSeletorData.observe(document.body, {
  childList: true,
  subtree: true,
});

document.body.style.paddingBottom = "60px";

// ─── funções auxiliares ─────────────────────────────────────────────────────

async function pegarIdMembro(nickname) {
  const url = `${BUSCAR_NICKNAME}${encodeURIComponent(nickname)}%25`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: API_KEY,
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  if (!data?.length) throw new Error("Membro não encontrado");
  return data[0].id;
}

async function pegarRelatoriosMembro(memberId) {
  const diaStr = localStorage.getItem("diaSelecionado");
  const ano = new Date().getFullYear();
  const mes = String(new Date().getMonth() + 1).padStart(2, "0");

  // Data de início: dia selecionado às 04:00 UTC
  const dataInicio = new Date(
    `${ano}-${mes}-${diaStr.padStart(2, "0")}T04:00:00Z`
  );
  const dataInicioStr = dataInicio.toISOString();

  // Data de fim: hoje às 02:00 UTC do dia seguinte
  const hoje = new Date();
  const dataFim = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate() + 1,
    2,
    0,
    0
  );
  const dataFimStr = dataFim.toISOString();

  let url = `${DADOS_MONITORES}${memberId}&offset=0`;

  if (diaStr) {
    url += `&created_at=gte.${dataInicioStr}&created_at=lte.${dataFimStr}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: API_KEY,
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const relatorios = await response.json();

  const separados = { T1: [], T2: [], T3: [], T4: [], TOTAL: [] };

  relatorios.forEach((r) => {
    const tipo = r?.report_model?.name;
    if (tipo === "Treinamento Básico I") separados.T1.push(r);
    else if (tipo === "Treinamento Básico II") separados.T2.push(r);
    else if (tipo === "Treinamento Complementar I") separados.T3.push(r);
    else if (tipo === "Treinamento Complementar II") separados.T4.push(r);
    separados.TOTAL.push(r);
  });

  return separados;
}

function gerarHtmlRelatorios(nickname, relPorTipo) {
  let html = `<h2>Relatórios de <strong>${nickname}</strong></h2>`;
  for (const tipo in relPorTipo) {
    const lista = relPorTipo[tipo];
    html += `<div><strong>${tipo}</strong>: ${lista.length}</div>`;
  }
  html += `</div>`;
  return html;
}

// ─── ORDENÇÃO ROBUSTA (resistente a SPA/React) ──────────────────────────────

// Ordem desejada dos status
const statusOrder = {
  Ativo: 0,
  "Semi-Ausente": 1,
  Ausente: 2,
  "Justificativa de Ausência": 3,
  Verificação: 4,
};

// Helpers de inicialização e re-anexo
let currentTbody = null;
let rowsObserver = null;
let tableDomObserver = null;
let debounceSortHandle = null;

// Seleciona o tbody “alvo”: pega o <tbody> com mais linhas visíveis
function findTargetTbody() {
  const candidates = Array.from(document.querySelectorAll("table tbody"));
  if (candidates.length === 0) return null;
  candidates.sort(
    (a, b) => (b.children?.length || 0) - (a.children?.length || 0)
  );
  return candidates[0] || null;
}

function sortTableRows() {
  if (!currentTbody) return;

  const rows = Array.from(currentTbody.querySelectorAll(":scope > tr"));
  if (rows.length === 0) return;

  const rowsOrdenadas = [...rows].sort((a, b) => {
    const statusA =
      a.querySelector("td:nth-child(4) div")?.textContent.trim() || "";
    const statusB =
      b.querySelector("td:nth-child(4) div")?.textContent.trim() || "";

    const orderA =
      statusOrder[statusA] !== undefined ? statusOrder[statusA] : Infinity;
    const orderB =
      statusOrder[statusB] !== undefined ? statusOrder[statusB] : Infinity;

    return orderA - orderB;
  });

  // Evita reflow desnecessário
  let mudou = false;
  for (let i = 0; i < rows.length; i++) {
    if (rows[i] !== rowsOrdenadas[i]) {
      mudou = true;
      break;
    }
  }
  if (!mudou) return;

  // Reapende na nova ordem
  const frag = document.createDocumentFragment();
  rowsOrdenadas.forEach((tr) => frag.appendChild(tr));
  currentTbody.appendChild(frag);
}

function attachRowsObserver(tbody) {
  // limpa anterior
  if (rowsObserver) {
    try {
      rowsObserver.disconnect();
    } catch {}
  }

  currentTbody = tbody;
  if (!currentTbody) return;

  // Observa mudanças nas linhas
  rowsObserver = new MutationObserver(() => {
    if (debounceSortHandle) cancelAnimationFrame(debounceSortHandle);
    debounceSortHandle = requestAnimationFrame(() => {
      // garante que o React terminou o paint
      setTimeout(sortTableRows, 0);
    });
  });

  rowsObserver.observe(currentTbody, {
    childList: true,
    subtree: false,
  });

  // Ordena já na entrada
  sortTableRows();
}

function initSorting() {
  const tbody = findTargetTbody();
  if (!tbody) return;
  if (tbody === currentTbody) {
    // mesmo tbody; só garante que está ordenado
    sortTableRows();
    return;
  }
  attachRowsObserver(tbody);
}

function scheduleInitSorting() {
  // chama várias vezes com pequenos atrasos para pegar mounts assíncronos
  setTimeout(initSorting, 0);
  setTimeout(initSorting, 150);
  setTimeout(initSorting, 350);
  requestAnimationFrame(initSorting);
}

// Observa o DOM inteiro para detectar quando um novo tbody aparecer/substituir
if (!tableDomObserver) {
  tableDomObserver = new MutationObserver(() => {
    scheduleInitSorting();
  });
  tableDomObserver.observe(document.body, { childList: true, subtree: true });
}

// Hook em mudanças de rota da SPA
(function hookHistory() {
  const push = history.pushState;
  const replace = history.replaceState;

  history.pushState = function () {
    const ret = push.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };
  history.replaceState = function () {
    const ret = replace.apply(this, arguments);
    window.dispatchEvent(new Event("locationchange"));
    return ret;
  };
  window.addEventListener("popstate", () =>
    window.dispatchEvent(new Event("locationchange"))
  );

  window.addEventListener("locationchange", () => {
    // aguarda o React montar a nova tela/lista
    scheduleInitSorting();
  });
})();

// Kickstart inicial
scheduleInitSorting();
