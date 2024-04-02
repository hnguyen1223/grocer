import { DisplaySettings } from "@mui/icons-material";
import {
  Button,
  Popover,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { MouseEvent, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { StuffView } from "../../shared/interfaces";
import { StuffViewContext, SetStuffViewContext } from "./Stuffs";

//TODO: add grouping, sorting and filtering controls
export default function ViewControl() {
  const view = useContext(StuffViewContext);
  const setView = useContext(SetStuffViewContext);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const headerControlRef = useRef<HTMLElement | null>(null);
  const open = Boolean(anchorEl);
  function handleOpen(e: MouseEvent<HTMLElement>) {
    setAnchorEl(e.currentTarget);
  }

  function handleClose(_: MouseEvent<HTMLElement>) {
    setAnchorEl(null);
  }

  const handleViewSelect = (
    e: MouseEvent<HTMLElement>,
    newView: StuffView | null
  ) => {
    setView(newView as StuffView);
    handleClose(e);
  };

  useEffect(() => {
    headerControlRef.current = document.getElementById("header-control");
  }, []);

  return (
    <>
      {headerControlRef.current &&
        createPortal(
          <Button
            variant="text"
            onClick={handleOpen}
            startIcon={<DisplaySettings />}
            size="large"
          >
            View
          </Button>,
          headerControlRef.current
        )}
      <Popover
        id="view-control"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleViewSelect}
          aria-label="stuff view"
          orientation="vertical"
        >
          <ToggleButton
            value={StuffView.EXPIRY}
            aria-label="by expiry date"
            size="medium"
          >
            {StuffView.EXPIRY}
          </ToggleButton>
          <ToggleButton
            value={StuffView.LOCATION}
            aria-label="by location"
            size="medium"
          >
            {StuffView.LOCATION}
          </ToggleButton>
          <ToggleButton
            value={StuffView.CATEGORY}
            aria-label="by category"
            size="medium"
          >
            {StuffView.CATEGORY}
          </ToggleButton>
        </ToggleButtonGroup>
      </Popover>
    </>
  );
}
