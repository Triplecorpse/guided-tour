export interface IEntity<T> {
  findAll: () => Promise<T[]>;
  find: (args: Record<string, any>) => Promise<T[]>;
  create: (args: T) => Promise<T>;
  update: (args: T) => Promise<T>;
  remove: (args: number[]) => Promise<number[]>;
}
