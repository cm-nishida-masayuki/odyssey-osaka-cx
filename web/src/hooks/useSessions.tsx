import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export const useSessions = () => {
  // TODO: 型定義を追加する
  const { data, error, isLoading } = useSWR(
    `${config.API_URL}/sessions`,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  } as const;
};
