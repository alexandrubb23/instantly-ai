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
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import type { Email } from "~/hooks/http/types/email.type";
import { EMAIL_QUERY_KEY } from "~/hooks/http/useEmails";

type FormData = z.infer<typeof schema>;

const schema = z.object({
  to: z.email(),
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
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  const queryClient = useQueryClient();

  const onSubmit = async (data: FormData) => {
    try {
      const res = await axios.post<Email>("/api/emails", data);

      queryClient.setQueryData(EMAIL_QUERY_KEY, (old: Email[] | undefined) => [
        res.data,
        ...(old || []),
      ]);
    } catch (error) {
    } finally {
      reset({
        to: "",
        cc: "",
        bcc: "",
        subject: "",
        body: "",
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box sx={{ flex: 1 }}>
              <TextField {...register("to")} label="To" fullWidth />
              {errors.to?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.to.message}</p>
              )}
            </Box>
            <IconButton
              onClick={() => {
                setAiOpen(true);
              }}
              title="AI Draft"
            >
              <AutoAwesomeIcon />
            </IconButton>
          </Stack>
          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <TextField {...register("cc")} label="CC" fullWidth />
              {errors.cc?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.cc.message}</p>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <TextField {...register("bcc")} label="BCC" fullWidth />
              {errors.bcc?.message && (
                <p style={{ color: "red", margin: 0 }}>{errors.bcc.message}</p>
              )}
            </Box>
          </Stack>
          <Box>
            <TextField {...register("subject")} label="Subject" fullWidth />
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
            />
            {errors.body?.message && (
              <p style={{ color: "red", margin: 0 }}>{errors.body.message}</p>
            )}
          </Box>
          <Box>
            <Button disabled={!isValid} type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </Stack>
      </form>

      <Dialog open={aiOpen} onClose={() => setAiOpen(false)} fullWidth>
        <DialogTitle>AI ✨ Draft</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="What should the email be about?"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
            />
            <TextField label="Recipient business (optional)" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAiOpen(false)}>Cancel</Button>
          <Button variant="contained">Generate</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
