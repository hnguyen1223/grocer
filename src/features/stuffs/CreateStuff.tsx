import ModalLayout from "../../shared/components/ModalLayout";
import {
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StuffsDispatchContext } from "../../core/StuffsProvider";
import { StuffActionType } from "../../shared/interfaces/reducer.model";
import { StuffLocation } from "../../shared/interfaces";
import {
  CreateModalContext,
  CreateModalTogglerContext,
} from "../../core/CreateStuffProvider";
import { Box, TextField, Typography, Button, useTheme } from "@mui/material";
import { isDesktop } from "react-device-detect";
import { useGetShelfLife } from "../../shared/hooks";
import { AutoAwesome } from "@mui/icons-material";
import Loading from "../../shared/components/Loading";
import SvgGradient from "../../shared/components/SvgGradient";
import Durabilities from "./Durabilities";

export default function CreateStuff() {
  const theme = useTheme();
  const isModalShown = useContext(CreateModalContext);
  const setIsModalShown = useContext(CreateModalTogglerContext);
  const dispatch = useContext(StuffsDispatchContext);
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<StuffLocation>();
  const [expiryDate, setExpiryDate] = useState<string>();
  const [gpt, setGpt] = useState<number>(3);
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
  } = useGetShelfLife();

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

  function handleAction() {
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
      handleClose();
    }
  }

  function handleAI() {
    clearState();
    getShelfLife(name, gpt);
  }

  // Need to reset state manual as compoent may be kept mounted in drawer on mobile layout
  // or due to this dialog bug when on desktop https://github.com/mui/material-ui/issues/10572
  function handleClose() {
    setIsModalShown(false);
    clearState(true);
  }

  function handleGptChange() {
    setGpt(gpt === 3 ? 4 : 3);
    handleAI();
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
    if (isDesktop && isModalShown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalShown]);

  return (
    <ModalLayout open={isModalShown} onClose={handleClose}>
      <Box>
        <Box sx={{ flex: "1 1 auto", display: "flex", mb: 3 }}>
          <TextField
            inputRef={inputRef}
            id="name"
            placeholder="New Item✨✨"
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
              Powered by GPT-{gpt}.{gpt === 3 && " Not happy?"}
            </Typography>
            {gpt === 3 && (
              <Button variant="outlined" size="small" onClick={handleGptChange}>
                Try GPT-4
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box display="flex" justifyContent="right" marginTop={2} gap={1}>
        <Button onClick={handleClose} color="warning">
          Cancel
        </Button>
        <Button
          disabled={!isFormValid}
          onClick={handleAction}
          variant="contained"
        >
          Add
        </Button>
      </Box>
    </ModalLayout>
  );
}
