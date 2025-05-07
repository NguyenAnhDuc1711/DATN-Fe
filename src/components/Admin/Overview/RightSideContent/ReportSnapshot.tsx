import { Container, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ANALYTICS_PATH, Route } from "../../../../Breads-Shared/APIConfig";
import { useAppSelector } from "../../../../hooks/redux";
import Socket from "../../../../socket";
import { AppState } from "../../../../store";
import BarGraph from "../AnalyticsGraph/BarGraph";
import DetailStatisticTable from "../AnalyticsGraph/DetailStatistic";
import DoughnutGraph from "../AnalyticsGraph/DonutGraph";
import LineGraph from "../AnalyticsGraph/LineGraph";
import MapGraph from "../AnalyticsGraph/MapGraph";
import DateRangeView from "../utils/DateRange";

const ReportSnapshot = () => {
  const dateRange = useAppSelector(
    (state: AppState) => state.admin.overview.dateRange
  );
  const [snapshotData, setSnapshotData] = useState<any>();

  useEffect(() => {
    handleGetUserActive();
  }, [dateRange]);

  const handleGetUserActive = async () => {
    try {
      const socket = Socket.getInstant();
      socket.emit(
        Route.ANALYTICS + ANALYTICS_PATH.GET_SNAPSHOT_REPORT,
        {
          dateRange: [dateRange?.start, dateRange?.end],
        },
        (data) => {
          setSnapshotData(data);
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const containerBox = (cpns) => {
    return (
      <Flex
        width={"100%"}
        gap={6}
        border={"1px solid white"}
        p={10}
        borderRadius={10}
        justifyContent={"center"}
        mb={4}
        maxH={"60vh"}
      >
        {cpns.map((cpn, index) => (
          <div
            key={`graph-${index}`}
            style={{
              flex: 1,
              width: "fit-content",
            }}
          >
            {cpn}
          </div>
        ))}
      </Flex>
    );
  };

  return (
    <>
      {snapshotData && (
        <Container
          id="report-snapshot"
          maxWidth={"100vw"}
          width={"100%"}
          m={0}
          p={6}
        >
          <Flex
            width={"100%"}
            height={"fit-content"}
            alignItems={"center"}
            justifyContent={"space-between"}
            mb={4}
          >
            <Text fontWeight="semibold" fontSize="lg">
              Report snapshot
            </Text>
            <DateRangeView />
          </Flex>
          {containerBox([
            <LineGraph
              labels={snapshotData?.active?.map(({ date }) => date)}
              data={snapshotData?.active?.map(({ data }) => data)}
            />,
            <DetailStatisticTable
              data={snapshotData?.locale}
              title="Active user in countries"
              keyHead="Country"
              valHead="Total"
            />,
          ])}
          {containerBox([
            <MapGraph data={snapshotData?.locale} />,
            <BarGraph data={snapshotData?.locale} />,
          ])}
          {containerBox([
            <DoughnutGraph
              labels={Object.keys(snapshotData?.device)}
              data={Object.values(snapshotData?.device)}
            />,
            <DetailStatisticTable
              data={snapshotData?.os}
              title="User operating system"
              keyHead="OS"
              valHead="Total"
            />,
          ])}
        </Container>
      )}
    </>
  );
};

export default ReportSnapshot;
