import { Box, TextField } from "@mui/material";
import { useFormContext, type Path } from "react-hook-form";

type TextFieldProps<T extends Record<string, unknown>> = React.ComponentProps<
  typeof TextField
> & {
  name: keyof T & string;
};

const FormInput = <T extends Record<string, unknown>>({
  name,
  ...props
}: TextFieldProps<T>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors[name];

  return (
    <Box>
      <TextField
        {...register(name as Path<T>)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...props}
      />

      {error?.message && (
        <p style={{ color: "red", margin: 0 }}>{error.message as string}</p>
      )}
    </Box>
  );
};

export default FormInput;
