import { Button, useColorMode } from "@chakra-ui/react";
import { FaFacebookMessenger, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { changePage } from "../../store/UtilSlice/asyncThunk";

export const BtnLike = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentPage } = useAppSelector((state: AppState) => state.util);

  const getButtonColor = (isActive, colorMode) => {
    if (isActive) {
      return colorMode === "dark" ? "#f3f5f7" : "#000000";
    }
    return colorMode === "dark" ? "#4d4d4d" : "#a0a0a0";
  };

  const handleClick = (): void => {
    if (currentPage !== PageConstant.ACTIVITY) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.ACTIVITY }));
    }
    navigate("/" + PageConstant.ACTIVITY);
  };

  return (
    <Button
      bg="transparent"
      _hover={{ bg: "transparent" }}
      color={getButtonColor(currentPage === PageConstant.ACTIVITY, colorMode)}
      onClick={handleClick}
      width="60px"
      height="60px"
      minW="60px"
      minH="60px"
      display={["block", "block", "none"]}
    >
      <FaRegHeart size={24} />
    </Button>
  );
};

export const BtnMess = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();
  const { currentPage, displayPageData } = useAppSelector(
    (state: AppState) => state.util
  );
  const getButtonColor = (isActive, colorMode) => {
    if (isActive) {
      return colorMode === "dark" ? "#f3f5f7" : "#000000";
    }
    return colorMode === "dark" ? "#4d4d4d" : "#a0a0a0";
  };

  const handleClick = () => {
    if (currentPage !== PageConstant.CHAT) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.CHAT }));
    }
    navigate("/" + PageConstant.CHAT);
  };

  return (
    <Button
      bg="transparent"
      _hover={{ bg: "transparent" }}
      color={getButtonColor(currentPage === PageConstant.CHAT, colorMode)}
      onClick={handleClick}
      width="60px"
      height="60px"
      minW="60px"
      minH="60px"
      display={["block", "block", "none"]}
    >
      <FaFacebookMessenger size={24} />
    </Button>
  );
};
