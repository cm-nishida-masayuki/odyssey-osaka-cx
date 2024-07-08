import HomeIcon from "../assets/home.svg";
import HomeActiveIcon from "../assets/home_active.svg";
import AnketoIcon from "../assets/anketo.svg";
import AnketoActiveIcon from "../assets/anketo_active.svg";
import ListIcon from "../assets/list.svg";
import ListActiveIcon from "../assets/list_active.svg";
import Box from "@mui/material/Box";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  let activeTab = "";
  if (location.pathname === "/") {
    activeTab = "home";
  }
  if (location.pathname.startsWith("/session")) {
    activeTab = "session";
  }
  if (location.pathname.startsWith("/questionnaire")) {
    activeTab = "questionnaire";
  }

  return (
    <Box
      position="sticky"
      top="0px"
      sx={{ backgroundColor: "rgba(245, 245, 245, 1)" }}
      pb="8px"
    >
      <Box
        height="150px"
        display="flex"
        alignItems="center"
        justifyContent="center"
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
        <Menu isActive={activeTab === "home"} title="ホーム" path="/">
          <img src={activeTab === "home" ? HomeActiveIcon : HomeIcon} />
        </Menu>
        <Menu
          isActive={activeTab === "session"}
          title="セッション"
          path="/session"
        >
          <img src={activeTab === "session" ? ListActiveIcon : ListIcon} />
        </Menu>
        <Menu
          isActive={activeTab === "questionnaire"}
          title="アンケート"
          path="/questionnaire"
        >
          <img
            src={activeTab === "questionnaire" ? AnketoActiveIcon : AnketoIcon}
          />
        </Menu>
      </Box>
    </Box>
  );
};

export const Menu = ({
  isActive = false,
  title,
  children,
  path,
}: {
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
  path: string;
}) => {
  return (
    <Link to={path}>
      <Box
        sx={{
          backgroundColor: isActive ? "primary.main" : "",
          flexGrow: isActive ? 1 : 0,
        }}
        color={isActive ? "primary.main" : "text.primary"}
        width={isActive ? "233px" : "40px"}
        height={"40px"}
        borderRadius="20px"
        border="0.5px solid rgba(105, 105, 105, 1)"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {isActive ? (
          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            paddingX="16px"
          >
            {children}
            <p style={{ color: "white" }}>{title}</p>
            <div></div>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Link>
  );
};

export default Header;
