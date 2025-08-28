import React, { useState } from "react";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import {
  Stack,
  TextField,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function Home() {
  const [aiOpen, setAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            label="To"
            fullWidth
            onChange={(e) => console.log(e.target.value)}
          />
          <IconButton
            onClick={() => {
              setAiOpen(true)
            }}
            title="AI Draft"
          >
            <AutoAwesomeIcon />
          </IconButton>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField label="CC" fullWidth />
          <TextField label="BCC" fullWidth />
        </Stack>
        <TextField label="Subject" fullWidth />
        <TextField label="Body" fullWidth multiline minRows={8} />
        <Box>
          <Button variant="contained">Save</Button>
        </Box>
      </Stack>
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
