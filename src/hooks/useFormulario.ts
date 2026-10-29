import { useCallback, useState } from 'react';

/** Estado de formulario com um setter por campo (usado por pet e passeio). */
export function useFormulario<T extends object>(inicial: T) {
  const [valores, setValores] = useState<T>(inicial);

  const alterar = useCallback(<K extends keyof T>(campo: K, valor: T[K]) => {
    setValores((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const redefinir = useCallback((novos: T) => setValores(novos), []);

  return { valores, alterar, redefinir };
}
