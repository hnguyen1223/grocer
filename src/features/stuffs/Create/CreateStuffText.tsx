import {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StuffsDispatchContext } from "../../../core/StuffsProvider";
import { StuffActionType } from "../../../shared/interfaces/reducer.model";
import { GptVersion, StuffLocation } from "../../../shared/interfaces";
import { Box, TextField, Typography, Button, useTheme } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { useGetShelfLife } from "../../../shared/hooks";
import { AutoAwesome, SellOutlined } from "@mui/icons-material";
import Loading from "../../../shared/components/Loading";
import SvgGradient from "../../../shared/components/SvgGradient";
import Durabilities from "../Durabilities";

export default function CreateStuffText({
  nameFromImage,
  existingRequestId,
  onClose,
}: {
  nameFromImage?: string;
  existingRequestId?: string;
  onClose: () => void;
}) {
  const theme = useTheme();
  const dispatch = useContext(StuffsDispatchContext);
  const [name, setName] = useState<string>(nameFromImage ?? "");
  const [location, setLocation] = useState<StuffLocation>();
  const [expiryDate, setExpiryDate] = useState<string>();
  const [gpt, setGpt] = useState<GptVersion>(GptVersion.THREE);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();
  const {
    getShelfLife,
    clearShelfLife,
    freezer,
    fridge,
    outside,
    id,
    emoji,
    category,
  } = useGetShelfLife(existingRequestId);

  const isFormValid = name && location;
  const loading = freezer.loading || fridge.loading || outside.loading;
  const getShelfLifeDisabled =
    !name || !!fridge.data || !!freezer.data || !!outside.data;
  const displayName = name + (emoji.data && " " + emoji.data);

  function handleNameInput(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setName(e.target.value);
    clearState();
  }

  function handleAdd() {
    if (isFormValid) {
      const stuff = {
        id,
        name,
        location,
        durabilities: {
          freezer: freezer.data,
          fridge: fridge.data,
          outside: outside.data,
        },
        emoji: emoji.data,
        category: category.data,
        ...(expiryDate ? { expiryDate } : {}),
      };
      dispatch({
        type: StuffActionType.ADD,
        stuff,
      });
      onClose();
    }
  }

  function handleAI() {
    clearState();
    getShelfLife(name, gpt);
  }

  function handleGptChange() {
    const newGpt =
      gpt === GptVersion.THREE ? GptVersion.FOUR : GptVersion.THREE;
    setGpt(newGpt);
    clearState();
    getShelfLife(name, newGpt);
  }

  const handleFocus: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => event.target.select();

  const handleEnter: KeyboardEventHandler = (e) => {
    if (e.key === "Enter") {
      handleAI();
    }
  };

  function clearState(clearName = false) {
    clearName && setName("");
    setLocation(undefined);
    setExpiryDate(undefined);
    clearShelfLife();
  }

  useEffect(() => {
    if (nameFromImage) {
      handleAI();
    } else if (isDesktop && inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <Box>
        <Box sx={{ flex: "1 1 auto", display: "flex" }}>
          <TextField
            inputRef={inputRef}
            id="name"
            placeholder="New Item"
            variant="outlined"
            value={displayName}
            onChange={handleNameInput}
            sx={{ flex: "1 1 auto" }}
            inputProps={{
              style: {
                fontSize: 28,
                fontWeight: 600,
                padding: "0 0 8px 0",
              },
            }}
            onFocus={handleFocus}
            disabled={loading}
            onKeyDown={handleEnter}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: theme.palette.background.default }}
            disabled={getShelfLifeDisabled}
            onClick={handleAI}
          >
            <Loading loading={loading}></Loading>
            <SvgGradient></SvgGradient>
            <AutoAwesome sx={{ fill: "url(#gradient)" }} />
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 0.5,
            alignItems: "center",
            visibility: category.data ? "visible" : "hidden",
            mb: 1,
          }}
        >
          <SellOutlined
            sx={{ fontSize: "1.3rem", color: theme.palette.text.secondary }}
          />
          <Typography variant="subtitle1" color="text.secondary">
            {category.data}
          </Typography>
        </Box>
        <Durabilities
          selectedLocation={location}
          onLocationSelect={setLocation}
          fridge={fridge}
          freezer={freezer}
          outside={outside}
        ></Durabilities>
        {fridge.data && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Typography variant="subtitle2" px={2}>
              Powered by GPT-{gpt}.{gpt === GptVersion.THREE && " Not happy?"}
            </Typography>
            {gpt === GptVersion.THREE && (
              <Button variant="outlined" size="small" onClick={handleGptChange}>
                Try GPT-4
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="right" marginTop={2} gap={1}>
        <Button onClick={onClose} color="warning">
          Cancel
        </Button>
        <Button disabled={!isFormValid} onClick={handleAdd} variant="contained">
          Add
        </Button>
      </Box>
    </>
  );
}
