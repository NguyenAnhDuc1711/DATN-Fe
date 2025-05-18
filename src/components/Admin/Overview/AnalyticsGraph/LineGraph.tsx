import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Box, Flex, Skeleton, Text } from "@chakra-ui/react";

// Register required modules with ChartJS
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const LineGraph = ({ labels, data, isLoading = false }) => {
  const configData = {
    labels,
    datasets: [
      {
        label: "User active",
        data,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        // tension: 0.1, // Controls line smoothness
      },
    ],
  };

  const config = {
    type: "line",
    data: configData,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        // title: {
        //   display: true,
        //   text: "",
        // },
      },
    },
  };

  if (isLoading) {
    return (
      <Box width="100%" height="25vh" position="relative">
        <Flex height="calc(100% - 50px)">
          <Flex
            direction="column"
            justifyContent="space-between"
            pr={3}
            height="100%"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <Text fontSize="xs" color="gray.500">
                <Skeleton width="40px" height="10px" />
              </Text>
            ))}
          </Flex>

          {/* Chart area */}
          <Box width="100%" height="100%" position="relative" borderRadius="md">
            <Skeleton width="100%" height="100%" borderRadius="md" />
            <Box
              position="absolute"
              left="25%"
              top="40%"
              width="10px"
              height="10px"
              borderRadius="full"
              bg="rgb(75, 192, 192)"
              border="2px solid white"
            />
          </Box>
        </Flex>

        {/* X-axis date */}
        <Flex justifyContent="flex-start" mt={2} pl="50px">
          <Text fontSize="xs" color="gray.500">
            <Skeleton width="40px" height="10px" />
          </Text>
        </Flex>
      </Box>
    );
  }

  return <Line data={config.data} options={config.options} />;
};

export default LineGraph;
