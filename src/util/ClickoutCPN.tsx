import { useEffect, useRef } from "react";

const ClickOutsideComponent = ({ children, onClose }) => {
  const ref = useRef<any>(null);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClose && onClose(event);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
};

export default ClickOutsideComponent;
