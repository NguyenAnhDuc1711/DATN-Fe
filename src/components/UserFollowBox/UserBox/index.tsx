import {
  Avatar,
  Container,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import UserInfoPopover from "../../UserInfoPopover";
import { IUser } from "../../../store/UserSlice";

const UserBox = ({
  user,
  isTagBox = false,
  inFollowBox = false,
  setOpenTagBox,
  searchValue,
  onClick,
}: {
  user: IUser;
  isTagBox?: boolean;
  inFollowBox?: boolean;
  setOpenTagBox?: Function;
  searchValue?: string;
  onClick?: Function;
}) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue("cuse.light", "cuse.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");

  const getToUserPage = () => {
    navigate(`/users/${user._id}`);
  };

  return (
    <Flex
      bg={isTagBox ? bgColor : ""}
      alignItems={"center"}
      padding={isTagBox ? "2px 8px" : ""}
      borderRadius={isTagBox ? "6px" : ""}
      cursor={isTagBox ? "pointer" : ""}
      _hover={{
        opacity: isTagBox ? "0.8" : "",
      }}
      mb={isTagBox ? "4px" : ""}
      onClick={(e) => {
        e.stopPropagation();
        !!onClick && onClick(user);
      }}
    >
      <Avatar
        size={isTagBox ? "sm" : "md"}
        src={user.avatar}
        cursor={"pointer"}
        onClick={() => {
          if (!isTagBox) {
            getToUserPage();
          }
        }}
      />
      <Container>
        {!isTagBox && !inFollowBox ? (
          <UserInfoPopover user={user} />
        ) : (
          <Text
            fontSize={"sm"}
            fontWeight={"bold"}
            cursor={"pointer"}
            _hover={{
              textTransform: inFollowBox ? "underlined" : "",
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (inFollowBox) {
                window.location.href =
                  window.location.origin + `/users/${user?._id}`;
              }
            }}
          >
            {user?.username}
          </Text>
        )}
        <Text
          fontWeight={"400"}
          fontSize={"14px"}
          cursor={isTagBox ? "pointer" : ""}
        >
          {user.name}
        </Text>
      </Container>
    </Flex>
  );
};

export default UserBox;
