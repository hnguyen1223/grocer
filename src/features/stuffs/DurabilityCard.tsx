import { Box, Card, CardActionArea, Typography, useTheme } from "@mui/material";
import { Durability, StuffLocation } from "../../shared/interfaces";
import { ThumbDownOutlined, ThumbUpOutlined } from "@mui/icons-material";
import { isDesktop } from "react-device-detect";
import { memo, useCallback } from "react";
import Loading from "../../shared/components/Loading";
import LocationIcon from "../../shared/components/LocationIcon";
import { DataWithState } from "../../shared/interfaces/data.model";
import useIsHorizontal from "../../shared/hooks/layout";

const CARD_WIDTH = 172;

const DurabilityCard = memo(function DurabilityCard({
  durability,
  stuffLocation,
  isSelected,
  onSelect,
  disabled,
}: {
  stuffLocation: StuffLocation;
  isSelected: boolean;
  onSelect: (location: StuffLocation) => void;
  disabled?: boolean;
  durability: DataWithState<Durability, any>;
}) {
  const theme = useTheme();
  const isHorizontal = useIsHorizontal();

  const handleClick = useCallback(() => {
    onSelect(stuffLocation);
  }, [onSelect, stuffLocation]);

  const isHorizontalLayout = isDesktop || isHorizontal;
  const durationText = durability.data?.days
    ? `${durability.data.days} day${durability.data.days > 1 ? "s" : ""}`
    : durability.data?.hours
    ? `${durability.data.hours} hour${durability.data.hours > 1 ? "s" : ""}`
    : "";

  const locationText = (
    <Typography variant="h6" component="div">
      {stuffLocation.charAt(0).toUpperCase() + stuffLocation.slice(1)}
    </Typography>
  );

  const durabilityText = durability.data && (
    <Box
      sx={{
        flex: "1 1 auto",
        display: "flex",
        justifyContent: isHorizontalLayout ? "center" : "flex-end",
        gap: "8px",
        alignItems: "center",
      }}
    >
      {durability.data.isRecommended ? (
        <ThumbUpOutlined color="success" sx={{ width: "18px" }} />
      ) : (
        <ThumbDownOutlined sx={{ width: "18px" }} />
      )}
      <Typography variant="body2" color="text.secondary">
        {durationText}
      </Typography>
    </Box>
  );

  const description = durability.data?.description && (
    <Typography
      variant="body2"
      sx={{ textAlign: isHorizontalLayout ? "center" : "left" }}
    >
      {durability.data.description}
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
          alignItems: "unset",
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
          <LocationIcon stuffLocation={stuffLocation}></LocationIcon>
          {locationText}
          {durabilityText}
        </Box>
        {description}
      </CardActionArea>
      <Loading loading={!!durability.loading}></Loading>
    </Card>
  );
});

export default DurabilityCard;
