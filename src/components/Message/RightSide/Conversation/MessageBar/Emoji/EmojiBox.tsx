import { Container, Flex, Text } from "@chakra-ui/react";
import { memo, useMemo } from "react";
import { emojiMap } from "../../../../../../util";
import IconWrapper from "../IconWrapper";

const EmojiBox = ({ searchValue, currentEmoji = "", onClick }) => {
  const emojis = useMemo(() => {
    const filterEmoji = Object.values(emojiMap)
      .filter(({ names }) => {
        return names.find((name) => name.includes(searchValue));
      })
      ?.map(({ icon }) => icon);
    return filterEmoji;
  }, [searchValue]);

  return (
    <Container
      padding={0}
      overflowY={"auto"}
      maxHeight={"200px"}
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
      <Flex wrap="wrap" width={"180px"} gap={"4px"}>
        {emojis.map((emoji) => (
          <IconWrapper
            key={emoji}
            addBg={currentEmoji ? currentEmoji === emoji : false}
            icon={
              <Text
                onClick={() => {
                  !!onClick && onClick(emoji);
                }}
              >
                {emoji}
              </Text>
            }
          />
        ))}
      </Flex>
    </Container>
  );
};

export default memo(EmojiBox);
