type AllKeys<T> = T extends unknown ? keyof T : never;
export declare function pick<O, K extends AllKeys<O>>(base: O, keys: readonly K[]): Pick<O, K>;
export {};
//# sourceMappingURL=utils.d.ts.map