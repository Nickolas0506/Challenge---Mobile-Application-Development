export const queryKeys = {
  pets: (userId: string) => ['pets', userId] as const,
  pet: (id: string) => ['pet', id] as const,
  checkins: (userId: string) => ['checkins', userId] as const,
  checkin: (id: string) => ['checkin', id] as const,
  passeios: (userId: string) => ['passeios', userId] as const,
  passeio: (id: string) => ['passeio', id] as const,
  alertas: (userId: string) => ['alertas', userId] as const,
  alerta: (id: string) => ['alerta', id] as const,
  eventosIot: (userId: string) => ['eventosIot', userId] as const,
};
