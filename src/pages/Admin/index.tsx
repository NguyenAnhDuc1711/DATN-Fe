import { Container } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Constants } from "../../Breads-Shared/Constants";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { LeftSideBarWidth } from "../../Layout";
import { AppState } from "../../store";
import { changePage } from "../../store/UtilSlice/asyncThunk";
import OverviewPage from "./OverviewPage";
import PostsCmsPage from "./PostsCmsPage";
import PostsValidationPage from "./PostsValidationPage";
import UsersCmsPage from "./UsersCmsPage";
import ReportPage from "./ReportPage.";

const AdminPage = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const isAdmin = userInfo?.role === Constants.USER_ROLE.ADMIN;
  const currentPage = useAppSelector(
    (state: AppState) => state.util.currentPage
  );
  let pathname = window.location.pathname;
  pathname = pathname.slice(1, pathname?.length);
  const { DEFAULT, POSTS, USERS, POSTS_VALIDATION, REPORT } =
    PageConstant.ADMIN;

  useEffect(() => {
    dispatch(changePage({ nextPage: pathname }));
  }, []);

  if (!isAdmin) {
    return <>Invalid Access</>;
  }

  const wrapPageContent = useMemo(() => {
    switch (currentPage) {
      case DEFAULT:
        return <OverviewPage />;
      case POSTS:
        return <PostsCmsPage />;
      case USERS:
        return <UsersCmsPage />;
      case POSTS_VALIDATION:
        return <PostsValidationPage />;
      case REPORT:
        return <ReportPage />;
      default:
        return <></>;
    }
  }, [currentPage]);

  return (
    <Container
      m={0}
      p={0}
      width={`calc(100vw - ${LeftSideBarWidth + 8}px)`}
      maxW={`calc(100vw - ${LeftSideBarWidth + 8}px)`}
      height="fit-content"
      minH={"100vh"}
      pos={"relative"}
      left={`${LeftSideBarWidth}px`}
    >
      {wrapPageContent}
    </Container>
  );
};

export default AdminPage;
