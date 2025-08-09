import { CustomError } from "../types/CustomError";

export type FormErrors = { [key: string]: string[] | string };
export type GeneralError = { general: string };
export type ErrorsState = FormErrors | GeneralError | null;

export const handleError = (
  error: unknown,
  setErrors: (errors: ErrorsState) => void
) => {
  if (error instanceof CustomError) {
    const errorData = error.data;

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "errors" in errorData
    ) {
      setErrors(errorData.errors as ErrorsState);
    } else if (
      typeof errorData === "object" &&
      errorData !== null &&
      "detail" in errorData
    ) {
      setErrors({ general: errorData.detail as string });
    } else {
      setErrors({ general: error.message });
    }
  } else {
    console.error("Unknown error:", error);
    setErrors({
      general:
        "An unexpected error occurred. Please contact IT if this issue persists.",
    });
  }
};
