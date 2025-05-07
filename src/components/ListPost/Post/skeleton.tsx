import {
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Box,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";

const SkeletonPost = () => {
  const bgColor = useColorModeValue("cuse.light", "cuse.dark");
  return (
    <Box
      padding="6"
      boxShadow="lg"
      bg={bgColor}
      mb={"12px"}
      borderRadius={"12px"}
    >
      <Flex gap={"12px"}>
        <SkeletonCircle size="10" />
        <Skeleton height="16px" width={"88px"} />
      </Flex>
      <SkeletonText mt="4" noOfLines={2} spacing="4" skeletonHeight="3" />
      <Skeleton
        width={"100%"}
        height={"200px"}
        mt={"4"}
        borderRadius={"10px"}
      />
    </Box>
  );
};

export default SkeletonPost;
