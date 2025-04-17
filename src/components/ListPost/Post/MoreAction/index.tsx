import { Container, Fade, Flex, Text, useColorMode } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { CiBookmark } from "react-icons/ci";
import { GoBookmarkSlash } from "react-icons/go";
import { IoIosLink } from "react-icons/io";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import PageConstant from "../../../../Breads-Shared/Constants/PageConstants";
import PostConstants from "../../../../Breads-Shared/Constants/PostConstants";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import useShowToast from "../../../../hooks/useShowToast";
import { AppState } from "../../../../store";
import {
  IPost,
  updatePostAction,
  updatePostInfo,
} from "../../../../store/PostSlice";
import { deletePost } from "../../../../store/PostSlice/asyncThunk";
import {
  addPostToCollection,
  removePostFromCollection,
} from "../../../../store/UserSlice/asyncThunk";
import { addEvent } from "../../../../util";
import useCopyLink from "./CopyLink";

const PostMoreActionBox = ({
  post,
  setOpenPostBox,
  setPopupCancelInfo,
  closePopupCancel,
}: {
  post: IPost;
  setOpenPostBox: Function;
  setPopupCancelInfo: Function;
  closePopupCancel: Function;
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const showToast = useShowToast();
  const { colorMode } = useColorMode();
  const { t } = useTranslation();
  const { copyURL } = useCopyLink();

  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const postSelected = useAppSelector(
    (state: AppState) => state.post.postSelected
  );
  const currentPage = useAppSelector(
    (state: AppState) => state.util.currentPage
  );
  const postId = post._id ?? "";
  const savedBefore = userInfo?.collection?.includes(postId);

  const handleSave = (): void => {
    const payload = {
      userId: userInfo._id,
      postId: postId,
    };
    if (savedBefore) {
      dispatch(removePostFromCollection(payload));
      showToast("", t("unsaved"), "success");
    } else {
      dispatch(addPostToCollection(payload));
      showToast("", t("saved"), "success");
    }
    addEvent({
      event: savedBefore ? "unsave_post" : "save_post",
      payload: {
        postId: postId,
      },
    });
  };

  const handleDelete = (): void => {
    try {
      addEvent({
        event: "delete_post",
        payload: {
          postId: postId,
        },
      });
      dispatch(deletePost({ postId: postId }));
      closePopupCancel();
      showToast("", t("deletesuccess"), "success");
      if (
        postId === postSelected?._id &&
        currentPage === PageConstant.POST_DETAIL
      ) {
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      showToast("", err, "error");
    }
  };

  const actions = [
    {
      name: savedBefore ? t("unsave") : t("save"),
      icon: savedBefore ? <GoBookmarkSlash /> : <CiBookmark />,
      onClick: handleSave,
    },
    // {
    //   name: "Block",
    //   icon: <IoBan />,
    // },
    // {
    //   name: "Report",
    //   icon: <GoReport />,
    // },
    {
      name: t("copylink"),
      icon: <IoIosLink />,
      onClick: () => {
        addEvent({
          event: "copy_post_link",
          payload: {
            postId: postId,
          },
        });
        copyURL(post);
      },
    },
    ...(userInfo._id === post.authorId
      ? [
          {
            name: t("delete"),
            icon: <MdDelete />,
            onClick: () => {
              setPopupCancelInfo({
                open: true,
                title: t("delete") + " Bread",
                content: t("wannadelete"),
                leftBtnText: t("cancel"),
                rightBtnText: t("delete"),
                leftBtnAction: () => {
                  closePopupCancel();
                },
                rightBtnAction: () => {
                  handleDelete();
                },
                rightBtnStyle: {
                  color: "red",
                },
              });
            },
          },
          {
            name: t("update"),
            icon: <MdEdit />,
            onClick: () => {
              dispatch(updatePostAction(PostConstants.ACTIONS.EDIT));
              dispatch(updatePostInfo(post));
            },
          },
        ]
      : []),
  ];

  return (
    <>
      <Container
        width={"180px"}
        position={"absolute"}
        top={"calc(100% + 12px)"}
        right={"50%"}
        borderRadius={"12px"}
        padding={"12px"}
        bg={colorMode === "dark" ? "#1c1e21" : "gray.100"}
        zIndex={1000}
        animation={"fadeIn ease 0.3s"}
      >
        {actions.map(({ name, icon, onClick }) => (
          <Flex
            key={name}
            justifyContent={"space-between"}
            height={"36px"}
            cursor={"pointer"}
            alignItems={"center"}
            padding={"0 10px"}
            borderRadius={"8px"}
            _hover={{
              bg: "gray",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick();
              setOpenPostBox(false);
            }}
          >
            <Text>{name}</Text>
            {icon}
          </Flex>
        ))}
      </Container>
    </>
  );
};

export default PostMoreActionBox;
