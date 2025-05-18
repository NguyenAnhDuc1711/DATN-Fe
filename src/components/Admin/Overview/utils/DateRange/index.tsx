import { Container, Text } from "@chakra-ui/react";
import { useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { getDateYYYYMMDD } from "..";
import { useAppDispatch, useAppSelector } from "../../../../../hooks/redux";
import { updateDateRangeOverview } from "../../../../../store/AdminSlice";
import ClickOutsideComponent from "../../../../../util/ClickoutCPN";
import "./index.css";
import { AppState } from "../../../../../store";

const DateRangeView = () => {
  const dispatch = useAppDispatch();
  const dateRange = useAppSelector(
    (state: AppState) => state.admin.overview.dateRange
  );
  const validDateRange = dateRange?.start && dateRange?.end;
  const [dateRangeState, setDateRangeState] = useState([
    {
      startDate: validDateRange ? dateRange?.start : new Date(),
      endDate: validDateRange ? dateRange?.end : new Date(),
      key: "selection",
    },
  ]);
  const [openDatePickle, setOpenDatePickle] = useState(false);

  const displayDateRangeText = () => {
    const start = getDateYYYYMMDD(dateRangeState[0].startDate.getTime());
    const end = getDateYYYYMMDD(dateRangeState[0].endDate.getTime());
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
              setDateRangeState([item.selection]);
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
            ranges={dateRangeState}
            direction="horizontal"
            color="#000000"
          />
        )}
      </Container>
    </ClickOutsideComponent>
  );
};

export default DateRangeView;
