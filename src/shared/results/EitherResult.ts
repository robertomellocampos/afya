export type EitherResult<L, R> = Left<L, R> | Right<L, R>;

export class Left<L, R> {
  private readonly value: L;

  private constructor(value: L) {
    this.value = value;
  }

  static create<L, R>(value: L): EitherResult<L, R> {
    return new Left<L, R>(value);
  }

  isLeft(): this is Left<L, R> {
    return true;
  }

  isRight(): this is Right<L, R> {
    return false;
  }

  getValue(): L {
    return this.value;
  }
}

export class Right<L, R> {
  private readonly value: R;

  private constructor(value: R) {
    this.value = value;
  }

  static create<L, R>(value: R): EitherResult<L, R> {
    return new Right<L, R>(value);
  }

  isLeft(): this is Left<L, R> {
    return false;
  }

  isRight(): this is Right<L, R> {
    return true;
  }

  getValue(): R {
    return this.value;
  }
}
