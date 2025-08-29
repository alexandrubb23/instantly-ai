import { Alert } from "@mui/material";
import { useFormContext } from "react-hook-form";

type Props = {
  name: string;
};

const ErrorMessage = <T extends Record<string, unknown>>({ name }: Props) => {
  const { formState } = useFormContext<T>();

  const error = formState.errors[name];
  if (!error?.message) return;

  return (
    <Alert className="mt-2" severity="error">
      {error.message as string}
    </Alert>
  );
};

export default ErrorMessage;
