import { Container, Flex, Text } from "@chakra-ui/react";
import { MESSAGE_PATH, Route } from "../../../../../Breads-Shared/APIConfig";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import Socket from "../../../../../socket";
import { AppState } from "../../../../../store";
import {
  addNewMsg,
  updateConversations,
  updateSelectedConversation,
} from "../../../../../store/MessageSlice";
import { addEvent } from "../../../../../util";
import { messageThemes } from "../../../../../util/Themes/index";

const ThemeModal = ({ setItemSelected }: { setItemSelected: Function }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const selectedConversation = useAppSelector(
    (state: AppState) => state.message.selectedConversation
  );

  const handleChangeTheme = async (theme: string) => {
    addEvent({
      event: "change_conversation_theme",
      payload: {
        theme: theme,
        conversationId: selectedConversation?._id,
      },
    });
    const socket = Socket.getInstant();
    socket.emit(
      Route.MESSAGE + MESSAGE_PATH.CONFIG_CONVERSATION,
      {
        key: "theme",
        value: theme,
        conversationId: selectedConversation?._id,
        userId: userInfo?._id,
        recipientId: selectedConversation?.participant?._id,
        changeSettingContent: "has change conversation's theme into " + theme,
      },
      ({ data }) => {
        const conversationInfo = data?.conversationInfo;
        const msgs = data?.msgs;
        if (msgs?.length) {
          dispatch(addNewMsg(msgs));
          dispatch(
            updateSelectedConversation({
              key: "theme",
              value: theme,
            })
          );
          dispatch(updateConversations([conversationInfo]));
        }
      }
    );
    setItemSelected("");
  };

  return (
    <>
      <Container p={0} m={0}>
        <Text p={2} borderBottom={"1px solid gray"}>
          Select your theme
        </Text>
        <Container p={0} m={0} overflowY={"scroll"} maxHeight={"60vh"}>
          <Flex
            flexWrap={"wrap"}
            width={"100%"}
            height={"fit-content"}
            gap={2}
            mt={3}
          >
            {Object.keys(messageThemes).map((theme) => {
              const themeInfo = messageThemes[theme];
              const themeName = themeInfo.name;
              const themeBg = themeInfo.conversationBackground.backgroundImage;
              const textColor = themeInfo.user1Message.color;
              const borderColor = themeInfo.user1Message.borderColor;
              return (
                <Container
                  pos={"relative"}
                  width={"30%"}
                  height={"160px"}
                  borderRadius={6}
                  backgroundImage={`url(${themeBg})`}
                  backgroundRepeat={"no-repeat"}
                  backgroundSize={"cover"}
                  backgroundColor={
                    !themeBg
                      ? themeInfo.conversationBackground.backgroundColor
                      : ""
                  }
                  border={
                    selectedConversation?.theme === theme
                      ? `4px solid ${borderColor}`
                      : ""
                  }
                  boxSizing="border-box"
                  cursor={"pointer"}
                  _hover={{
                    opacity: 0.8,
                  }}
                  onClick={() => {
                    handleChangeTheme(theme);
                  }}
                >
                  <Text
                    color={textColor}
                    position={"absolute"}
                    left={"8px"}
                    bottom={"4px"}
                  >
                    {themeName}
                  </Text>
                </Container>
              );
            })}
          </Flex>
        </Container>
      </Container>
    </>
  );
};

export default ThemeModal;
