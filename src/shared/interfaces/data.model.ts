export type DataWithState<
  T,
  ErrorType,
  Structure extends "object" | "array" = "object",
  IsValueOptional extends Boolean = true,
  WithLoading extends Boolean = true,
  WithError extends Boolean = true,
  DataKey extends string = "data",
> = Structure extends "object"
  ? {
    [key in DataKey]: IsValueOptional extends true ? T | undefined : T;
  } & (WithLoading extends true ? { loading: boolean } : {}) & (WithError extends true ? { error: ErrorType | undefined } : {})
  : [
    IsValueOptional extends true ? T | undefined : T,
    ...(WithLoading extends true ? [boolean] : []),
    ...(WithError extends true ? [ErrorType | undefined] : [])
  ];
