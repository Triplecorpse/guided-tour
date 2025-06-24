"use client";

import { FormProvider, useForm } from "react-hook-form";
import AuthFormClient from "@/[lng]/components/AuthForm/AuthFormClient";

export default function FormProviderWrapper() {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <AuthFormClient />
    </FormProvider>
  );
}
