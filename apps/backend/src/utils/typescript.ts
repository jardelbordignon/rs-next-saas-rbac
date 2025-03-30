// Generic utility type to make specific fields required
export type MakeRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// Generic utility type to make specific fields optional
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
