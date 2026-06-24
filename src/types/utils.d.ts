export type ReverseMap<T extends Record<keyof T | string | number | Symbol>> = {
    [K in keyof T as T[K]]: K
};