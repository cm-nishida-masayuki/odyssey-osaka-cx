import { useCallback, useEffect, useMemo, useState } from "react";
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
  const [currentSessions, setCurrentSessions] = useState<Sessions["sessions"]>(
    []
  );

  // data.sessionsを開始時間順にソート
  const sessions = useMemo((): Sessions["sessions"] => {
    if (data === undefined) {
      return [];
    }
    return data.sessions.slice().sort((a, b) => {
      return new Date(a.startAt).getTime() - new Date(b.startAt).getTime();
    });
  }, [data]);

  const getCurrentSessions = useCallback(() => {
    if (data && data.sessions) {
      const now = new Date("2024-07-31 17:00:00");
      const filteredSessions = data.sessions.filter((session) => {
        const startAt = new Date(session.startAt);
        const endAt = new Date(session.endAt);
        return startAt <= now && now < endAt;
      });
      setCurrentSessions(filteredSessions);
    }
  }, [data]);

  // 1分毎に、現在のセッションを取得
  useEffect(() => {
    getCurrentSessions();
    const interval = setInterval(() => {
      getCurrentSessions();
    }, 60000);
    return () => {
      clearInterval(interval);
    };
  }, [getCurrentSessions]);

  return [
    {
      data: {
        sessions: sessions,
        currentSessions: currentSessions,
      },
      isLoading,
      error,
    },
    {},
  ] as const;
};
