/**
 * Restricts a partial selection of keys from `T` to the shape defined by `R`,
 * returning `R` unchanged. Useful as a constraint to ensure that `R`
 * only contains keys that exist in `T`.
 *
 * The keys must come from `T`, but their value types can be freely
 * changed — `R` does not inherit the value types of `T`, so the same
 * key can be re-typed (e.g. `string` instead of `number`).
 *
 * @template T - The source type providing the allowed keys.
 * @template R - The selection type; each key must be a key of `T`,
 *               with an arbitrary value type.
 *
 * @example
 * type User = { id: number; name: string; email: string };
 *
 * // 'age' is not a key of User, so this is a type error:
 * // type Bad = MapSelected<User, { name: boolean; age: boolean }>;
 * //                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * // Type '"age"' is not assignable to ... keyof User
 *
 * // Valid: keys must exist in User, but value types can differ:
 * type UserForm = MapSelected<User, { id: string; name: boolean }>;
 * // { id: string; name: boolean }
 */
export type MapSelected<T, R extends { [K in keyof T]?: unknown }> = R;

/**
 * Merges two object types, with properties from `U` overriding
 * conflicting properties from `T`.
 *
 * @template T - The base type.
 * @template U - The type whose properties take precedence.
 *
 * @example
 * type A = { id: number; name: string };
 * type B = { id: string };
 * type C = Overwrite<A, B>; // { name: string; id: string }
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;
