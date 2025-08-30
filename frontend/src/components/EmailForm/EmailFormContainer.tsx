import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import EmailForm from "./EmailForm";
import { smartAppend } from "~/utils/smartAppend";
import { EMAIL_QUERY_KEY } from "~/hooks/http/useEmails";

type FormData = z.infer<typeof schema>;

export type DeltaField = "subject" | "body";

const schema = z.object({
  to: z.email(),
  cc: z.email().optional().or(z.literal("")),
  bcc: z.email().optional().or(z.literal("")),
  subject: z.string().min(1),
  body: z.string().min(1),
});

export default function EmailFormContainer() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { to: "", cc: "", bcc: "", subject: "", body: "" },
  });

  const { reset, getValues, setValue, watch } = form;
  const queryClient = useQueryClient();

  const [info, setInfo] = useState("");
  const [error, setError] = useState("");
  const [aiOpen, setAiOpen] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: FormData) => axios.post<FormData>("/api/emails", data),
    onSuccess: (res) => {
      queryClient.setQueryData(
        EMAIL_QUERY_KEY,
        (prevData: FormData[] | undefined) => [res.data, ...(prevData || [])],
      );
      reset();
      setInfo("✅ The email was added");
    },
    onError: () => setInfo("❌ Something went wrong, please try again later."),
  });

  const handleSubmit = form.handleSubmit((data) => mutation.mutate(data));

  const handleAIStart = () => {
    setValue("subject", "", { shouldDirty: true });
    setValue("body", "", { shouldDirty: true });
    setAiOpen(false);
  };

  const handleAIDelta = (field: DeltaField, delta: string) => {
    const curr = getValues(field) ?? "";
    const next = smartAppend(curr, delta);
    setValue(field, next, { shouldDirty: true, shouldValidate: true });
  };

  const subjectVal = watch("subject") || "";
  const bodyVal = watch("body") || "";

  return (
    <FormProvider {...form}>
      <EmailForm
        onSubmit={handleSubmit}
        info={info}
        setInfo={setInfo}
        error={error}
        setError={setError}
        aiOpen={aiOpen}
        setAiOpen={setAiOpen}
        onAIStart={handleAIStart}
        onAIDelta={handleAIDelta}
        isBotTyping={isBotTyping}
        setIsBotTyping={setIsBotTyping}
        subjectVal={subjectVal}
        bodyVal={bodyVal}
        submitting={mutation.isPending}
      />
    </FormProvider>
  );
}
