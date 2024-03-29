import { List, Typography } from "@mui/material";
import { Stuff } from "../../shared/interfaces";
import StuffRow from "./StuffRow";

export default function StuffList({
  stuffs,
  title,
}: {
  stuffs: Stuff[];
  title?: string;
}) {
  return (
    stuffs.length > 0 && (
      <List
        sx={{ maxWidth: 480 }}
        subheader={
          title && (
            <Typography align="left" variant="h6">
              {title}
            </Typography>
          )
        }
      >
        {stuffs.map((stuff) => (
          <StuffRow key={stuff.id} stuff={stuff}></StuffRow>
        ))}
        {stuffs.map((stuff) => (
          <StuffRow key={stuff.id + 10} stuff={stuff}></StuffRow>
        ))}
        {stuffs.map((stuff) => (
          <StuffRow key={stuff.id + 20} stuff={stuff}></StuffRow>
        ))}
      </List>
    )
  );
}
