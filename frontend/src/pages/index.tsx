import { zodResolver } from "@hookform/resolvers/zod";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, IconButton, Stack, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import AiModalAssistant from "~/components/chat/AiModalAssistant";
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
  bcc: z.union([z.literal(""), z.email(), z.null()]),
  subject: z.string().min(2).max(100),
  body: z.string().min(10).max(1000),
});

export default function Home() {
  const {
    formState: { errors, isValid },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

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
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <TextField
                {...register("to")}
                label="To"
                fullWidth
                InputLabelProps={{ shrink: true }}
                placeholder="recipient@example.com"
              />
              {errors.to?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.to.message}</p>
              )}
            </Box>
            <IconButton onClick={() => setAiOpen(true)} title="AI Draft">
              <AutoAwesomeIcon />
            </IconButton>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <TextField
                {...register("cc")}
                label="CC"
                placeholder="cc@example.com"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              {errors.cc?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.cc.message}</p>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField
                {...register("bcc")}
                label="BCC"
                fullWidth
                placeholder="bcc@example.com"
                InputLabelProps={{ shrink: true }}
              />
              {errors.bcc?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.bcc.message}</p>
              )}
            </Box>
          </Stack>

          <Box>
            <TextField
              {...register("subject")}
              label="Subject"
              fullWidth
              InputLabelProps={{ shrink: true }}
              placeholder={subjectVal ? "" : "Short, clear subject"}
            />
            {errors.subject?.message && (
              <p style={{ color: "red", margin: 0 }}>
                {errors.subject.message}
              </p>
            )}
          </Box>

          <Box>
            <TextField
              {...register("body")}
              label="Body"
              fullWidth
              multiline
              minRows={8}
              InputLabelProps={{ shrink: true }}
              placeholder={bodyVal ? "" : "Write your message…"}
            />
            {errors.body?.message && (
              <p style={{ color: "red", margin: 0 }}>{errors.body.message}</p>
            )}
          </Box>

          <Box className="flex items-center gap-2 space justify-between">
            <Box>
              {isBotTyping && (
                <Box className="flex items-center gap-2">
                  🤖
                  <TypingIndicator />
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
    </>
  );
}
