import { Container, Flex, Image } from "@chakra-ui/react";
import { memo } from "react";
import { MESSAGE_PATH, Route } from "../../../../../../Breads-Shared/APIConfig";
import {
  Constants,
  gif,
} from "../../../../../../Breads-Shared/Constants/index";
import { useAppDispatch, useAppSelector } from "../../../../../../hooks/redux";
import Socket from "../../../../../../socket";
import { AppState } from "../../../../../../store";
import {
  addNewMsg,
  defaulMessageInfo,
  updateConversations,
} from "../../../../../../store/MessageSlice";

const GifMsgBox = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const participant = useAppSelector(
    (state: AppState) => state.message.selectedConversation?.participant
  );
  const userInfo = useAppSelector((state: AppState) => state.user.userInfo);

  const handleSendMsg = async (gifUrl) => {
    const socket = Socket.getInstant();
    const msgPayload = {
      recipientId: participant?._id,
      senderId: userInfo._id,
      message: {
        ...defaulMessageInfo,
        media: [
          {
            url: gifUrl,
            type: Constants.MEDIA_TYPE.GIF,
          },
        ],
      },
    };
    socket.emit(Route.MESSAGE + MESSAGE_PATH.CREATE, msgPayload, ({ data }) => {
      const conversationInfo = data?.conversationInfo;
      const msgs = data?.msgs;
      dispatch(addNewMsg(msgs));
      dispatch(updateConversations([conversationInfo]));
    });
    onClose();
  };

  return (
    <Container
      p={0}
      overflowY={"auto"}
      maxHeight={"400px"}
      sx={{
        "&::-webkit-scrollbar": {
          width: "12px",
        },
        "&::-webkit-scrollbar-track": {
          background: "white",
          borderRadius: "8px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "gray",
          borderRadius: "8px",
          border: "3px solid white",
        },
      }}
    >
      <Flex wrap="wrap">
        {gif.map((link, index) => (
          <Image
            loading="lazy"
            key={link}
            src={link}
            alt={`GIF ${index + 1}`}
            width="45%"
            height="auto"
            borderRadius={"8px"}
            objectFit={"cover"}
            m={1}
            onClick={() => {
              handleSendMsg(link);
            }}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default memo(GifMsgBox);
