import {
  Container,
  Flex,
  SkeletonCircle,
  SkeletonText,
} from "@chakra-ui/react";

const UserBoxSekeleton = ({
  smallAvatar = false,
}: {
  smallAvatar?: boolean;
}) => {
  return (
    <Flex alignItems={"center"}>
      <SkeletonCircle size={smallAvatar ? "8" : "12"} />
      <Container width={"fit-content"}>
        <SkeletonText mt="2" noOfLines={1} skeletonHeight="3" width={"80px"} />
        <SkeletonText mt="2" noOfLines={1} skeletonHeight="3" width={"140px"} />
      </Container>
    </Flex>
  );
};

export default UserBoxSekeleton;
