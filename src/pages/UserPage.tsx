import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Route, USER_PATH } from "../Breads-Shared/APIConfig";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import ContainerLayout from "../components/MainBoxLayout";
import UserHeader from "../components/UserHeader";
import { GET } from "../config/API";
import { getUserPosts } from "../store/PostSlice/asyncThunk";
import { getUserInfo } from "../store/UserSlice/asyncThunk";
import { changeDisplayPageData } from "../store/UtilSlice";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { AppState } from "../store";
import { IUser } from "../store/UserSlice";

const UserPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { userSelected, userInfo } = useAppSelector(
    (state: AppState) => state.user
  );
  const displayPageData = useAppSelector(
    (state: AppState) => state.util.displayPageData
  );
  const [usersFollow, setUsersFollow] = useState({
    followed: [],
    following: [],
  });
  const { userId } = useParams();

  useEffect(() => {
    fetchUserData();
    window.scrollTo(0, 0);
    dispatch(changeDisplayPageData(""));
  }, [userId]);

  useEffect(() => {
    if (!!userId) {
      dispatch(getUserPosts(userId));
      addEvent({
        event: "see_page",
        payload: {
          page: "user",
          userPage: userId,
        },
      });
    }
  }, [displayPageData, userId]);

  const fetchUserData = async () => {
    try {
      const result: any = await dispatch(
        getUserInfo({ userId, getCurrentUser: false })
      ).unwrap();
      if (!result || result.error) {
        navigate("/error");
      } else {
        dispatch(
          changePage({
            nextPage:
              userId === userInfo?._id
                ? PageConstant.USER
                : PageConstant.FRIEND,
          })
        );
        handleGetUsersFollow();
      }
    } catch (err) {
      console.error("fetchUserData: ", err);
      navigate("/error");
    }
  };

  const handleGetUsersFollow = async () => {
    try {
      const data: any = await GET({
        path: Route.USER + USER_PATH.USERS_FOLLOW,
        params: {
          userId: userId,
        },
      });
      if (data) {
        setUsersFollow({
          followed: data.followed,
          following: data.following,
        });
      }
    } catch (err) {
      console.error("handleGetUsersFollow: ", err);
    }
  };

  return (
    <>
      <ContainerLayout>
        <UserHeader user={userSelected} usersFollow={usersFollow} />
      </ContainerLayout>
    </>
  );
};

export default UserPage;
