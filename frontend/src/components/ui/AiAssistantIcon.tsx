import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

import { keyframes } from "@mui/system";
import BotIcon from "./BotIcon";
import { Tooltip } from "./Tooltip";

const sparkle = keyframes`
  0%   { transform: scale(1) rotate(0deg); opacity: 1; box-shadow: 0 0 0px gold; }
  25%  { transform: scale(1.15) rotate(5deg); opacity: 0.9; box-shadow: 0 0 8px gold; }
  50%  { transform: scale(0.95) rotate(-5deg); opacity: 1; box-shadow: 0 0 16px gold; }
  75%  { transform: scale(1.1) rotate(3deg); opacity: 0.95; box-shadow: 0 0 8px gold; }
  100% { transform: scale(1) rotate(0deg); opacity: 1; box-shadow: 0 0 0px gold; }
`;

const AiAssistantIcon = ({ aiOpen }: { aiOpen: boolean }) => {
  const active = !aiOpen; // glow only when modal is closed

  const title = (
    <div className="text-sm">
      Hey, my name is <BotIcon /> <br />I can generate an{" "}
      <strong>email subject</strong> <br />
      and <strong>body</strong> if you prompt me well!
    </div>
  );

  return (
    <Tooltip title={title}>
      <AutoAwesomeIcon
        sx={{
          background: "black",
          color: "#FFD700",
          borderRadius: "50%",
          padding: "4px",
          boxShadow: active ? "0 0 12px gold" : "none",
          animation: active ? `${sparkle} 2.5s ease-in-out infinite` : "none",
          // Respect reduced motion
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
          },
        }}
      />
    </Tooltip>
  );
};

export default AiAssistantIcon;
