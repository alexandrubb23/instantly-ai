import { useQuery } from "@tanstack/react-query";
import type { Email } from "./types/email.type";

// A better approach here is to use Axios because it has a better API (cancellation, interceptors, etc.)
// Let's use fetch for simplicity
const findOne = async (id: number) => {
  const res = await fetch(`/api/emails/${id}`);
  if (!res.ok) throw new Error("Network response was not ok");
  return res.json();
};

export const useEmail = (id: number) => {
  return useQuery<Email>({
    queryKey: ["email", id],
    queryFn: () => findOne(id),
  });
};
