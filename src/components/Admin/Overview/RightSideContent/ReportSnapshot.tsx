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
import { sortObjectByValue } from "../utils";

const ReportSnapshot = () => {
  const dateRange = useAppSelector(
    (state: AppState) => state.admin.overview.dateRange
  );
  const [snapshotData, setSnapshotData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    handleGetUserActive();
  }, [dateRange]);

  const handleGetUserActive = async () => {
    try {
      setIsLoading(true);
      const currentDate = new Date();
      const date = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const currentDateString = `${year}-${month}-${date}`;
      const searchDateRange =
        dateRange?.start && dateRange?.end
          ? [dateRange?.start, dateRange?.end]
          : [currentDateString, currentDateString];
      const socket = Socket.getInstant();
      socket.emit(
        Route.ANALYTICS + ANALYTICS_PATH.GET_SNAPSHOT_REPORT,
        {
          dateRange: searchDateRange,
        },
        (data) => {
          setTimeout(() => {
            setSnapshotData({
              active: data.active,
              event: sortObjectByValue(data.event),
              locale: sortObjectByValue(data.locale),
              device: sortObjectByValue(data.device),
              os: sortObjectByValue(data.os),
            });
            setIsLoading(false);
          }, 1000);
        }
      );
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const containerBox = (cpns, fitBox = false) => {
    return (
      <Flex
        width={fitBox ? "fit-content" : "100%"}
        minWidth={fitBox ? "fit-content" : "80vw"}
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
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {cpn}
          </div>
        ))}
      </Flex>
    );
  };

  return (
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
          isLoading={isLoading}
        />,
        <DetailStatisticTable
          data={snapshotData?.event}
          title="User events"
          keyHead="Event"
          valHead="Total"
          isLoading={isLoading}
        />,
      ])}
      {containerBox([
        <MapGraph data={snapshotData?.locale} isLoading={isLoading} />,
        <BarGraph data={snapshotData?.locale} isLoading={isLoading} />,
      ])}
      {containerBox([
        <DoughnutGraph
          labels={snapshotData?.device ? Object.keys(snapshotData?.device) : []}
          data={snapshotData?.device ? Object.values(snapshotData?.device) : []}
          isLoading={isLoading}
        />,
        <DetailStatisticTable
          data={snapshotData?.os}
          title="User operating system"
          keyHead="OS"
          valHead="Total"
          isLoading={isLoading}
        />,
      ])}
    </Container>
  );
};

export default ReportSnapshot;
