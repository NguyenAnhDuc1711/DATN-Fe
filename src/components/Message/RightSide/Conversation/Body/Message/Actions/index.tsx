import { Flex, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { FaDeleteLeft } from "react-icons/fa6";
import { IoMdSend } from "react-icons/io";
import { MdEmojiEmotions, MdOutlineReply } from "react-icons/md";
import {
  MESSAGE_PATH,
  Route,
} from "../../../../../../../Breads-Shared/APIConfig";
import { Constants } from "../../../../../../../Breads-Shared/Constants";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../../../../hooks/redux";
import Socket from "../../../../../../../socket";
import { AppState } from "../../../../../../../store";
import {
  selectMsg,
  updateMsg,
  updateMsgAction,
  updateSendNextBox,
} from "../../../../../../../store/MessageSlice";
import { addEvent, getEmojiIcon } from "../../../../../../../util";
import ClickOutsideComponent from "../../../../../../../util/ClickoutCPN";
import IconWrapper from "../../../MessageBar/IconWrapper";

const MessageAction = ({ ownMsg, msg, previousReact }) => {
  const dispatch = useAppDispatch();
  const selectedConversation = useAppSelector(
    (state: AppState) => state.message.selectedConversation
  );
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);
  const [openBox, setOpenBox] = useState(false);
  const [displayReactBox, setDisplayReactBox] = useState(false);
  const defaultEmoji = ["<3", ":D", ":O", ":(", ":slang"];
  const msgId = msg?._id;
  const { SEND_NEXT, REPLY, RETRIEVE } = Constants.MSG_ACTION;

  const boxActions = [
    {
      onClick: () => {
        dispatch(selectMsg(msg));
        dispatch(updateMsgAction(REPLY));
        setOpenBox(false);
      },
      icon: <MdOutlineReply />,
      name: REPLY,
    },
    {
      onClick: () => {
        dispatch(
          updateSendNextBox({
            key: "open",
            value: true,
          })
        );
        dispatch(selectMsg(msg));
        dispatch(updateMsgAction(SEND_NEXT));
        setOpenBox(false);
      },
      icon: <IoMdSend />,
      name: SEND_NEXT,
    },
  ];
  if (ownMsg) {
    boxActions.push({
      onClick: () => {
        handleRetriveMsg();
        dispatch(updateMsgAction(RETRIEVE));
        setOpenBox(false);
      },
      icon: <FaDeleteLeft />,
      name: RETRIEVE,
    });
  }

  const handleRetriveMsg = async () => {
    try {
      addEvent({
        event: "retrieve_msg",
        payload: {
          msgId: msg?._id,
          conversationId: selectedConversation?._id,
        },
      });
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.RETRIEVE,
        {
          msgId: msgId,
          userId: userInfo?._id,
          participantId: selectedConversation?.participant?._id,
        },
        ({ data }) => {
          dispatch(updateMsg(data));
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReactMsg = async (react) => {
    try {
      addEvent({
        event: "react_msg",
        payload: {
          msgId: msg?._id,
          conversationId: selectedConversation?._id,
          react: react,
        },
      });
      const socket = Socket.getInstant();
      socket.emit(
        Route.MESSAGE + MESSAGE_PATH.REACT,
        {
          participantId: selectedConversation?.participant?._id,
          userId: userInfo?._id,
          msgId: msgId,
          react: react,
        },
        ({ data }) => {
          console.log("data: ", data);
          setDisplayReactBox(false);
          if (data?._id) {
            dispatch(updateMsg(data));
          }
        }
      );
    } catch (err) {
      console.error("handleReactMsg: ", err);
    }
  };

  return (
    <Flex
      pos={"relative"}
      p={0}
      m={0}
      width={"fit-content"}
      maxWidth={"fit-content"}
      mr={ownMsg ? 2 : 0}
      ml={!ownMsg ? 2 : 0}
    >
      <ClickOutsideComponent
        onClose={() => {
          setOpenBox(false);
        }}
      >
        <IconWrapper
          icon={
            <BsThreeDots
              cursor={"pointer"}
              onClick={() => {
                setOpenBox(!openBox);
              }}
            />
          }
        />
        <Flex
          display={openBox ? "flex" : "none"}
          position={"absolute"}
          flexDir={"column"}
          borderRadius={4}
          border={"1px solid gray"}
          p={2}
          top={"calc(100% + 4px)"}
          // bg={useColorModeValue("gray.200", "#181818")}
          left={ownMsg ? "" : "0"}
          right={ownMsg ? "0" : ""}
          zIndex={1000}
          minWidth={"140px"}
        >
          {boxActions.map(({ icon, name, onClick }) => (
            <Flex
              key={name}
              alignItems={"center"}
              gap={3}
              px={2}
              py={1}
              cursor={"pointer"}
              borderRadius={4}
              _hover={{
                bg: "gray",
              }}
              minWidth={"140px"}
              onClick={() => {
                !!onClick && onClick();
              }}
            >
              {icon}
              <Text textTransform={"capitalize"}>{name}</Text>
            </Flex>
          ))}
        </Flex>
      </ClickOutsideComponent>
      <ClickOutsideComponent onClose={() => setDisplayReactBox(false)}>
        <IconWrapper
          icon={
            <MdEmojiEmotions
              cursor={"pointer"}
              onClick={() => setDisplayReactBox(!displayReactBox)}
            />
          }
        />
        {displayReactBox && (
          <Flex
            alignItems={"center"}
            px={2}
            py={1}
            borderRadius={6}
            pos={"absolute"}
            bottom={"calc(100%)"}
            right={"50%"}
            transform={"translateX(55%)"}
            border={"1px solid gray"}
            // bg={useColorModeValue("gray.200", "#181818")}
            zIndex={1000}
          >
            {defaultEmoji.map((emjStr) => (
              <IconWrapper
                addBg={previousReact === emjStr ? true : false}
                icon={
                  <Text
                    onClick={() => {
                      handleReactMsg(emjStr);
                    }}
                  >
                    {getEmojiIcon(emjStr)}
                  </Text>
                }
              />
            ))}
          </Flex>
        )}
      </ClickOutsideComponent>
    </Flex>
  );
};

export default MessageAction;
