import { KeyboardArrowDown, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Collapse, IconButton, Typography } from "@mui/material";
import { ReactNode, useState } from "react";
import { isDesktop } from "react-device-detect";

export default function CollapsibleList({
  heading,
  subtitle,
  icon,
  children,
}: {
  heading?: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  function handleExpand() {
    setOpen(!open);
  }
  return (
    <Box sx={{ mb: "12px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            aria-label="expand"
            size="small"
            onClick={handleExpand}
            disableRipple
          >
            {open ? (
              <KeyboardArrowDown fontSize="medium" />
            ) : (
              <KeyboardArrowRight fontSize="medium" />
            )}
          </IconButton>
          <Typography align="left" variant="h5" mr={1}>
            {heading && heading.charAt(0).toUpperCase() + heading.slice(1)}
          </Typography>
          {icon && icon}
        </Box>

        <Typography mr={4} variant="subtitle1" fontWeight={600}>
          {subtitle}
        </Typography>
      </Box>

      <Collapse sx={{ px: isDesktop ? "24px" : "12px" }} in={open}>
        {children}
      </Collapse>
    </Box>
  );
}
