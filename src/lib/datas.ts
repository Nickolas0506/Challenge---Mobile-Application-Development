/** Dia no fuso do aparelho (AAAA-MM-DD); evita virar o dia as 21h por causa do UTC. */
export function chaveDia(data: Date | string) {
  const d = typeof data === 'string' ? new Date(data) : data;
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

export function ehHoje(iso: string) {
  return chaveDia(iso) === chaveDia(new Date());
}

export function formatarDataHora(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
