import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import React, { useState } from "react";

export const AIDialog = () => {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  return (
    <Dialog open={aiOpen} onClose={() => setAiOpen(false)}>
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
  );
};
