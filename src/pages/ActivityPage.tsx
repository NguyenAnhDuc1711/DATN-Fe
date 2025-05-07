import { useEffect } from "react";
import { useSelector } from "react-redux";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import Activity from "../components/Activity";
import ContainerLayout from "../components/MainBoxLayout";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { AppState } from "../store";
import { getNotificattions } from "../store/NotificationSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const ActivityPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const { currentPage, displayPageData } = useSelector(
    (state: AppState) => state.util
  );
  const notifications = useAppSelector(
    (state: AppState) => state.notification.notifications
  );

  useEffect(() => {
    dispatch(
      changePage({
        nextPage: PageConstant.ACTIVITY,
        currentPage: currentPage,
      })
    );
    if (userInfo?._id) {
      dispatch(
        getNotificattions({
          userId: userInfo?._id,
          page: 1,
          limit: 15,
        })
      );
      addEvent({
        event: "see_page",
        payload: {
          page: "activity",
        },
      });
    }
  }, [userInfo]);

  return (
    <>
      <ContainerLayout>
        <Activity currentPage={displayPageData} />
      </ContainerLayout>
    </>
  );
};

export default ActivityPage;
