import { Box, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { useEmails } from "~/hooks/http/useEmails";

export const EmailsList = () => {
  const router = useRouter();
  const { data: emails = [] } = useEmails();

  return (
    <Box className="overflow-auto">
      <List>
        {emails.map((e) => (
          <ListItemButton
            key={e.id}
            onClick={() => router.push(`/emails/${e.id}`)}
          >
            <ListItemText primary={e.subject} secondary={e.to} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};

export default EmailsList;
