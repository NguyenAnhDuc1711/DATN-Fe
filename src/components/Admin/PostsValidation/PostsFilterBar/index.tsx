import {
  Button,
  Checkbox,
  Container,
  Flex,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, USER_PATH } from "../../../../Breads-Shared/APIConfig";
import { Constants } from "../../../../Breads-Shared/Constants";
import PostConstants from "../../../../Breads-Shared/Constants/PostConstants";
import { POST } from "../../../../config/API";
import { updateFilterPostValidation } from "../../../../store/AdminSlice";
import InfiniteScroll from "../../../InfiniteScroll";
import SearchBar from "../../../SearchBar";
import UserBox from "../../../UserFollowBox/UserBox";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { AppState } from "../../../../store";

export const filterPostWidth = 360;

type FilterPostsCMS = {
  user: string;
  postContent: string[];
  postType: string[];
};

const PostsFilterBar = () => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const filterPostValidation = useAppSelector(
    (state: AppState) => state.admin.filterPostValidation
  );
  const [userSearch, setUserSearch] = useState("");
  const [suggestUserBox, setSuggessUserOpen] = useState<any>({
    open: false,
    users: [],
  });
  const [isSelectUser, setIsSelectUser] = useState(false);
  const init = useRef(true);

  const postType = Object.values(PostConstants.ACTIONS).filter(
    (action) => action !== "edit"
  );
  const postContentInclude = [
    "text",
    ...Object.values(Constants.MEDIA_TYPE),
    "survey",
  ];

  const [filter, setFilter] = useState<FilterPostsCMS>({
    user: "",
    postContent: [],
    postType: [],
  });

  useEffect(() => {
    if (!init.current && !isSelectUser) {
      handleSearchUsers({ page: 1 });
      setIsSelectUser(false);
    } else {
      init.current = false;
    }
  }, [userSearch]);

  useEffect(() => {
    setFilter({ ...filterPostValidation });
  }, [filterPostValidation]);

  const compareChange = useMemo(() => {
    const difUser = filterPostValidation.user !== filter.user;
    const difPostContentLen =
      filterPostValidation.postContent.length !== filter.postContent.length;
    const difPostTypeLen =
      filterPostValidation.postType.length !== filter.postType.length;
    let isDif = difUser || difPostContentLen || difPostTypeLen;
    if (!difPostContentLen) {
      filter.postContent.forEach((type) => {
        if (!filterPostValidation.postContent.includes(type)) {
          isDif = true;
        }
      });
    }
    if (!difPostTypeLen) {
      filter.postType.forEach((type) => {
        if (!filterPostValidation.postType.includes(type)) {
          isDif = true;
        }
      });
    }
    return isDif;
  }, [filter]);

  const handleSearchUsers = async ({ page }) => {
    try {
      const data = await POST({
        path: Route.USER + USER_PATH.GET_USERS_PENDING_POST,
        payload: {
          userId: userInfo._id,
          page: page,
          limit: 10,
          searchValue: userSearch,
        },
      });
      if (data?.length) {
        if (page === 1) {
          setSuggessUserOpen({
            open: true,
            users: data,
          });
        } else {
          setSuggessUserOpen({
            open: true,
            users: [...suggestUserBox.users, ...data],
          });
        }
      }
    } catch (err) {
      console.error("handleSearchUsers: ", err);
    }
  };

  const selectUser = (user) => {
    setFilter({
      ...filter,
      user: user?._id,
    });
    setSuggessUserOpen({
      ...suggestUserBox,
      open: false,
    });
    setUserSearch(user.username);
    setIsSelectUser(true);
  };

  const handleChangeFilterContent = (contentInclude) => {
    let newPostContent: string[] = [];
    if (filter.postContent.includes(contentInclude)) {
      newPostContent = filter.postContent.filter(
        (item) => item !== contentInclude
      );
    } else {
      newPostContent = [...filter.postContent, contentInclude];
    }
    setFilter({
      ...filter,
      postContent: newPostContent,
    });
  };

  const handleChangeFilterType = (type) => {
    let newPostType: string[] = [];
    if (filter.postType.includes(type)) {
      newPostType = filter.postType.filter((item) => item !== type);
    } else {
      newPostType = [...filter.postType, type];
    }
    setFilter({
      ...filter,
      postType: newPostType,
    });
  };

  const handleFilter = async () => {
    dispatch(updateFilterPostValidation({ ...filter }));
  };

  return (
    <Flex
      width={`${filterPostWidth}px`}
      borderX={"1px solid gray"}
      flexDir={"column"}
      pos={"fixed"}
      height={"100vh"}
    >
      <Container borderBottom={"1px solid gray"}>
        <Text m={3} fontSize={26} fontWeight={600}>
          Filter
        </Text>
      </Container>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Users
          </Text>
          <Container
            width={"100%"}
            height={"40px"}
            m={0}
            p={0}
            pos={"relative"}
            zIndex={20000}
          >
            <SearchBar
              value={userSearch}
              setValue={setUserSearch}
              placeholder={"Search an user"}
            />
            {suggestUserBox.open && suggestUserBox.users.length > 0 && (
              <Flex
                flexDir={"column"}
                p={2}
                mt={1}
                border={"1px solid gray"}
                borderRadius={4}
                pos={"absolute"}
                width={"calc(100% - 48px)"}
                maxH={"200px"}
                overflowY={"scroll"}
                zIndex={1000}
                bg="black"
              >
                <InfiniteScroll
                  queryFc={(page) => {
                    handleSearchUsers({ page });
                  }}
                  data={suggestUserBox.users}
                  cpnFc={(user) => (
                    <Container
                      m={0}
                      p={0}
                      bg={"black"}
                      width={"100%"}
                      height={"fit-content"}
                    >
                      <UserBox
                        user={user}
                        isTagBox={true}
                        onClick={() => {
                          selectUser(user);
                        }}
                      />
                    </Container>
                  )}
                  condition={!!userInfo._id}
                  deps={[userSearch]}
                  preloadIndex={2}
                />
              </Flex>
            )}
          </Container>
        </Container>
      </Flex>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Post content includes:{" "}
          </Text>
          <Stack spacing={3} direction={"column"}>
            {postContentInclude.map((type) => (
              <Checkbox
                size="md"
                colorScheme="green"
                key={type}
                textTransform={"capitalize"}
                fontWeight={600}
                isChecked={filter.postContent.includes(type)}
                onChange={() => handleChangeFilterContent(type)}
              >
                {type}
              </Checkbox>
            ))}
          </Stack>
        </Container>
      </Flex>
      <Flex p={2} flexDir={"column"}>
        <Container>
          <Text my={2} fontSize={18} fontWeight={600}>
            Post's type:{" "}
          </Text>
          <Stack spacing={3} direction={"column"}>
            {postType.map((type) => (
              <Checkbox
                size="md"
                colorScheme="green"
                key={type}
                textTransform={"capitalize"}
                fontWeight={600}
                isChecked={filter.postType.includes(type)}
                onChange={() => handleChangeFilterType(type)}
              >
                {type}
              </Checkbox>
            ))}
          </Stack>
        </Container>
      </Flex>
      {compareChange && (
        <Button mx={6} my={4} onClick={() => handleFilter()}>
          Filter
        </Button>
      )}
    </Flex>
  );
};

export default PostsFilterBar;
