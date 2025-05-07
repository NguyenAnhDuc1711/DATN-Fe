import { Avatar, Flex, Text } from "@chakra-ui/react";

const SendNextItem = ({
  conversation,
  selectedConversations,
  setSelectedConversations,
}: {
  conversation: any;
  selectedConversations: any;
  setSelectedConversations: Function;
}) => {
  const participant = conversation?.participant;
  const selected = selectedConversations.find(
    (ele) => ele._id === conversation._id
  );

  const handleTick = () => {
    if (selected) {
      const newList = selectedConversations.filter(
        (ele) => ele._id !== conversation?._id
      );
      setSelectedConversations(newList);
    } else {
      setSelectedConversations([
        ...selectedConversations,
        {
          _id: conversation._id,
          recipientId: conversation.participant._id,
        },
      ]);
    }
  };

  return (
    <Flex
      alignItems={"center"}
      justifyContent={"space-between"}
      cursor={"pointer"}
      p={2}
      px={4}
      borderRadius={6}
      _hover={{
        bg: "lightgray",
      }}
      onClick={() => handleTick()}
    >
      <Flex alignItems={"center"} gap={4}>
        <Avatar src={participant?.avatar} />
        <Text fontWeight={600}>{participant?.username}</Text>
      </Flex>
      <input
        type="checkbox"
        onChange={() => handleTick()}
        checked={selected}
        style={{
          width: "16px",
          height: "16px",
        }}
      />
    </Flex>
  );
};

export default SendNextItem;
