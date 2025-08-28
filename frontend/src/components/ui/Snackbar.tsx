import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import { Fragment, useEffect, useState } from "react";

type Props = {
  message: string;
  open: boolean;
  snackbarKey?: number;
};

export default function SimpleSnackbar({ message, open, snackbarKey }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(open);
  }, [open, message, snackbarKey]);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") return;
    setShow(false);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <Snackbar
      open={show}
      autoHideDuration={5000}
      onClose={handleClose}
      message={message}
      action={action}
    />
  );
}
