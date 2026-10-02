/** This type gets object (T) and allows to change its properties types (R). */
export type MapSelected<T, R extends { [K in keyof T]?: unknown }> = R;
