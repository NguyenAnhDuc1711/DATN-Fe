import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Avatar,
  Button,
  Flex,
} from "@chakra-ui/react";
import { IUserShortInfo } from "../../store/PostSlice";

const UnFollowPopup = ({
  user,
  isOpen,
  onClose,
  onClick,
}: {
  user: IUserShortInfo;
  isOpen: boolean;
  onClose: Function;
  onClick: Function;
}) => {
  return (
    <AlertDialog isOpen={isOpen} onClose={() => onClose()}>
      <AlertDialogOverlay>
        <AlertDialogContent
          width={"fit-content"}
          height={"fit-content"}
          borderRadius={"12px"}
          overflow={"hidden"}
        >
          <Flex
            flexDirection={"column"}
            alignItems={"center"}
            padding="28px"
            width={"280px"}
          >
            <Avatar src={user?.avatar} />
            <AlertDialogHeader
              fontWeight="semibold"
              fontSize={"16px"}
              marginTop={"12px"}
              padding={"4px"}
              flexWrap={"wrap"}
              textAlign={"center"}
            >
              Unfollow {user?.name} ?
            </AlertDialogHeader>
          </Flex>
          <AlertDialogFooter
            width={"100%"}
            padding={0}
            borderTop={"1px solid gray"}
          >
            <Button
              onClick={() => onClose()}
              width={"50%"}
              borderRadius={0}
              bg={"transparent"}
              borderRight={"1px solid gray"}
            >
              Cancel
            </Button>
            <Button
              bg={"transparent"}
              color="red"
              onClick={() => onClick()}
              width={"50%"}
              borderRadius={0}
            >
              Unfollow
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default UnFollowPopup;
