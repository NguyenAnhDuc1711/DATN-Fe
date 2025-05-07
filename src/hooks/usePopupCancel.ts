import { useState } from "react";

type PopupBox = {
  open: boolean;
  title: string;
  content: string;
  leftBtnText: string;
  rightBtnText: string;
  leftBtnAction: Function;
  rightBtnAction: Function;
};

const usePopupCancel = () => {
  const defaultPopupInfo: PopupBox = {
    open: false,
    title: "",
    content: "",
    leftBtnText: "",
    rightBtnText: "",
    leftBtnAction: () => {},
    rightBtnAction: () => {},
  };
  const [popupCancelInfo, setPopupCancelInfo] =
    useState<PopupBox>(defaultPopupInfo);

  const closePopupCancel = () => {
    setPopupCancelInfo(defaultPopupInfo);
  };

  return {
    popupCancelInfo,
    setPopupCancelInfo,
    closePopupCancel,
  };
};

export default usePopupCancel;
