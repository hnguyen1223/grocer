import { Box, ListItemButton, Typography, useTheme } from "@mui/material";
import { Stuff, StuffView } from "../../shared/interfaces";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useContext, useState } from "react";
import { StuffViewContext } from "./Stuffs";
import { SellOutlined } from "@mui/icons-material";
import LocationIcon from "../../shared/components/LocationIcon";
import { useNavigate } from "react-router-dom";
import { getExpiryDate } from "../../shared/utils";
dayjs.extend(relativeTime);

export default function StuffRow({ stuff }: { stuff: Stuff }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const view = useContext(StuffViewContext);
  const [_, setIsHovered] = useState(false);
  const today = new Date();

  const selectedDurability = stuff.durabilities[stuff.location];
  const expiryDate = getExpiryDate(stuff);
  const isExpired =
    expiryDate.isBefore(today) && expiryDate.diff(today, "d") !== 0;
  const name = stuff.emoji + " " + stuff.name + " ";
  const expiryText =
    expiryDate.diff(today, "d") === 0 ? "today" : expiryDate.from(today);

  return (
    <ListItemButton
      alignItems="flex-start"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{ cursor: "pointer" }}
      onClick={() => navigate(`${stuff.id}`)}
      disableRipple
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
              {expiryText}
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
      ></Box>
    </ListItemButton>
  );
}
