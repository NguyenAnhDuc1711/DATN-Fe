import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NOTIFICATION_PATH, Route } from "../../Breads-Shared/APIConfig";
import { Constants } from "../../Breads-Shared/Constants";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import useShowToast from "../../hooks/useShowToast";
import Socket from "../../socket";
import { IUserShortInfo } from "../../store/PostSlice";
import { IUser } from "../../store/UserSlice";
import { followUser } from "../../store/UserSlice/asyncThunk";
import { addEvent } from "../../util";
import UnFollowPopup from "./UnfollowPopup";
import { openLoginPopupAction } from "../../store/UtilSlice";

export const handleFollow = async (
  userInfo: IUser,
  user: IUserShortInfo,
  dispatch: any,
  showToast: Function
) => {
  if (!userInfo?._id) {
    return;
  }
  dispatch(
    followUser({
      userFlId: user._id,
      userId: userInfo._id,
    })
  );
  try {
    const socket = Socket.getInstant();
    socket.emit(Route.NOTIFICATION + NOTIFICATION_PATH.CREATE, {
      fromUser: userInfo._id,
      toUsers: [user._id],
      action: Constants.NOTIFICATION_ACTION.FOLLOW,
      target: "",
    });
  } catch (error) {
    showToast("Error", error, "error");
  }
};

const FollowBtn = ({
  user,
  inUserFlBox = false,
}: {
  user: IUser;
  inUserFlBox?: boolean;
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.user.userInfo);
  const currentPage = useAppSelector((state) => state.util.currentPage);
  const isFollowing = userInfo?.following?.includes(user?._id);
  const showToast = useShowToast();
  const [openCancelPopup, setOpenCancelPopup] = useState<boolean>(false);

  const clickFollowBtn = () => {
    if (!userInfo?._id) {
      dispatch(openLoginPopupAction());
      return;
    }
    if (isFollowing) {
      setOpenCancelPopup(true);
    } else {
      addEvent({
        event: "follow_user",
        payload: {
          userId: user._id,
        },
      });
      handleFollow(userInfo, user, dispatch, showToast);
    }
  };
  return (
    <div
      style={{
        flex: currentPage === PageConstant.FRIEND && !inUserFlBox ? 1 : "",
      }}
    >
      <Button
        width={
          currentPage === PageConstant.FRIEND && !inUserFlBox ? "100%" : ""
        }
        size={"md"}
        onClick={() => {
          clickFollowBtn();
        }}
      >
        {isFollowing
          ? t("unfollow")
          : userInfo.followed?.includes(user?._id)
          ? t("followback")
          : t("follow")}
      </Button>
      <UnFollowPopup
        user={user}
        isOpen={openCancelPopup}
        onClose={() => setOpenCancelPopup(false)}
        onClick={() => {
          addEvent({
            event: "unfollow_user",
            payload: {
              userId: user._id,
            },
          });
          handleFollow(userInfo, user, dispatch, showToast);
          setOpenCancelPopup(false);
        }}
      />
    </div>
  );
};

export default FollowBtn;
