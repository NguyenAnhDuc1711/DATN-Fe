import { Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useState } from "react";
import ConversationScreen from "./Conversation";
import DetailConversationTab from "./DetailTab";

const RightSideMsg = ({
  onBack,
  onDetailBack,
}: {
  onBack: Function;
  onDetailBack: Function;
}) => {
  const [openDetailTab, setOpenDetailTab] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Flex flex={isMobile ? 1 : 70} width="100%" minWidth="300px">
      {!isMobile || !openDetailTab ? (
        <ConversationScreen
          openDetailTab={openDetailTab}
          setOpenDetailTab={setOpenDetailTab}
          onBack={onBack}
        />
      ) : null}
      {openDetailTab && (
        <Container width={isMobile ? "100vw" : "20vw"}>
          <DetailConversationTab
            openDetailTab={openDetailTab}
            setOpenDetailTab={setOpenDetailTab}
          />
        </Container>
      )}
    </Flex>
  );
};

export default RightSideMsg;
