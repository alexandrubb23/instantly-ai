import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, DialogActions, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import FormInput from "../ui/form/FormInput";
import SubmitButton from "../ui/form/SubmitButton";

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
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { formState, reset, handleSubmit } = form;

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
    <FormProvider {...form}>
      <form onSubmit={submit}>
        <Stack className="mt-4" spacing={2}>
          <Box>
            <FormInput name="prompt" label="What should the email be about?" />
          </Box>
          <Box>
            <FormInput name="recipient" label="Recipient business (optional)" />
          </Box>
        </Stack>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <SubmitButton>Generate</SubmitButton>
        </DialogActions>
      </form>
    </FormProvider>
  );
};

export default AiAssistantForm;
