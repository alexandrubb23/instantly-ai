import { Tooltip as MuiTooltip } from "@mui/material";

type Props = {
  children: React.ReactElement<any, any>;
  title: React.ReactElement<any, any>;
};

export const Tooltip = ({ children, title }: Props) => {
  return (
    <MuiTooltip
      title={title}
      arrow
      placement="top"
      slotProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: { offset: [0, 8] }, // small gap between icon & tooltip
            },
          ],
        },
        tooltip: {
          sx: {
            bgcolor: "black",
            color: "white",
            fontSize: "0.8rem",
            borderRadius: "8px",
            px: 1.5,
            py: 1,
          },
        },
        arrow: {
          sx: {
            color: "black",
          },
        },
      }}
    >
      {children}
    </MuiTooltip>
  );
};
