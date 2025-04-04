import { Flex, useColorModeValue } from "@chakra-ui/react";
import { useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { IUser } from "../../store/UserSlice";
import FollowBtn from "../FollowBtn";
import UserBox from "./UserBox";

const UserFollowBox = ({
  user,
  inFollowBox = false,
}: {
  user: IUser;
  inFollowBox?: boolean;
}) => {
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const bgColor = useColorModeValue("cbg.light", "cbg.dark");
  const textColor = useColorModeValue("ccl.light", "ccl.dark");

  return (
    <>
      <Flex
        width={"100%"}
        height={"80px"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={bgColor}
        padding={"0 12px"}
        borderRadius={inFollowBox ? "" : "10px"}
        mb={inFollowBox ? "" : "10px"}
        borderBottom={inFollowBox ? "1px solid gray" : ""}
      >
        <UserBox user={user} inFollowBox={inFollowBox} />
        {userInfo?._id !== user?._id && (
          <FollowBtn user={user} inUserFlBox={true} />
        )}
      </Flex>
    </>
  );
};

export default UserFollowBox;
