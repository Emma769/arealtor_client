import { ZodError, ZodSchema } from "zod";

type ValidationResult<T> = { errors: Record<keyof T, string> | null };

export function validate<T>(data: T, schema: ZodSchema): ValidationResult<T> {
  try {
    schema.parse(data);
    return { errors: null };
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.issues.reduce((acc, val) => {
        const key = val.path[0] as keyof T;
        acc[key] = val.message;
        return acc;
      }, {} as Record<keyof T, string>);
      return { errors };
    }
    return { errors: null };
  }
}
