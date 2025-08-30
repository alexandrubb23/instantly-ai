import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useRef } from "react";
import AiAssistantForm, { type AiFormData } from "./AiAssistantForm";
import type { DeltaField } from "../EmailForm/EmailFormContainer";

type Props = {
  aiOpen: boolean;
  onBotTyping: (is: boolean) => void;
  onDelta: (field: DeltaField, delta: string) => void;
  onDone?: () => void;
  onError: (error: string) => void;
  onStart: () => void;
  setAiOpen: (v: boolean) => void;
};

const AiModalAssistant = ({
  aiOpen,
  onBotTyping,
  onDelta,
  onDone,
  onError,
  onStart,
  setAiOpen,
}: Props) => {
  const abortControllerRef = useRef<AbortController | null>(null);

  const streamNdjson = async (data: AiFormData, signal?: AbortSignal) => {
    onError("");

    const res = await fetch("/api/ai/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: signal ?? null,
    });

    if (!res.ok) {
      onError("Something went wrong, please try again later.");
    }

    if (!res.body) {
      return;
    }

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

  const submit = async (data: AiFormData) => {
    onStart();
    onBotTyping(true);

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
