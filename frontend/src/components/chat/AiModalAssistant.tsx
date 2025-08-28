import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

type Props = {
  aiOpen: boolean;
  setAiOpen: (v: boolean) => void;
  onStart: () => void; // close & clear fields (parent decides)
  onDelta: (field: "subject" | "body", delta: string) => void;
  onDone?: () => void;
  onBotTyping: (is: boolean) => void;
};

type FormData = z.infer<typeof schema>;

const schema = z.object({
  prompt: z.string().min(2).max(100),
  recipient: z.string().min(2).max(100).optional(),
});

type Props2 = {
  onSubmit: (data: FormData) => void;
  onCloseModal: () => void;
};

const AiAssistantForm = ({ onSubmit, onCloseModal }: Props2) => {
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
        <Button
          onClick={() => {
            onCloseModal();
            resetModalFields();
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" disabled={!formState.isValid} type="submit">
          Generate
        </Button>
      </DialogActions>
    </form>
  );
};

const AiModalAssistant = ({
  aiOpen,
  setAiOpen,
  onStart,
  onDelta,
  onDone,
  onBotTyping,
}: Props) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  // Newline Delimited JSON
  const streamNdjson = async (data: FormData, signal?: AbortSignal) => {
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

  const submit = async (data: FormData) => {
    onBotTyping(true);
    onStart();

    // start streaming
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      await streamNdjson(data, abortControllerRef.current.signal);
    } finally {
      abortControllerRef.current = null;
      onBotTyping(false);
    }
  };

  const onCloseModal = () => {
    abortControllerRef.current?.abort();
    setAiOpen(false);
  };

  return (
    <Dialog open={aiOpen} onClose={onCloseModal} fullWidth>
      <DialogTitle>AI ✨ Assistant</DialogTitle>
      <DialogContent>
        <AiAssistantForm onSubmit={submit} onCloseModal={onCloseModal} />
      </DialogContent>
    </Dialog>
  );
};

export default AiModalAssistant;
