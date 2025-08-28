import { zodResolver } from "@hookform/resolvers/zod";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, IconButton, Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import z from "zod";
import AiModalAssistant from "~/components/chat/AiModalAssistant";
import FormInput from "~/components/ui/form/FormInput";
import SimpleSnackbar from "~/components/ui/Snackbar";
import TypingIndicator from "~/components/ui/TypingIndicator";
import type { Email } from "~/hooks/http/types/email.type";
import { EMAIL_QUERY_KEY } from "~/hooks/http/useEmails";
import { smartAppend } from "~/utils/smartAppend";

type FormData = z.infer<typeof schema>;

const schema = z.object({
  to: z.email(),
  // TODO: Accepts multiple addresses separated by comma (",")
  cc: z.union([z.literal(""), z.email(), z.null()]),
  // TODO: Accepts multiple addresses separated by comma (",")
  bcc: z.union([z.literal(""), z.email(), z.null()]),
  subject: z.string().min(2).max(100),
  body: z.string().min(10).max(1000),
});

export default function Home() {
  const form = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const {
    formState: { isValid },
    getValues,
    handleSubmit,
    reset,
    setValue,
    watch,
  } = form;

  const [info, setInfo] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const queryClient = useQueryClient();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post<Email>("/api/emails", data);

      queryClient.setQueryData(EMAIL_QUERY_KEY, (old: Email[] | undefined) => [
        res.data,
        ...(old || []),
      ]);

      reset({ to: "", cc: "", bcc: "", subject: "", body: "" });
      setInfo("✅ The email was added");
    } catch {
      setInfo("❌ Something went wrong, please try again later.");
    }
  };

  const handleAIStart = () => {
    setValue("subject", "", { shouldDirty: true });
    setValue("body", "", { shouldDirty: true });
    setAiOpen(false);
  };

  const handleAIDelta = (field: "subject" | "body", delta: string) => {
    const curr = getValues(field) ?? "";
    const next = smartAppend(curr, delta);
    setValue(field, next, { shouldDirty: true, shouldValidate: true });
  };

  const subjectVal = watch("subject") || "";
  const bodyVal = watch("body") || "";

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <FormInput
                name="to"
                label="To"
                placeholder="recipient@example.com"
              />
            </Box>
            <IconButton onClick={() => setAiOpen(true)} title="AI Draft">
              <AutoAwesomeIcon />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormInput name="cc" label="CC" placeholder="cc@example.com" />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormInput name="bcc" label="BCC" placeholder="bcc@example.com" />
            </Box>
          </Stack>

          <Box>
            <FormInput
              name="subject"
              label="Subject"
              placeholder={subjectVal ? "" : "Short, clear subject"}
            />
          </Box>

          <Box>
            <FormInput
              name="body"
              label="Body"
              multiline
              rows={10}
              placeholder={bodyVal ? "" : "Write your message…"}
            />
          </Box>

          <Box className="flex items-center gap-2 space justify-between">
            <Box>
              {isBotTyping && (
                <Box className="flex items-center gap-2">
                  🤖 <TypingIndicator />
                </Box>
              )}
            </Box>
            <Button disabled={!isValid} type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Stack>
      </form>

      {info && (
        <SimpleSnackbar message={info} open={!!info} snackbarKey={Date.now()} />
      )}

      <AiModalAssistant
        aiOpen={aiOpen}
        setAiOpen={setAiOpen}
        onStart={handleAIStart}
        onDelta={handleAIDelta}
        onBotTyping={setIsBotTyping}
      />
    </FormProvider>
  );
}
