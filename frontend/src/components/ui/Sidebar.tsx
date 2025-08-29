import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useRouter } from "next/router";
import { useEmails } from "~/hooks/http/useEmails";

const Sidebar = () => {
  const { data: emails = [] } = useEmails();

  const router = useRouter();

  return (
    <div className="sidebar">
      <Drawer
        className="w-[320px] shrink-0"
        variant="permanent"
        anchor="left"
        sx={{
          "& .MuiDrawer-paper": { width: 320, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
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
      </Drawer>
    </div>
  );
};

export default Sidebar;
