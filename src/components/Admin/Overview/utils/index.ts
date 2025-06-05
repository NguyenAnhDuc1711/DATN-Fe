export const getDateYYYYMMDD = (dateTimeStamp: number) => {
  const d = new Date(dateTimeStamp);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return year + "-" + month + "-" + date;
};

export const sortObjectByValue = <T extends Record<string, number>>(
  obj: T
): T => {
  return Object.fromEntries(
    Object.entries(obj).sort(([, a], [, b]) => b - a)
  ) as T;
};
