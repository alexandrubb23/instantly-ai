import { Box, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useEmails } from "~/hooks/http/useEmails";

const Sidebar = () => {
  const { data: emails = [] } = useEmails();

  return (
    <div className="sidebar">
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": { width: 320, boxSizing: "border-box" },
        }}
      >
        <Box sx={{ overflow: "auto" }}>
          <List>
            {emails.map((e) => (
              <ListItemButton key={e.id} onClick={() => console.log(e.id)}>
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
