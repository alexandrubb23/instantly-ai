import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Email } from "./types/email.type";

export const EMAIL_QUERY_KEY = ["emails"];

const getAll = async () => {
  const res = await axios.get<Email[]>("/api/emails");
  return res.data;
};

export const useEmails = () => {
  return useQuery<Email[], Error>({
    queryKey: EMAIL_QUERY_KEY,
    queryFn: getAll,
  });
};
