import {
  AddCircleOutline,
  InsertChart,
  InsertChartOutlined,
  Kitchen,
  KitchenOutlined,
} from "@mui/icons-material";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { CreateModalTogglerContext } from "./CreateStuffProvider";
import { isDesktop } from "react-device-detect";

const DRAWER_WIDTH = 256;

export default function NavDrawer() {
  const setIsModalShown = useContext(CreateModalTogglerContext);
  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar variant={isDesktop ? "regular" : "dense"}>
        <Link to="/">
          <img src="/grocer.svg" width="32px" />
        </Link>
        <Typography pl={2} variant="h5">
          Grocer
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ pl: 1 }}>
        <ListItem key="new" disablePadding>
          <ListItemButton onClick={() => setIsModalShown(true)} disableRipple>
            <ListItemIcon>
              <AddCircleOutline color="secondary" />
            </ListItemIcon>
            <ListItemText primary="Add" />
          </ListItemButton>
        </ListItem>
        <ListItem key="stuffs" disablePadding>
          <ListItemButton component={NavLink} to="/stuffs" disableRipple>
            <ListItemIcon>
              <KitchenOutlined className="nav-icon" />
              <Kitchen className="nav-icon-active" sx={{ display: "none" }} />
            </ListItemIcon>
            <ListItemText primary="Stuffs" />
          </ListItemButton>
        </ListItem>
        <ListItem key="stats" disablePadding>
          <ListItemButton component={NavLink} to="/stats" disableRipple>
            <ListItemIcon>
              <InsertChartOutlined className="nav-icon" />
              <InsertChart
                className="nav-icon-active"
                sx={{ display: "none" }}
              />
            </ListItemIcon>
            <ListItemText primary="Stats" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}
