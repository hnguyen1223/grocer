import ModalLayout from "../../shared/components/ModalLayout";
import {
  ChangeEvent,
  FocusEventHandler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StuffsDispatchContext } from "../../core/StuffsProvider";
import { STUFF_ACTION_TYPE } from "../../shared/interfaces/reducer.model";
import { StuffLocation } from "../../shared/interfaces";
import {
  CreateModalContext,
  CreateModalTogglerContext,
} from "../../core/CreateStuffProvider";
import { AutoAwesome } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Stack, Box, TextField, Typography, Button } from "@mui/material";
import { isDesktop } from "react-device-detect";
import DurabilityCard from "./DurabilityCard";
import { useGetShelfLife } from "../../shared/hooks";

export default function CreateStuff() {
  const isModalShown = useContext(CreateModalContext);
  const setIsModalShown = useContext(CreateModalTogglerContext);
  const dispatch = useContext(StuffsDispatchContext);

  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<StuffLocation>();
  const [expiryDate, setExpiryDate] = useState<string>();
  const [gpt, setGpt] = useState<number>(3);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>();
  const isFormValid = name && location;

  const [
    getShelfLife,
    clearShelfLife,
    freezer,
    fridge,
    outside,
    freezerLoading,
    fridgeLoading,
    outsideLoading,
    freezerError,
    fridgeError,
    outsideError,
    id,
    emoji,
  ] = useGetShelfLife();

  function handleNameInput(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setName(e.target.value);
    clearShelfLife();
    console.log("nameChange");
  }

  function handleAction() {
    if (isFormValid) {
      const durabilities = { freezer, fridge, outside };
      const stuff = {
        id,
        name,
        location,
        durabilities,
        emoji,
        ...(expiryDate ? { expiryDate } : {}),
      };
      dispatch({
        type: STUFF_ACTION_TYPE.ADD,
        stuff,
      });
      handleClose();
    }
  }

  // Need to reset state manual as compoent may be kept mounted in drawer on mobile layout
  // or due to this dialog bug when on desktop https://github.com/mui/material-ui/issues/10572
  function handleClose() {
    setIsModalShown(false);
    setName("");
    setLocation(undefined);
    setExpiryDate(undefined);
    clearShelfLife();
  }

  function handleGptChange() {
    setGpt(gpt === 3 ? 4 : 3);
    clearShelfLife();
    getShelfLife(name, gpt);
  }

  const handleFocus: FocusEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => event.target.select();

  useEffect(() => {
    if (isDesktop && isModalShown && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModalShown]);

  return (
    <ModalLayout open={isModalShown} onClose={handleClose}>
      <Stack
        direction="row"
        useFlexGap
        flexWrap="wrap"
        rowGap={2}
        columnGap={2}
        sx={{ width: isDesktop ? 480 : "100%", justifyContent: "center" }}
      >
        <Box sx={{ flex: "1 1 auto", display: "flex" }}>
          <TextField
            inputRef={inputRef}
            id="name"
            placeholder="New Item"
            variant="outlined"
            value={name}
            onChange={handleNameInput}
            sx={{ flex: "1 1 auto" }}
            inputProps={{
              style: {
                fontSize: 28,
                fontWeight: 600,
                padding: "0 0 8px 0",
              },
            }}
            InputProps={{
              startAdornment: emoji && (
                <span style={{ textWrap: "nowrap" }}>{emoji}&nbsp;</span>
              ),
            }}
            onFocus={handleFocus}
          />
          <LoadingButton
            onClick={() => getShelfLife(name, gpt)}
            loading={freezerLoading || fridgeLoading || outsideLoading}
            loadingPosition="center"
            variant="contained"
            disabled={!name || !!fridge || !!freezer || !!outside}
          >
            <AutoAwesome />
          </LoadingButton>
        </Box>
        <DurabilityCard
          stuffLocation={StuffLocation.FREEZER}
          durability={freezer}
          isSelected={location === StuffLocation.FREEZER}
          onSelect={setLocation}
          loading={freezerLoading}
        ></DurabilityCard>
        <DurabilityCard
          stuffLocation={StuffLocation.FRIDGE}
          durability={fridge}
          isSelected={location === StuffLocation.FRIDGE}
          onSelect={setLocation}
          loading={fridgeLoading}
        ></DurabilityCard>
        <DurabilityCard
          stuffLocation={StuffLocation.OUTSIDE}
          durability={outside}
          isSelected={location === StuffLocation.OUTSIDE}
          onSelect={setLocation}
          loading={outsideLoading}
        ></DurabilityCard>
        {fridge && (
          <Box
            sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
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
      </Stack>
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
