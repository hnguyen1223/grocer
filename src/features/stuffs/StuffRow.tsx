import {
  Box,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { Stuff, StuffLocation } from "../../shared/interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import {
  AcUnit,
  Delete,
  Thermostat,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import { isDesktop } from "react-device-detect";
dayjs.extend(relativeTime);

export default function StuffRow({ stuff }: { stuff: Stuff }) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const expiryDate = dayjs(stuff.expiryDate);
  const today = new Date();
  const isExpired = expiryDate.isBefore(today);

  return (
    <ListItem
      alignItems="flex-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ cursor: "pointer" }}
    >
      <ListItemIcon>
        {" "}
        {stuff.location === StuffLocation.FRIDGE ? (
          <AcUnit sx={{ color: "lightblue" }} />
        ) : (
          <Thermostat color="warning" />
        )}
      </ListItemIcon>
      <ListItemText
        primary={<Typography variant="body1">{stuff.name}</Typography>}
        secondary={
          <Typography variant="subtitle2">
            {dayjs(stuff.dateAdded).fromNow()}
          </Typography>
        }
      />
      <Box>
        <Box
          display="flex"
          justifyContent="right"
          gap={1}
          sx={{ visibility: isDesktop && isHovered ? "visible" : "hidden" }}
        >
          <IconButton aria-label="delete" size="small">
            <ThumbUp />
          </IconButton>
          <IconButton aria-label="delete" size="small">
            <ThumbDown />
          </IconButton>
          <IconButton aria-label="delete" size="small" color="warning">
            <Delete />
          </IconButton>
        </Box>

        <ListItemText
          primary={
            <Typography
              color={
                isExpired
                  ? theme.palette.warning.main
                  : theme.palette.text.primary
              }
              variant="subtitle1"
              align="right"
            >
              {expiryDate.fromNow()}
            </Typography>
          }
        />
      </Box>
    </ListItem>
  );
}
