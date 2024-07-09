import Box from "@mui/material/Box";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import AnketoIcon from "../assets/anketo.svg";
import HomeIcon from "../assets/home.svg";
import ListIcon from "../assets/list.svg";

const menuItems = [
  {
    id: "home",
    title: "ホーム",
    path: "/",
    Icon: HomeIcon,
  },
  {
    id: "session",
    title: "セッション",
    path: "/session",
    Icon: ListIcon,
  },
  {
    id: "questionnaire",
    title: "アンケート",
    path: "/questionnaire",
    Icon: AnketoIcon,
  },
];

const Header: React.FC = () => {
  const location = useLocation();
  const activeTab =
    menuItems.find((item) =>
      item.path === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.path)
    )?.id || "";

  return (
    <Box
      position="sticky"
      top="0px"
      sx={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
      pb="8px"
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="32px 0"
        fontFamily="Kanit, sans-serif"
        fontSize="20px"
        fontWeight="500"
        lineHeight="30px"
      >
        Classmethod Odyssey
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        gap="16px"
        paddingX="24px"
        justifyContent="space-between"
      >
        {menuItems.map((item) => (
          <Menu
            key={item.id}
            isActive={activeTab === item.id}
            title={item.title}
            path={item.path}
            Icon={item.Icon}
          />
        ))}
      </Box>
    </Box>
  );
};

interface MenuProps {
  isActive: boolean;
  title: string;
  path: string;
  Icon: string;
}

const Menu: React.FC<MenuProps> = ({ isActive, title, path, Icon }) => {
  return (
    <Box
      component={Link}
      to={path}
      sx={{
        backgroundColor: isActive ? "primary.main" : "transparent",
        color: isActive ? "white" : "text.primary",
        height: "40px",
        width: isActive ? "100%" : "40px",
        borderRadius: "20px",
        border: "0.5px solid rgba(105, 105, 105, 1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease-in-out",
        flexGrow: isActive ? 1 : 0,
        flexShrink: isActive ? undefined : 0,
        overflow: "hidden",
        textDecoration: "none",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          position: "absolute",
          left: 0,
        }}
      >
        <img
          src={Icon}
          alt={title}
          style={{
            width: "16px",
            height: "16px",
            filter: isActive ? "brightness(0) invert(1)" : "none",
            transition: "filter 0.5s ease-in-out",
          }}
        />
      </Box>
      <Box
        sx={{
          opacity: isActive ? 1 : 0,
          transition:
            "opacity 0.3s ease-in-out, transform 0.3s ease-in-out 0.1s",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}
      >
        {title}
      </Box>
    </Box>
  );
};

export default Header;
