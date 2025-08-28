import { AIDialog } from "@/components/AIDialog";
import { Header } from "@/components/ui/Header";
import Sidebar from "@/components/ui/Sidebar";
import "@/styles/globals.css";
import { Box } from "@mui/material";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 3, ml: "320px" }}>
          <main>
            <Component {...pageProps} />
          </main>
        </Box>
        <AIDialog />
      </Box>
    </>
  );
}
