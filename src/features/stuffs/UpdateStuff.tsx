import { Box, Button, Typography } from "@mui/material";
import ModalLayout from "../../shared/components/ModalLayout";
import Durabilities from "./Durabilities";
import { useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import {
  StuffsContext,
  StuffsDispatchContext,
} from "../../core/StuffsProvider";
import { ThumbDown, ThumbUp } from "@mui/icons-material";
import { Stuff, StuffActionType, StuffStatus } from "../../shared/interfaces";

export default function UpdateStuff() {
  const navigate = useNavigate();
  const params = useParams();
  const allStuffs = useContext(StuffsContext);
  const dispatch = useContext(StuffsDispatchContext);

  const stuff = allStuffs.find((stuff) => stuff.id === params.stuffId);

  if (!stuff) {
    return null; // TODO: 404
  }

  function handleClose() {
    navigate("../");
  }

  function handleStatusUpdate(status: StuffStatus) {
    dispatch({
      type: StuffActionType.UPDATE,
      stuff: {
        id: stuff!.id,
        status,
      },
    });
    handleClose();
  }

  function handleRemove() {
    dispatch({
      type: StuffActionType.DELETE,
      stuff: stuff as Stuff,
    });
    handleClose();
  }

  const displayName = stuff.name + (stuff.emoji && " " + stuff.emoji);
  const fridge = {
    data: stuff.durabilities.fridge,
    loading: false,
    error: undefined,
  };
  const freezer = {
    data: stuff.durabilities.freezer,
    loading: false,
    error: undefined,
  };
  const outside = {
    data: stuff.durabilities.outside,
    loading: false,
    error: undefined,
  };

  return (
    <ModalLayout open={true} onClose={handleClose}>
      <Box>
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            padding: "0 0 8px 0",
          }}
        >
          {displayName}
        </div>
        <Durabilities
          selectedLocation={stuff.location}
          fridge={fridge}
          freezer={freezer}
          outside={outside}
          disabled
        ></Durabilities>
      </Box>

      {!stuff.status && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "right",
            mt: 2,
            gap: 2,
            alignItems: "center",
          }}
        >
          <Typography variant="body1" fontWeight={600} mr={1}>
            Finished?
          </Typography>
          <Button
            disabled={false}
            onClick={() => handleStatusUpdate(StuffStatus.SPOILED)}
            startIcon={<ThumbDown />}
            color="warning"
          >
            Spoiled
          </Button>
          <Button
            disabled={false}
            onClick={() => handleStatusUpdate(StuffStatus.FINISHED)}
            startIcon={<ThumbUp />}
            color="success"
          >
            Good
          </Button>
        </Box>
      )}
    </ModalLayout>
  );
}
