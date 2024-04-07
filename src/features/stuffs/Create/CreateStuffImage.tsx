import { AutoAwesome, Replay } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
import Loading from "../../../shared/components/Loading";
import SvgGradient from "../../../shared/components/SvgGradient";
import { UserContext } from "../../../core/UserProvider";
import { useObjectRecognition } from "../../../shared/hooks";

export default function CreateStuffImage({
  file,
  onReSelect,
  onItemSelect,
}: {
  file: File | null;
  onReSelect: () => void;
  onItemSelect: (item: string) => void;
}) {
  const user = useContext(UserContext);
  const [upload, status, objects, loading, error] = useObjectRecognition();
  const [choice, setChoice] = useState<string>("");
  const processDisabled = !file || !user?.uid || loading;
  const proceedDisabled = !choice;
  const choices = [...new Set(objects ?? [])];

  const [imgUrl, setImgUrl] = useState<string>();
  useEffect(() => {
    let url: string;
    if (file) {
      url = URL.createObjectURL(file);
      setImgUrl(url);
    }
    return () => {
      url && URL.revokeObjectURL(url);
    };
  }, [file]);

  function handleFileUpload() {
    if (file && user?.uid) {
      upload(file);
    }
  }

  function handleChoiceChange(event: ChangeEvent<HTMLInputElement>) {
    setChoice((event.target as HTMLInputElement).value);
  }

  function handleProceed() {
    if (choice) {
      onItemSelect(choice);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        rowGap: 2,
      }}
    >
      <img
        src={imgUrl}
        style={{
          width: isDesktop ? "360px" : "100%",
          maxHeight: "248px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      ></img>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Button variant="outlined" startIcon={<Replay />} onClick={onReSelect}>
          Choose another
        </Button>
        <Button
          disabled={processDisabled}
          variant="outlined"
          startIcon={
            <>
              <SvgGradient></SvgGradient>
              <AutoAwesome sx={{ fill: "url(#gradient)" }} />
            </>
          }
          onClick={handleFileUpload}
        >
          {loading ? status : `Process ${status ? "again" : ""}`}
          <Loading loading={loading}></Loading>
        </Button>
      </Box>
      {!error && !loading && !!status && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            rowGap: 1,
            mt: 2,
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {!!objects?.length ? "Recognized objects" : "No objects recognized"}
          </Typography>

          <RadioGroup
            name="radio-buttons-group"
            row
            value={choice}
            onChange={handleChoiceChange}
          >
            {choices.map((name) => (
              <FormControlLabel
                key={name}
                value={name}
                control={<Radio />}
                label={name}
              />
            ))}
          </RadioGroup>
          {!!objects?.length && (
            <Button
              variant="contained"
              onClick={handleProceed}
              disabled={proceedDisabled}
            >
              Proceed
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
