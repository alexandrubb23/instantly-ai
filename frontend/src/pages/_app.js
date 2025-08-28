import '~/styles/globals.css';
import { Box } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AIDialog } from "~/components/AIDialog";
import { Header } from "~/components/ui/Header";
import Sidebar from "~/components/ui/Sidebar";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <Sidebar />
        <Box sx={{ flex: 1, p: 3 }}>
          <main>
            <Component {...pageProps} />
          </main>
        </Box>
        <AIDialog />
      </Box>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
