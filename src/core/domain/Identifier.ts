export class Identifier<T> {
  private _value: T;

  constructor(value: T) {
    this._value = value;
  }

  equals(id?: Identifier<T>): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString() {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */

  toValue(): T {
    return this.value;
  }

  /**
   * Getter value
   * @return {T}
   */
  public get value(): T {
    return this._value;
  }
}
