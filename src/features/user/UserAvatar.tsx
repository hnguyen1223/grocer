import { memo, useContext } from "react";
import { UserContext } from "../../core/UserProvider";
import { AccountCircle } from "@mui/icons-material";
import AIBadge from "../../shared/components/AIBadge";
import { IconButton } from "@mui/material";

const AVATAR_SIZES = {
  small: "34px",
  medium: "48px",
  large: "64px",
};

const UserAvatar = memo(function UserAvatar({
  size = "small",
  onClick,
}: {
  size?: "small" | "medium" | "large";
  onClick?: () => void;
}) {
  const user = useContext(UserContext);
  return (
    <AIBadge enhanced={!!user}>
      <IconButton sx={{ padding: 0 }} disabled={!onClick} onClick={onClick}>
        {user?.photoURL ? (
          <img
            style={{
              borderRadius: "50%",
              width: AVATAR_SIZES[size],
              height: AVATAR_SIZES[size],
            }}
            src={user.photoURL}
            referrerPolicy="no-referrer"
          />
        ) : (
          <AccountCircle fontSize="large" />
        )}
      </IconButton>
    </AIBadge>
  );
});

export default UserAvatar;
