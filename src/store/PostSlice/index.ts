import { createSlice } from "@reduxjs/toolkit";
import PageConstant from "../../Breads-Shared/Constants/PageConstants";
import PostConstants from "../../Breads-Shared/Constants/PostConstants";
import { Media } from "../MessageSlice";
import {
  createPost,
  deletePost,
  editPost,
  getPost,
  getPosts,
  getUserPosts,
  selectSurveyOption,
  updatePostStatus,
} from "./asyncThunk";

export interface ISurveyOption {
  _id?: string;
  placeholder: string;
  value: string;
  usersId?: string[];
}

export const surveyTemplate = ({
  placeholder,
  value,
}: {
  placeholder: string;
  value: string;
}): ISurveyOption => {
  return {
    placeholder,
    value,
  };
};

export interface IUserShortInfo {
  _id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followed: string[];
}

export interface IPost {
  _id?: string;
  content: string;
  media: Media[];
  survey: ISurveyOption[];
  usersTag?: any;
  files: any;
  links?: any;
  usersLike?: any;
  replies?: IPost[];
  parentPostInfo?: IPost;
  status?: number;
  authorId?: string;
  createdAt?: Date;
  authorInfo?: IUserShortInfo;
  linksInfo?: any;
  quote?: any;
  repostNum?: number;
  share?: any;
  usersTagInfo?: any;
  type?: string;
  parentPost?: string;
}

export interface ILink {}

export interface PostState {
  listPost: IPost[];
  postSelected: IPost | null;
  postInfo: IPost;
  postAction: string;
  postReply: IPost | null;
  isLoading: boolean;
}

export const defaultPostInfo: IPost = {
  content: "",
  media: [],
  survey: [],
  usersTag: [],
  files: [],
  links: [],
};

export const initialPostState: PostState = {
  listPost: [],
  postSelected: null,
  postInfo: defaultPostInfo,
  postAction: "",
  postReply: null,
  isLoading: true,
};

