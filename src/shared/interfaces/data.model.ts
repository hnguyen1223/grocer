export type DataWithState<
  T,
  ErrorType,
  IsValueOptional extends Boolean = false,
  Structure extends "object" | "array" = "array",
  DataKey extends string = "data"
> = Structure extends "object"
  ? {
      [key in DataKey]: IsValueOptional extends true ? T | undefined : T;
    } & {
      loading: boolean;
      error: ErrorType;
    }
  : [
      IsValueOptional extends true ? T | undefined : T,
      boolean,
      ErrorType | undefined
    ];
