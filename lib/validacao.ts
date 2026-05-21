/** E-mail obrigatório com @ e domínio gmail.com */
export function validarEmailGmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!e) return 'Informe o e-mail.';
  if (!e.includes('@')) return 'O e-mail precisa conter @.';
  if (!e.endsWith('@gmail.com')) return 'Use um e-mail @gmail.com (ex: seu nome@gmail.com).';
  const parteLocal = e.split('@')[0];
  if (!parteLocal) return 'Informe o nome antes do @gmail.com.';
  return null;
}
