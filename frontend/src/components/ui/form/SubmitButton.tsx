import { Button } from "@mui/material";
import { useFormContext } from "react-hook-form";

type Props = {
  children: string;
};

const SubmitButton = ({ children }: Props) => {
  const { formState } = useFormContext();

  return (
    <Button variant="contained" type="submit" disabled={!formState.isValid}>
      {children}
    </Button>
  );
};

export default SubmitButton;
