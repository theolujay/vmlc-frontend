export const isDev = () => {
  const nodeEnv = process.env.NODE_ENV as string;
  return nodeEnv === "development" || nodeEnv === "staging";
};
