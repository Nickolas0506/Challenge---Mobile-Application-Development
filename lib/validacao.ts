export function validarEmail(email: string): string | null {
  const e = email.trim().toLowerCase();
  if (!e) return 'Informe o e-mail.';
  if (!e.includes('@')) return 'O e-mail precisa conter @.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return 'Informe um e-mail valido.';
  return null;
}

export function validarSenha(senha: string): string | null {
  if (!senha.trim()) return 'Informe a senha.';
  if (senha.length < 6) return 'A senha precisa ter pelo menos 6 caracteres.';
  return null;
}

export function validarNome(nome: string): string | null {
  if (!nome.trim()) return 'Informe o nome.';
  if (nome.trim().length < 2) return 'O nome precisa ter pelo menos 2 caracteres.';
  return null;
}

/** Mantido para telas antigas; o cadastro agora aceita qualquer e-mail valido. */
export function validarEmailGmail(email: string): string | null {
  return validarEmail(email);
}
