import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";

const MessagesSkeleton = () => {
  return [...Array(5)].map((_, i) => (
    <Flex
      key={i}
      gap={2}
      alignItems={"center"}
      p={1}
      borderRadius={"md"}
      alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
    >
      {i % 2 === 0 && <SkeletonCircle size={7} />}
      <Flex flexDir={"column"} gap={2}>
        <Skeleton h={"32px"} w={"240px"} />
      </Flex>
    </Flex>
  ));
};

export default MessagesSkeleton;
