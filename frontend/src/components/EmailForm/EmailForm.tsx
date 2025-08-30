import { Box, IconButton, Stack } from "@mui/material";
import z from "zod";
import AiModalAssistant from "~/components/chat/AiModalAssistant";
import AiAssistantIcon from "~/components/ui/AiAssistantIcon";
import BotIcon from "~/components/ui/BotIcon";
import FormInput from "~/components/ui/form/FormInput";
import SubmitButton from "~/components/ui/form/SubmitButton";
import SimpleSnackbar from "~/components/ui/Snackbar";
import TypingIndicator from "~/components/ui/TypingIndicator";
import type { DeltaField } from "./EmailFormContainer";

type Props = {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  info: string;
  setInfo: (s: string) => void;
  error: string;
  setError: (s: string) => void;
  aiOpen: boolean;
  setAiOpen: (b: boolean) => void;
  onAIStart: () => void;
  onAIDelta: (field: DeltaField, delta: string) => void;
  isBotTyping: boolean;
  setIsBotTyping: (b: boolean) => void;
  subjectVal: string;
  bodyVal: string;
  submitting: boolean;
};

const EmailForm: React.FC<Props> = ({
  onSubmit,
  info,
  setInfo,
  error,
  setError,
  aiOpen,
  setAiOpen,
  onAIStart,
  onAIDelta,
  isBotTyping,
  setIsBotTyping,
  subjectVal,
  bodyVal,
  submitting,
}) => {
  return (
    <>
      <form onSubmit={onSubmit} aria-busy={submitting || isBotTyping}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box className="flex-1">
              <FormInput
                name="to"
                label="To"
                placeholder="recipient@example.com"
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Box className="flex-1">
              <FormInput name="cc" label="CC" placeholder="cc@example.com" />
            </Box>
            <Box className="flex-1">
              <FormInput name="bcc" label="BCC" placeholder="bcc@example.com" />
            </Box>
          </Stack>

          <Box>
            <FormInput
              name="subject"
              label="Subject"
              placeholder={subjectVal ? "" : "Short, clear subject"}
              disabled={isBotTyping}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setAiOpen(true)} title="AI Draft">
                    <AiAssistantIcon aiOpen={aiOpen} />
                  </IconButton>
                ),
              }}
            />
          </Box>

          <Box>
            <FormInput
              name="body"
              label="Body"
              multiline
              rows={10}
              placeholder={bodyVal ? "" : "Write your message…"}
              disabled={isBotTyping}
            />
          </Box>

          <Box className="flex items-center gap-2 space justify-between">
            <Box>
              {error && <p className="text-red-500">{error}</p>}
              {isBotTyping && (
                <Box className="flex items-center gap-2">
                  <BotIcon className="text-3xl" /> <TypingIndicator />
                </Box>
              )}
            </Box>
            <SubmitButton>Save</SubmitButton>
          </Box>
        </Stack>
      </form>

      <SimpleSnackbar
        message={info}
        open={!!info}
        onClose={() => setInfo("")}
      />

      <AiModalAssistant
        aiOpen={aiOpen}
        setAiOpen={setAiOpen}
        onStart={onAIStart}
        onDelta={onAIDelta}
        onBotTyping={setIsBotTyping}
        onError={setError}
      />
    </>
  );
};

export default EmailForm;
