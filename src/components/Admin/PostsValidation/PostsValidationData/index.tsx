import { Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { AppState } from "../../../../store";
import { getPosts } from "../../../../store/PostSlice/asyncThunk";
import ListPost from "../../../ListPost";
import { containerBoxWidth } from "../../../MainBoxLayout";
import { filterPostWidth } from "../PostsFilterBar";

const PostsValidationData = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const currentPage = useAppSelector(
    (state: AppState) => state.util.currentPage
  );

  useEffect(() => {
    if (userInfo?._id) {
      dispatch(
        getPosts({
          filter: { page: currentPage },
          userId: localStorage.getItem("userId"),
          isNewPage: true,
        })
      );
    }
  }, [userInfo?._id]);

  return (
    <Flex
      ml={`${filterPostWidth}px`}
      justifyContent={"center"}
      width={"100%"}
      height={"fit-content"}
      minHeight={"100vh"}
      py={8}
    >
      <Flex width={containerBoxWidth} flexDir={"column"} m={0}>
        <ListPost />
      </Flex>
    </Flex>
  );
};

export default PostsValidationData;