const postSlice = createSlice({
  name: "post",
  initialState: initialPostState,
  reducers: {
    selectPost: (state, action) => {
      state.postSelected = action.payload;
    },
    updatePostInfo: (state, action) => {
      state.postInfo = action.payload;
    },
    updatePostAction: (state, action) => {
      state.postAction = action.payload ?? "";
    },
    updateListPost: (state, action) => {
      state.listPost = action.payload ?? [];
    },
    selectPostReply: (state, action) => {
      state.postReply = action.payload;
    },
    updatePostLike: (state, action) => {
      const { postId, usersLike } = action.payload;
      const postIndex = state.listPost.findIndex((post) => post._id === postId);
      if (postIndex !== -1) {
        state.listPost[postIndex] = {
          ...state.listPost[postIndex],
          usersLike: usersLike,
        };
      } else {
        if (!!state.postSelected) {
          let postSelected: IPost = state.postSelected;
          const postReplieIds = postSelected.replies?.map(({ _id }) => _id);
          const postReplieIndex: any = postReplieIds?.findIndex(
            (_id) => _id === postId
          );
          if (postSelected._id === postId) {
            postSelected.usersLike = usersLike;
          } else if (postReplieIndex !== -1 && postSelected.replies) {
            postSelected.replies[postReplieIndex].usersLike = usersLike;
          }
        }
      }
    },
    reloadListPost: (state) => {
      state.listPost = [];
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPost.fulfilled, (state, action) => {
      const postSelected = action.payload;
      console.log("postSelected: ", postSelected);
      if (postSelected) {
        state.postSelected = postSelected;
      }
    });
    builder.addCase(getPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getPosts.fulfilled, (state, action) => {
      if (action.payload?.posts) {
        const newPosts: IPost[] = action.payload.posts;
        const isNewPage = action.payload.isNewPage;
        state.isLoading = false;
        if (!isNewPage) {
          state.listPost.push(...newPosts);
        } else {
          state.listPost = newPosts;
        }
        state.postInfo = defaultPostInfo;
      }
    });
    builder.addCase(createPost.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      const newPost: IPost = action.payload?.data;
      const listPost: IPost[] = state.listPost;
      const currentPage: string = action.payload?.currentPage;
      if (!!newPost) {
        if (currentPage === PageConstant.USER) {
          state.listPost.unshift(newPost);
        }
        const { REPOST, REPLY } = PostConstants.ACTIONS;
        if (state.postSelected) {
          const postSelected: IPost = state.postSelected;
          if ([REPOST, REPLY].includes(state.postAction) && postSelected?._id) {
            const clonePostSelected = JSON.parse(JSON.stringify(postSelected));
            const postSelectedIndex = listPost.findIndex(
              ({ _id }) => _id === postSelected._id
            );
            if (state.postAction === REPLY) {
              clonePostSelected.replies.push(newPost);
            } else {
              clonePostSelected.repostNum += 1;
            }
            if (postSelectedIndex !== -1) {
              state.listPost[postSelectedIndex] = { ...clonePostSelected };
            }
            state.postSelected = clonePostSelected;
          }
        }
      }
      state.isLoading = false;
      state.postAction = "";
      state.postInfo = defaultPostInfo;
    });
    builder.addCase(editPost.fulfilled, (state, action) => {
      const postUpdatedData: IPost = action.payload;
      const listPost: IPost[] = state.listPost;
      const postInfo: IPost = state.postInfo;
      let postPrevUpdateIndex: number = listPost.findIndex(
        (post) => post._id === postUpdatedData._id
      );
      listPost[postPrevUpdateIndex] = {
        ...listPost[postPrevUpdateIndex],
        ...postUpdatedData,
      };
      if (typeof postInfo != null) {
        state.postSelected = postInfo;
        state.postAction = "";
      }
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      const postId: string = action.payload?.postId;
      const currentPage: string = action.payload?.currentPage;
      if (
        state.postSelected?._id &&
        postId !== state.postSelected?._id &&
        currentPage === PageConstant.POST_DETAIL
      ) {
        if (state.postSelected.replies) {
          state.listPost = state.postSelected.replies.filter(
            (post) => post._id !== postId
          );
          state.postSelected.replies = state.listPost;
        }
      } else {
        const listPost = JSON.parse(JSON.stringify(state.listPost));
        const newListPost = listPost.filter(({ _id }) => _id !== postId);
        for (let i = 0; i < newListPost.length; i++) {
          const post = newListPost[i];
          if (post.parentPost === postId) {
            delete newListPost[i].parentPostInfo;
          }
          if (post?.quote?._id === postId) {
            delete newListPost[i].quote;
          }
        }
        state.listPost = newListPost;
      }
    });
    builder.addCase(selectSurveyOption.fulfilled, (state, action) => {
      const { postId, userId, isAdd, optionId }: any = action.payload;
      const postTickedIndex = state.listPost.findIndex(
        ({ _id }) => _id === postId
      );
      const optionIndex = state.listPost[postTickedIndex].survey.findIndex(
        (option) => option._id === optionId
      );
      if (optionIndex !== -1) {
        let selectedSurveyOption: any =
          state.listPost[postTickedIndex].survey[optionIndex].usersId;
        const currentUsersId = JSON.parse(JSON.stringify(selectedSurveyOption));
        if (isAdd) {
          selectedSurveyOption.push(userId);
        } else {
          state.listPost[postTickedIndex].survey[optionIndex].usersId =
            currentUsersId.filter((id) => id !== userId);
        }
      }
      //Update share post with survey
      const listPost = JSON.parse(JSON.stringify(state.listPost));
      const postsShared = listPost.filter(
        ({ parentPost }) => parentPost === postId
      );
      if (postsShared?.length) {
        for (const post of postsShared) {
          const postIndex = listPost.findIndex(({ _id }) => _id === post._id);
          if (state.listPost[postIndex].parentPostInfo) {
            state.listPost[postIndex].parentPostInfo.survey =
              state.listPost[postTickedIndex].survey;
          }
        }
      }
    });
    builder.addCase(getUserPosts.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      const userPosts = action.payload;
      if (userPosts) {
        state.listPost = userPosts;
        state.isLoading = false;
      }
    });
    builder.addCase(updatePostStatus.fulfilled, (state, action) => {
      const postId = action.payload;
      let newListPost = JSON.parse(JSON.stringify(state.listPost));
      newListPost = newListPost.filter(({ _id }) => _id !== postId);
      state.listPost = newListPost;
    });
  },
});

export const {
  selectPost,
  updatePostInfo,
  updatePostAction,
  updateListPost,
  selectPostReply,
  updatePostLike,
  reloadListPost,
} = postSlice.actions;
export default postSlice.reducer;
