import { Drawer } from "@mui/material";
import EmailsList from "../EmailsList";

const Sidebar = () => {
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
        <EmailsList />
      </Drawer>
    </div>
  );
};

export default Sidebar;
