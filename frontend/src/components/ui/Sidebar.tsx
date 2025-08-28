import { Drawer, Box, List, ListItemButton, ListItemText } from "@mui/material";
import React from "react";

const Sidebar = () => {
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
            {/* {emails.map((e) => (
            <ListItemButton key={e.id} onClick={() => selectEmail(e.id)}>
              <ListItemText primary={e.subject} secondary={e.to} />
            </ListItemButton>
          ))} */}
            List emails
          </List>
        </Box>
      </Drawer>
    </div>
  );
};



export default Sidebar;
