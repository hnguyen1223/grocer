import {
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Fab,
} from "@mui/material";
import {
  Add,
  InsertChart,
  InsertChartOutlined,
  Kitchen,
  KitchenOutlined,
} from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { CreateModalTogglerContext } from "./CreateStuffProvider";

export default function NavBar() {
  const setIsModalShown = useContext(CreateModalTogglerContext);

  return (
    <Paper
      sx={{
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: "52px",
      }}
      elevation={3}
    >
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 24, right: "calc(50% - 28px)" }}
        onClick={() => setIsModalShown(true)}
      >
        <Add />
      </Fab>
      <BottomNavigation showLabels sx={{ width: "100%" }}>
        <BottomNavigationAction
          component={NavLink}
          to="/stuffs"
          label="Stuffs"
          icon={
            <>
              <KitchenOutlined className="nav-icon" />
              <Kitchen className="nav-icon-active" sx={{ display: "none" }} />
            </>
          }
          sx={{ mr: "24px" }}
        />
        <BottomNavigationAction
          component={NavLink}
          to="/stats"
          label="Stats"
          icon={
            <>
              {" "}
              <InsertChartOutlined className="nav-icon" />
              <InsertChart
                className="nav-icon-active"
                sx={{ display: "none" }}
              />
            </>
          }
          sx={{ ml: "24px" }}
        />
      </BottomNavigation>
    </Paper>
  );
}
