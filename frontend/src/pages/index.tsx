import { zodResolver } from "@hookform/resolvers/zod";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import SimpleSnackbar from "~/components/ui/Snackbar";
import TypingIndicator from "~/components/ui/TypingIndicator";
import type { Email } from "~/hooks/http/types/email.type";
import { EMAIL_QUERY_KEY } from "~/hooks/http/useEmails";
import { smartAppend } from "~/utils/smartAppend";

type Props = {
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  onStart: () => void; // close & clear fields (parent decides)
  onDelta: (field: "subject" | "body", delta: string) => void;
  onDone?: () => void;
  onBotTyping: (is: boolean) => void;
};

type AiFormData = z.infer<typeof schemaAi>;

const schemaAi = z.object({
  prompt: z.string().min(2).max(100),
  recipient: z.string().min(2).max(100).optional(),
});

function AiModalAssistant({
  aiOpen,
  setAiOpen,
  onStart,
  onDelta,
  onDone,
  onBotTyping,
}: Props) {
  const { register, formState, reset, handleSubmit } = useForm({
    resolver: zodResolver(schemaAi),
    mode: "onChange",
  });

  const { errors } = formState;
  const abortControllerRef = useRef<AbortController | null>(null);

  // Newline Delimited JSON
  const streamNdjson = async (data: AiFormData, signal?: AbortSignal) => {
    const res = await fetch("/api/ai/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: signal ?? null,
    });

    if (!res.body) return;

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buf = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;
      buf += decoder.decode(value, { stream: true });

      let idx: number;
      while ((idx = buf.indexOf("\n")) >= 0) {
        const line = buf.slice(0, idx).trim();
        buf = buf.slice(idx + 1);

        if (!line) continue;

        try {
          const evt = JSON.parse(line);

          if (evt.event === "heartbeat") continue;

          if (evt.event === "done") {
            onDone?.();
            continue;
          }

          if (evt.field && evt.delta) {
            onDelta(evt.field, String(evt.delta));
          }
        } catch {
          // TODO:Handle parsing error
        }
      }
    }
  };

  const resetModalFields = () => {
    reset({ prompt: "", recipient: "" });
  };

  const submit = handleSubmit(async (data) => {
    onBotTyping(true);
    // notify parent to close modal + clear form fields
    onStart();

    // start streaming
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const { prompt, recipient } = data;

      await streamNdjson(
        { prompt, recipient },
        abortControllerRef.current.signal,
      );
    } finally {
      abortControllerRef.current = null;
      onBotTyping(false);
    }

    resetModalFields();
  });

  const onCloseModal = () => {
    abortControllerRef.current?.abort();
    setAiOpen(false);
    resetModalFields();
  };

  return (
    <Dialog open={aiOpen} onClose={onCloseModal} fullWidth>
      <DialogTitle>AI ✨ Draft</DialogTitle>
      <DialogContent>
        <form onSubmit={submit}>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <TextField
                {...register("prompt")}
                fullWidth
                label="What should the email be about?"
              />
              {errors.prompt?.message && (
                <p style={{ color: "red", margin: 0 }}>
                  {errors.prompt.message}
                </p>
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
            <Button onClick={onCloseModal}>Cancel</Button>
            <Button
              variant="contained"
              disabled={!formState.isValid}
              type="submit"
            >
              Generate
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    getValues,
    watch, // 👈 for conditional placeholders
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const bodyRef = useRef<HTMLInputElement | null>(null);

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

  // Called by the modal right when "Generate" is pressed
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

  const handleAIDone = () => {
    // Optional: place cursor at end of body, or keep as-is
    setTimeout(() => bodyRef.current?.focus(), 0);
  };

  // For conditional placeholders (optional)
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
        onDone={handleAIDone}
        onBotTyping={setIsBotTyping}
      />
    </>
  );
}
