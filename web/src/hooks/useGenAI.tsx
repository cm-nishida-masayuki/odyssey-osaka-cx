import useSWR from "swr";

const generateText = (key: string) =>
  fetch(key, { method: "POST" }).then((res) => res.json());

export type GenAI = {
  response: string;
};

export const useGenAI = () => {
  const { data, error, isLoading } = useSWR<GenAI>(`genAI`, generateText);

  return [
    {
      data,
      isLoading,
      error,
    },
    {},
  ] as const;
};
