import {
  Button,
  Flex,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { IoMdClose } from "react-icons/io";
import { RiFileGifLine } from "react-icons/ri";
import { ACTIONS, iconStyle } from "..";
import IconWrapper from "../IconWrapper";
import GifMsgBox from "./GifMsgBox";

const GifMsgBtn = ({ popup, onClose, onOpen, color = "" }) => {
  return (
    <Popover
      isOpen={popup === ACTIONS.GIF}
      placement="top-start"
      onClose={() => onClose()}
    >
      <PopoverTrigger>
        <Button
          padding={0}
          style={iconStyle}
          bg={"transparent"}
          _hover={{
            bg: "transparent",
          }}
        >
          <RiFileGifLine
            style={{
              ...iconStyle,
              color: color ? color : "",
            }}
            onClick={() => onOpen(ACTIONS.GIF)}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader
          fontWeight="semibold"
          textAlign={"center"}
          padding={"12px 16px"}
        >
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Text>Chọn file Gif</Text>
            <IconWrapper icon={<IoMdClose onClick={() => onClose()} />} />
          </Flex>
        </PopoverHeader>
        <PopoverArrow />
        <PopoverBody padding={"8px 4px"}>
          <GifMsgBox onClose={onClose} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default GifMsgBtn;
