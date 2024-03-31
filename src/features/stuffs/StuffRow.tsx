import { Box, ListItem, Typography, useTheme } from "@mui/material";
import { Stuff, StuffView } from "../../shared/interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext, useState } from "react";
import { StuffViewContext } from "./Stuffs";
import { SellOutlined } from "@mui/icons-material";
import LocationIcon from "../../shared/components/LocationIcon";
dayjs.extend(relativeTime);

export default function StuffRow({ stuff }: { stuff: Stuff }) {
  const theme = useTheme();
  const view = useContext(StuffViewContext);
  const [_, setIsHovered] = useState(false);
  const today = new Date();

  const name = stuff.emoji + " " + stuff.name + " ";

  const selectedDurability = stuff.durabilities[stuff.location];
  const expiryDate = stuff.expiryDate
    ? dayjs(stuff.expiryDate)
    : selectedDurability?.days
    ? dayjs().add(selectedDurability!.days, "day")
    : selectedDurability?.hours
    ? dayjs().add(selectedDurability!.hours, "hour")
    : undefined;
  const isExpired = expiryDate?.isBefore(today);

  return (
    <ListItem
      alignItems="flex-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ cursor: "pointer" }}
    >
      <Box
        sx={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          gap: 0.8,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">{name}</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <Typography
              color={
                isExpired
                  ? theme.palette.warning.main
                  : theme.palette.text.secondary
              }
              variant="body2"
              noWrap
            >
              {expiryDate?.fromNow(true)}
            </Typography>
            {view !== StuffView.LOCATION && (
              <LocationIcon stuffLocation={stuff.location}></LocationIcon>
            )}
          </Box>
        </Box>
        <Typography variant="body2" color={theme.palette.text.secondary}>
          {selectedDurability?.description}
        </Typography>
        {view !== StuffView.CATEGORY && (
          <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
            <SellOutlined
              sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}
            />
            <Typography variant="subtitle2" color="text.secondary">
              {stuff.category}
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
        }}
      >
        {/* <Box
          display="flex"
          justifyContent="right"
          gap={1}
          sx={{
            visibility: isDesktop && isHovered ? "visible" : "hidden",
          }}
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
        </Box> */}

        {/* <LocationIcon stuffLocation={stuff.location}></LocationIcon> */}
      </Box>
    </ListItem>
  );
}
