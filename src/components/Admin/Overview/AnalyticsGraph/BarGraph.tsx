import { BarElement, Chart as ChartJS } from "chart.js";
import { Bar } from "react-chartjs-2";
import { localeToCountry } from "./map";
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";

ChartJS.register(BarElement);

const BarGraph = ({
  data,
  isLoading = false,
}: {
  data: any;
  isLoading: boolean;
}) => {
  const labels = data ? Object.keys(data).map((id) => localeToCountry(id)) : [];
  const dataConfig = {
    labels: labels,
    datasets: [
      {
        label: "Countries",
        data: data ? Object.values(data) : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const config = {
    type: "bar",
    data: dataConfig,
    options: {
      indexAxis: "y" as const,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  if (isLoading) {
    return (
      <Box width="100%" height="25vh" position="relative">
        {/* Legend */}
        <Flex alignItems="center" mb={4} justifyContent={"center"}>
          <Skeleton width="50px" height="20px" bg="rgb(255, 99, 132)" mr={2} />
          <Text color="gray.500">Countries</Text>
        </Flex>

        {/* Chart area with country and bar */}
        <Flex flexDir={"column"} gap={2}>
          {[1, 2, 3, 4].map((item) => (
            <Flex
              height="calc(100% - 50px)"
              width="100%"
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Flex width={"20%"} height={"100%"} alignItems={"center"}>
                <Skeleton width="100%" height="20px" />
              </Flex>
              <Box width="75%" height="100%" position="relative">
                <Skeleton
                  width="100%"
                  height="30px"
                  bg="rgba(255, 99, 132, 0.2)"
                  borderRadius="sm"
                  border="1px solid rgb(255, 99, 132)"
                />
              </Box>
            </Flex>
          ))}
        </Flex>
      </Box>
    );
  }

  return <Bar data={config.data} options={config.options} />;
};

export default BarGraph;
