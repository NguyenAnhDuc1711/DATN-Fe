import { Container } from "@chakra-ui/react";
import { lazy, LazyExoticComponent, Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { HeaderHeight } from "./Layout/index";
import BannedPage from "./pages/BannedPage";
import Socket from "./socket";
import { useAppDispatch } from "./hooks/redux";

const AuthPage: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./pages/AuthPage")
);
const Layout: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./Layout/index")
);
const ErrorPage: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./pages/ErrorPage")
);
const HomePage: LazyExoticComponent<() => JSX.Element> = lazy(
  () => import("./pages/HomePage")
);

const wrapSuspense = (cpn) => {
  return <Suspense>{cpn}</Suspense>;
};

function App() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const userId = localStorage.getItem("userId");
  const userInfo = {
    _id: "123",
    name: "Duc",
    username: "AnhDuc",
    email: "ducna17112003@gmail.com",
  };
  //   const userInfo = useSelector((state: AppState) => state.user.userInfo);
  //   const { seeMediaInfo, currentPage, openLoginPopup } = useSelector(
  //     (state: AppState) => state.util
  //   );
  //   const postAction = useSelector((state: AppState) => state.post.postAction);
  //   const openReportPopup = useSelector(
  //     (state: AppState) => state.report.openPopup
  //   );
  //   const { CREATE, EDIT, REPLY, REPOST } = PostConstants.ACTIONS;
  //   const openPostPopup = [CREATE, EDIT, REPLY, REPOST].includes(postAction);
  //   const isAdmin = userInfo?.role === Constants.USER_ROLE.ADMIN;
  const isBanned = false; //userInfo?.status == Constants.USER_STATUS.BANNED;

  //   useEffect(() => {
  //     if (!!userId) {
  //       handleGetUserInfo();
  //     }
  //   }, []);

  useEffect(() => {
    if (userInfo?._id) {
      handleConnect();
    }
  }, [userInfo._id]);

  const handleConnect = async () => {
    // const socket = Socket.getInstant();
    // const userPayload = {
    //   userId: userInfo._id,
    //   userFollowed: userInfo.followed,
    //   userFollowing: userInfo.following,
    // };
    // socket.emitWithAck(
    //   APIConfig.Route.USER + APIConfig.USER_PATH.CONNECT,
    //   userPayload
    // );
  };

  // const handleGetUserInfo = async () => {
  //   try {
  //     dispatch(getUserInfo({ userId, getCurrentUser: true }));
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const HomeRoute = () => {
    // const { HOME, FOR_YOU, FOLLOWING, LIKED, SAVED } = PageConstant;
    return [""].map((page) => (
      <Route
        key={`route-${page}`}
        path={`/${page}`}
        element={
          !!userId ? wrapSuspense(<HomePage />) : <Navigate to={`/auth`} />
        }
      />
    ));
  };

  if (isBanned) {
    return <BannedPage />;
  }

  return (
    <div className="app">
      {location.pathname !== "/error" &&
        userInfo?._id &&
        wrapSuspense(<Layout />)}

      <Routes>
        {HomeRoute()}
        <Route
          path={`/auth`}
          element={!userId ? wrapSuspense(<AuthPage />) : <Navigate to="/" />}
        />
        <Route path="*" element={wrapSuspense(<ErrorPage />)} />
      </Routes>
    </div>
  );
}

export default App;
