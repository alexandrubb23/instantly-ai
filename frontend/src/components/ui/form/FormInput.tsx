import { Alert, Box, TextField } from "@mui/material";
import { useFormContext, type Path } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type TextFieldProps = React.ComponentProps<typeof TextField> & {
  name: string;
};

const FormInput = <T extends Record<string, unknown>>({
  name,
  ...props
}: TextFieldProps) => {
  const { register } = useFormContext<T>();

  return (
    <Box>
      <TextField
        {...register(name as Path<T>)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        {...props}
      />
      <ErrorMessage name={name} />
    </Box>
  );
};

export default FormInput;
