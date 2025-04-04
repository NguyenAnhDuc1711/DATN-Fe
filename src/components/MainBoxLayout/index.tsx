import { Container, Flex, useColorMode } from "@chakra-ui/react";

export const containerBoxWidth = "640px";

const ContainerLayout = ({ children }) => {
  const { colorMode } = useColorMode();

  return (
    <Flex
      position={"sticky"}
      justifyContent={"center"}
      width={"calc(100vw-12px)"}
      margin={"0"}
      height={"fit-content"}
    >
      <Container
        bg={colorMode === "dark" ? "#181818" : "#fafafa"}
        minHeight={"100vh"}
        height={"fit-content"}
        mt={6}
        borderRadius={"2xl"}
        width={containerBoxWidth}
        maxWidth={containerBoxWidth}
        margin={"10px"}
        padding={"16px"}
        boxShadow={"0px 0px 8px -3px rgba(0,0,0,0.53)"}
      >
        {children}
      </Container>
    </Flex>
  );
};

export default ContainerLayout;
