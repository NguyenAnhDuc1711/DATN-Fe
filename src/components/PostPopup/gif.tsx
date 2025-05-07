import {
  Box,
  Fade,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Constants, gif } from "../../Breads-Shared/Constants";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { AppState } from "../../store";
import { updatePostInfo } from "../../store/PostSlice";
import { addEvent } from "../../util";

const GifBox = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const postInfo = useAppSelector((state: AppState) => state.post.postInfo);

  const handleAddGif = (url: string) => {
    addEvent({
      event: "add_post_gif",
      payload: {
        gif: url,
      },
    });
    dispatch(
      updatePostInfo({
        ...postInfo,
        media: [
          {
            url: url,
            type: Constants.MEDIA_TYPE.GIF,
          },
        ],
      })
    );
    onClose();
  };

  return (
    <Fade in={isOpen}>
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          position={"relative"}
          boxSizing="border-box"
          width="620px"
          maxWidth={"620px"}
          bg={"white"}
          color={"gray"}
          pr={1}
          borderRadius={"16px"}
          id="modal"
        >
          <Box p={1}></Box>
          <Text
            position={"absolute"}
            top={"-36px"}
            left={"50%"}
            transform={"translateX(-50%)"}
            color={"white"}
            zIndex={4000}
            textTransform={"capitalize"}
            fontWeight={600}
            fontSize={"18px"}
          >
            Chọn file Gif
          </Text>
          <ModalCloseButton
            position={"absolute"}
            top={"-36px"}
            left={"0"}
            color={"white"}
          />

          <ModalBody
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
            <Flex wrap="wrap" ml={"10px"}>
              {gif.map((link, index) => (
                <Image
                  loading="lazy"
                  key={link}
                  src={link}
                  alt={`GIF ${index + 1}`}
                  maxWidth="48%"
                  height="auto" // Maintain the original height of the GIF
                  borderRadius={"9px"}
                  m={1}
                  onClick={() => handleAddGif(link)}
                />
              ))}
            </Flex>
          </ModalBody>
          <Box p={2}></Box>
        </ModalContent>
      </Modal>
    </Fade>
  );
};

export default GifBox;
