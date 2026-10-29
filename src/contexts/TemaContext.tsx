import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { coresClaro, coresEscuro, type Cores } from '../constants/cores';
import { preferenciasService, type PreferenciaTema } from '../services/preferenciasService';

type TemaContextValor = {
  cores: Cores;
  escuro: boolean;
  preferencia: PreferenciaTema;
  definirPreferencia: (preferencia: PreferenciaTema) => void;
};

const TemaContext = createContext<TemaContextValor | undefined>(undefined);

export function TemaProvider({ children }: { children: ReactNode }) {
  const esquemaSistema = useColorScheme();
  const [preferencia, setPreferencia] = useState<PreferenciaTema>('sistema');

  useEffect(() => {
    void preferenciasService.lerTema().then(setPreferencia);
  }, []);

  const valor = useMemo<TemaContextValor>(() => {
    const escuro = preferencia === 'sistema' ? esquemaSistema === 'dark' : preferencia === 'escuro';
    return {
      cores: escuro ? coresEscuro : coresClaro,
      escuro,
      preferencia,
      definirPreferencia(nova) {
        setPreferencia(nova);
        void preferenciasService.salvarTema(nova);
      },
    };
  }, [preferencia, esquemaSistema]);

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}

export function useTema() {
  const ctx = useContext(TemaContext);
  if (!ctx) {
    throw new Error('useTema deve ser usado dentro de TemaProvider');
  }
  return ctx;
}
