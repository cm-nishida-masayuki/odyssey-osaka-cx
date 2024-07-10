import useSWR from "swr";
import { config } from "../config";

const fetcher = (key: string) => fetch(key).then((res) => res.json());

export type Sessions = {
  sessions: {
    sessionId: number;
    startAt: string;
    endAt: string;
    speakerCompany: string;
    speakerDepartment: string;
    speakerTitle: string;
    speakerName: string;
    sessionTitle: string;
    description: string;
  }[];
};

export const useSessions = () => {
  const { data, error, isLoading } = useSWR<Sessions>(
    `${config.API_URL}/sessions`,
    fetcher
  );

  return [
    {
      data,
      isLoading,
      error,
    },
    {},
  ] as const;
};
