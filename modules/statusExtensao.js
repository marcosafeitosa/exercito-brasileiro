// Configuração
const mostrarExtensao = true; // altere para false se não quiser exibir
const tempoExibicao = 5000; // em ms (5 segundos)

// Função para criar a notificação
export function criarNotificacao() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");

  // Criar container
  const div = document.createElement("div");
  div.innerHTML = `
    <div style="
      display: flex;
      align-items: center;
      gap: 10px;
    ">
      <span style="font-size:18px;">⚡</span>
      <span style="font-weight:500;">
        Extensão atualizada às ${horas}:${minutos}
      </span>
    </div>
  `;

  // Estilizar
  div.style.position = "fixed";
  div.style.bottom = "20px";
  div.style.left = "20px";
  div.style.padding = "12px 18px";
  div.style.background = "rgba(20,20,20,0.95)";
  div.style.color = "white";
  div.style.borderRadius = "12px";
  div.style.fontFamily = "Arial, sans-serif";
  div.style.fontSize = "14px";
  div.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
  div.style.zIndex = "99999";
  div.style.opacity = "0";
  div.style.transition = "opacity 0.5s ease";

  document.body.appendChild(div);

  // Efeito de fade-in
  setTimeout(() => {
    div.style.opacity = "1";
  }, 50);

  // Remover após alguns segundos com fade-out
  setTimeout(() => {
    div.style.opacity = "0";
    setTimeout(() => div.remove(), 500); // espera o fade-out antes de remover
  }, tempoExibicao);
}

// Mostrar se a flag for true
if (mostrarExtensao) {
  criarNotificacao();
}
