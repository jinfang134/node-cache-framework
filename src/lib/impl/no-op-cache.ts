import {Cache} from '../CacheModel';

export class NoOpCache implements Cache {

  readonly name: string;

  constructor(name: string) {
    this.name = name;
  }

  // tslint:disable-next-line: no-empty
  clear(): void {
  }

  // tslint:disable-next-line: no-empty
  evict(key: string): void {
  }

  get<T>(key: string): T {
    return undefined;
  }

  // tslint:disable-next-line: no-empty
  put<T>(key: string, value: T): void {
  }
}
