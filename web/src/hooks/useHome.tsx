import { useMemo } from "react";
import { useQuestionnaires } from "./useQuestionnaires";
import { useSessions } from "./useSessions";
import { isFuture } from "date-fns";

export const useHome = () => {
  const [
    { data: sessionsData, isLoading: sessionsIsLoading, error: sessionsError },
  ] = useSessions();

  const [
    {
      data: questionnairesData,
      isLoading: questionnairesIsLoading,
      error: questionnairesError,
    },
  ] = useQuestionnaires();

  const data = useMemo(() => {
    if (!sessionsData || !questionnairesData) return undefined;

    // 終了していないセッションを最大3件絞り込み
    const sessions = sessionsData.sessions
      .filter((session) => isFuture(new Date(session.endAt)))
      .slice(0, 3);
    const questionnaires = questionnairesData.questionnaires.slice(0, 3);

    return {
      sessions,
      questionnaires,
    };
  }, [sessionsData, questionnairesData]);

  const isLoading = useMemo(() => {
    return sessionsIsLoading || questionnairesIsLoading;
  }, [sessionsIsLoading, questionnairesIsLoading]);

  const error = useMemo(() => {
    return sessionsError || questionnairesError;
  }, [sessionsError, questionnairesError]);

  return [
    {
      data,
      isLoading,
      error,
    },
    {},
  ] as const;
};
