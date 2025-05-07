import { Container, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { getDateYYYYMMDD } from "..";
import { useAppDispatch } from "../../../../../hooks/redux";
import { updateDateRangeOverview } from "../../../../../store/AdminSlice";
import ClickOutsideComponent from "../../../../../util/ClickoutCPN";
import "./index.css";

const DateRangeView = () => {
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDatePickle, setOpenDatePickle] = useState(false);

  const displayDateRangeText = () => {
    const start = getDateYYYYMMDD(dateRange[0].startDate.getTime());
    const end = getDateYYYYMMDD(dateRange[0].endDate.getTime());
    if (start === end) {
      return start;
    }
    return start + " ▷ " + end;
  };

  return (
    <ClickOutsideComponent onClose={() => setOpenDatePickle(false)}>
      <Container pos="relative" m={0} p={0} zIndex={10} width={"fit-content"}>
        <Container
          m={0}
          py={2}
          px={4}
          borderRadius={8}
          border={"1px solid white"}
          width={"fit-content"}
          onClick={() => setOpenDatePickle(true)}
        >
          <Text>{displayDateRangeText()}</Text>
        </Container>
        {openDatePickle && (
          <DateRangePicker
            onChange={(item) => {
              const startDate = item.selection.startDate.getTime();
              const endDate = item.selection.endDate.getTime();
              setDateRange([item.selection]);
              dispatch(
                updateDateRangeOverview({
                  start: getDateYYYYMMDD(startDate),
                  end: getDateYYYYMMDD(endDate),
                })
              );
              if (startDate < endDate) {
                // handleClose();
              }
              setOpenDatePickle(false);
            }}
            months={1}
            moveRangeOnFirstSelection={false}
            showDateDisplay={false}
            ranges={dateRange}
            direction="horizontal"
            color="#000000"
          />
        )}
      </Container>
    </ClickOutsideComponent>
  );
};

export default DateRangeView;
