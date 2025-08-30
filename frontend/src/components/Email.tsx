import { Box, CircularProgress, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useEmail } from "~/hooks/http/useEmail";

type Params = {
  id: string;
};

const Email = () => {
  const params = useParams<Params>();
  const { data: email, isLoading, error } = useEmail(params?.id);

  if (error)
    return <Typography color="error">Failed to load email.</Typography>;

  if (isLoading || !email) return <CircularProgress />;

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        {email.subject}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        To: {email.to}
      </Typography>
      {email.cc && (
        <Typography variant="subtitle2" color="text.secondary">
          CC: {email.cc}
        </Typography>
      )}
      {email.bcc && (
        <Typography variant="subtitle2" color="text.secondary">
          BCC: {email.bcc}
        </Typography>
      )}
      <Box mt={2}>
        <Typography variant="body1" style={{ whiteSpace: "pre-line" }}>
          {email.body}
        </Typography>
      </Box>
    </Box>
  );
};

export default Email;
