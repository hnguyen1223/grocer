import { Box, Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { Durability, StuffLocation } from "../../shared/interfaces";
import {
  AcUnit,
  Kitchen,
  Thermostat,
  ThumbDownOutlined,
  ThumbUpOutlined,
} from "@mui/icons-material";
import { isDesktop } from "react-device-detect";
import { useOrientation } from "react-use";
import { memo, useCallback } from "react";
import Loading from "../../shared/components/Loading";

const CARD_WIDTH = 148;

const DurabilityCard = memo(function DurabilityCard({
  stuffLocation,
  durability,
  isSelected,
  onSelect,
  loading,
  disabled,
  error,
}: {
  stuffLocation: StuffLocation;
  durability: Durability | undefined;
  isSelected: boolean;
  onSelect: (location: StuffLocation) => void;
  loading?: boolean;
  disabled?: boolean;
  error?: any;
}) {
  const theme = useTheme();
  const orientation = useOrientation();

  const handleClick = useCallback(() => {
    onSelect(stuffLocation);
  }, [onSelect, stuffLocation]);

  const isHorizontalLayout =
    isDesktop || orientation.angle === 90 || orientation.angle === 270;
  const durationText = durability?.days
    ? `${durability.days} day${durability.days > 1 ? "s" : ""}`
    : durability?.hours
    ? `${durability.hours} hour${durability.hours > 1 ? "s" : ""}`
    : "";

  const icon =
    stuffLocation === StuffLocation.FREEZER ? (
      <AcUnit sx={{ color: "dodgerblue" }} />
    ) : stuffLocation === StuffLocation.FRIDGE ? (
      <Kitchen sx={{ color: "lightblue" }} />
    ) : (
      <Thermostat color="warning" />
    );

  const locationText = (
    <Typography variant="h6" component="div">
      {stuffLocation.charAt(0).toUpperCase() + stuffLocation.slice(1)}
    </Typography>
  );

  const durabilityText = durability && (
    <Box
      sx={{
        flex: "1 1 auto",
        display: "flex",
        justifyContent: isHorizontalLayout ? "center" : "flex-end",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {durability.isRecommended ? (
        <ThumbUpOutlined color="success" sx={{ width: "18px" }} />
      ) : (
        <ThumbDownOutlined sx={{ width: "18px" }} />
      )}
      <Typography variant="body2" color="text.secondary">
        {durationText}
      </Typography>
    </Box>
  );

  const description = durability?.description && (
    <Typography
      variant="body2"
      sx={{ textAlign: isHorizontalLayout ? "center" : "left" }}
    >
      {durability.description}
    </Typography>
  );

  return (
    <Card
      variant="outlined"
      sx={{
        position: "relative",
        width: isHorizontalLayout ? CARD_WIDTH : "100%",
      }}
    >
      <CardActionArea
        onClick={handleClick}
        disabled={!onSelect || disabled}
        className={disabled ? "" : "gradient-light"}
        sx={{
          backgroundColor: isSelected
            ? theme.palette.mode === "light"
              ? theme.palette.secondary.light
              : theme.palette.secondary.dark
            : disabled
            ? theme.palette.action.disabledBackground
            : "transparent",
          height: "100%",
          padding: "14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: isHorizontalLayout ? "column" : "row",
            alignItems: "center",
            columnGap: "8px",
            mb: "4px",
          }}
        >
          {icon}
          {locationText}
          {durabilityText}
        </Box>
        {description}
      </CardActionArea>
      <Loading loading={!!loading}></Loading>
    </Card>
  );
});

export default DurabilityCard;
