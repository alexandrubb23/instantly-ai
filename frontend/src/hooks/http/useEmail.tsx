import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Email } from "./types/email.type";

const findOne = async (id?: string) => {
  const res = await axios.get<Email>(`/api/emails/${id}`);
  return res.data;
};

export const useEmail = (id?: string) => {
  return useQuery<Email>({
    queryKey: ["email", id],
    queryFn: () => findOne(id),
    enabled: !!id,
  });
};
