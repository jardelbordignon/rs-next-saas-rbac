// Obtém as chaves opcionais de T
type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never
}[keyof T]

// Exige pelo menos uma das chaves opcionais
export type AtLeastOneOptional<
  T,
  K extends keyof T = OptionalKeys<T>,
> = K extends unknown ? Required<Pick<T, K>> & Partial<Omit<T, K>> : never

// export type Body = AtLeastOneOptional<{
//   role?: Role
//   organizationId?: string
// }>
