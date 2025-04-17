import { useEffect } from "react";
import { Constants } from "../Breads-Shared/Constants";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import CreatePostBar from "../components/CreatePostBar";
import ListPost from "../components/ListPost";
import ContainerLayout from "../components/MainBoxLayout";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { AppState } from "../store";
import { getPosts } from "../store/PostSlice/asyncThunk";
import { changeDisplayPageData } from "../store/UtilSlice";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const HomePage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const { currentPage, displayPageData } = useAppSelector(
    (state: AppState) => state.util
  );
  const { FOR_YOU } = PageConstant;

  useEffect(() => {
    if (userInfo?._id && userInfo?.role === Constants.USER_ROLE.ADMIN) {
      window.location.href =
        window.location.origin + "/" + PageConstant.ADMIN.DEFAULT;
    }
  }, [userInfo?._id]);

  useEffect(() => {
    dispatch(
      changePage({
        nextPage: PageConstant.HOME,
        currentPage,
      })
    );
    handleGetDataByPage();
    addEvent({
      event: "see_page",
      payload: {
        page: "home",
      },
    });
  }, []);

  useEffect(() => {
    if (currentPage === PageConstant.HOME) {
      dispatch(
        getPosts({
          filter: { page: displayPageData },
          userId: localStorage.getItem("userId"),
          isNewPage: true,
        })
      );
    }
  }, [displayPageData, currentPage]);

  const handleGetDataByPage = (): void => {
    let pathname = window.location.pathname;
    pathname = pathname.slice(1, pathname.length);
    let result = "";
    if (!pathname) {
      result = FOR_YOU;
    } else {
      result = pathname;
    }
    if (result) {
      dispatch(changeDisplayPageData(result));
    }
  };

  return (
    <ContainerLayout>
      <>
        {(displayPageData === FOR_YOU ||
          window.location.pathname
            ?.slice(1, window.location.pathname.length)
            ?.toLowerCase() === PageConstant.HOME) && <CreatePostBar />}
        <ListPost />
      </>
    </ContainerLayout>
  );
};

export default HomePage;
