import { Flex } from "@chakra-ui/react";
import { Fragment } from "react";
import { EmptyContentSvg } from "../../assests/icons";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { getPosts } from "../../store/PostSlice/asyncThunk";
import { isAdminPage } from "../../util";
import InfiniteScroll from "../InfiniteScroll";
import Post from "./Post";
import SkeletonPost from "./Post/skeleton";

const ListPost = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const { listPost, isLoading } = useAppSelector(
    (state: AppState) => state.post
  );
  const { currentPage, displayPageData } = useAppSelector(
    (state: AppState) => state.util
  );
  const filterPostValidation = null;
  //   useAppSelector(
  //     (state: AppState) => state.admin.filterPostValidation
  //   );

  const handleGetPosts = async ({ page }) => {
    try {
      if (
        currentPage === PageConstant.USER ||
        currentPage === PageConstant.FRIEND
      ) {
      } else {
        let filter = { page: displayPageData };
        // if (isAdminPage) {
        //   filter = {
        //     ...filter,
        //     ...filterPostValidation,
        //   };
        // }
        const payload: {
          filter: any;
          userId: string;
          page: string;
          isNewPage?: boolean;
        } = {
          filter: filter,
          userId: userInfo?._id,
          page: page,
        };
        if (page === 1) {
          payload.isNewPage = true;
        }
        dispatch(getPosts(payload));
      }
    } catch (err) {
      console.error("Error scroll to get more post: ", err);
    }
  };

  return (
    <>
      {(isAdminPage ? true : listPost?.length !== 0) ? (
        <>
          <InfiniteScroll
            queryFc={(page) => {
              handleGetPosts({
                page,
              });
            }}
            data={listPost}
            cpnFc={(post) => (
              <Fragment>
                <Post post={post} />
                <hr
                  style={{
                    borderColor: "transparent",
                    height: "12px",
                    margin: "0px",
                  }}
                />
              </Fragment>
            )}
            condition={!!userInfo._id}
            deps={[userInfo._id, currentPage, filterPostValidation]}
            skeletonCpn={<SkeletonPost />}
            reloadPageDeps={isAdminPage ? [filterPostValidation] : null}
          />
        </>
      ) : (
        <>
          {isLoading ? (
            <Flex
              gap={"12px"}
              flexDirection={"column"}
              justifyContent={"center"}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <SkeletonPost key={`skeleton-post-${num}`} />
              ))}
            </Flex>
          ) : (
            <Flex justifyContent={"center"} alignItems={"center"}>
              <EmptyContentSvg />
            </Flex>
          )}
        </>
      )}
    </>
  );
};

export default ListPost;
