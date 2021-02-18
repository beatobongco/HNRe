const apiURL = "https://hacker-news.firebaseio.com/v0";
const cachePrefix = "HNRe";
const storiesCacheKey = `${cachePrefix}-stories`;

const setCachedObject = (key: string, o: object | undefined): void => {
  if (o) {
    window.localStorage.setItem(key, JSON.stringify(o));
  }
};

const getCachedObject = (
  key: string,
  default_: object | undefined = undefined
): object | undefined => {
  const o = window.localStorage.getItem(key);
  if (o) {
    return JSON.parse(o);
  } else {
    return default_;
  }
};

const handleFetchErrors = (response: Response): Promise<any> => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
};

const parseUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours()}:${(
    "0" + date.getMinutes()
  ).substr(-2)}`;
};

export {
  apiURL,
  parseUnixTimestamp,
  cachePrefix,
  storiesCacheKey,
  setCachedObject,
  getCachedObject,
  handleFetchErrors,
};
