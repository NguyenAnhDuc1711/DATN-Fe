import { Flex, Text } from "@chakra-ui/react";
import PageConstant from "../../../../Breads-Shared/Constants/PageConstants";

export const overviewTabs = [
  {
    name: "Reports snapshot",
    page: PageConstant.ADMIN.REPORT_SNAPSHOT,
  },
  {
    name: "Realtime overview",
    page: PageConstant.ADMIN.REALTIME_OVERVIEW,
  },
  {
    name: "Realtime pages",
    page: PageConstant.ADMIN.REALTIME_PAGES,
  },
];

const LeftSideBarOverview = () => {
  return (
    <Flex flexDir={"column"} width={"240px"} height={"100vh"} p={4}>
      {/* {overviewTabs.map(({ name }) => (
        <Text key={name}>{name}</Text>
      ))} */}
    </Flex>
  );
};

export default LeftSideBarOverview;
