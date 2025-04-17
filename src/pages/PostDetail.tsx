import { Flex } from "@chakra-ui/react";
import { useEffect, useMemo } from "react";
import { Constants } from "../Breads-Shared/Constants";
import PageConstant from "../Breads-Shared/Constants/PageConstants";
import { EmptyContentSvg } from "../assests/icons";
import Post from "../components/ListPost/Post";
import ContainerLayout from "../components/MainBoxLayout";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { AppState } from "../store";
import { getPost } from "../store/PostSlice/asyncThunk";
import { changePage } from "../store/UtilSlice/asyncThunk";
import { addEvent } from "../util";

const PostDetail = () => {
  const dispatch = useAppDispatch();
  const postId = window.location.pathname.split("/")?.[2];
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const postSelected = useAppSelector(
    (state: AppState) => state.post.postSelected
  );
  const currentPage = useAppSelector(
    (state: AppState) => state.util.currentPage
  );

  useEffect(() => {
    if (postId) {
      dispatch(changePage({ currentPage, nextPage: PageConstant.POST_DETAIL }));
      dispatch(getPost(postId));
      addEvent({
        event: "see_detail_post",
        payload: {
          postId: postId,
        },
      });
    }
  }, []);

  const getContentRender = useMemo(() => {
    const postStatus = postSelected?.status;
    const { PENDING, PUBLIC, ONLY_ME, ONLY_FOLLOWERS, DELETED } =
      Constants.POST_STATUS;
    let ableToDisplayPost: boolean = !!userInfo?._id;

    switch (postStatus) {
      case PENDING:
      case DELETED:
        ableToDisplayPost = false;
        break;
      case ONLY_ME:
        ableToDisplayPost = userInfo?._id === postSelected?.authorId;
        break;
      case ONLY_FOLLOWERS:
        const followers = userInfo?.followed;
        ableToDisplayPost = !!followers?.length
          ? [...followers, userInfo?._id]?.includes(userInfo?._id)
          : false;
        break;
      default:
        ableToDisplayPost = !!userInfo?._id;
    }
    if (ableToDisplayPost) {
      return (
        <ContainerLayout>
          {postSelected?._id && <Post post={postSelected} isDetail={true} />}
        </ContainerLayout>
      );
    }
    return (
      <Flex justifyContent={"center"} alignItems={"center"}>
        <EmptyContentSvg />
      </Flex>
    );
  }, [postSelected, userInfo?._id]);

  return <>{getContentRender}</>;
};

export default PostDetail;
