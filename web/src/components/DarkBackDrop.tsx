import { Backdrop } from "@mui/material";
import React from "react";

export const DarkBackDrop = ({
  isShow,
  children,
  onClickBackdrop,
}: {
  isShow: boolean;
  children: React.ReactNode;
  onClickBackdrop: () => void;
}) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isShow}
      onClick={onClickBackdrop}
    >
      {children}
    </Backdrop>
  );
};
