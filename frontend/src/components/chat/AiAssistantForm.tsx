import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogActions, Stack, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import z from "zod";

export type AiFormData = z.infer<typeof schema>;

const schema = z.object({
  prompt: z.string().min(2).max(100),
  recipient: z.union([z.string().min(2).max(100), z.literal(""), z.null()]),
});

type Props = {
  onCloseModal: () => void;
  onSubmit: (data: AiFormData) => void;
};

const AiAssistantForm = ({ onSubmit, onCloseModal }: Props) => {
  const { register, formState, reset, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { errors } = formState;

  const resetModalFields = () => {
    reset({ prompt: "", recipient: "" });
  };

  const submit = handleSubmit((data) => {
    onSubmit(data);
    resetModalFields();
  });

  const handleCloseModal = () => {
    onCloseModal();
    resetModalFields();
  };

  return (
    <form onSubmit={submit}>
      <Stack spacing={2} sx={{ mt: 1 }}>
        <Box>
          <TextField
            {...register("prompt")}
            fullWidth
            label="What should the email be about?"
          />
          {errors.prompt?.message && (
            <p style={{ color: "red", margin: 0 }}>{errors.prompt.message}</p>
          )}
        </Box>
        <Box>
          <TextField
            {...register("recipient")}
            fullWidth
            label="Recipient business (optional)"
          />
          {errors.recipient?.message && (
            <p style={{ color: "red", margin: 0 }}>
              {errors.recipient.message}
            </p>
          )}
        </Box>
      </Stack>
      <DialogActions>
        <Button onClick={handleCloseModal}>Cancel</Button>
        <Button variant="contained" disabled={!formState.isValid} type="submit">
          Generate
        </Button>
      </DialogActions>
    </form>
  );
};

export default AiAssistantForm;
