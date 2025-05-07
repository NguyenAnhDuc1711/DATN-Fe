import { Input } from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import useDebounce from "../../hooks/useDebounce";

const SearchBar = ({
  value,
  setValue,
  placeholder,
}: {
  value: string;
  setValue: Function;
  placeholder: string;
}) => {
  const [text, setText] = useState(value);
  const debounceValue = useDebounce(text, 800);

  useEffect(() => {
    if (debounceValue !== value) {
      setValue(debounceValue);
    }
  }, [debounceValue]);

  useEffect(() => {
    if (value !== text) {
      setText(value);
    }
  }, [value]);

  return (
    <Input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder={placeholder}
      width={"100%"}
      maxWidth={"100%"}
      height={"100%"}
      padding={"0 16px"}
      border={"1px solid gray"}
    />
  );
};

export default memo(SearchBar);
