"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/../lib/slices/AuthSlice";
import type { RootState } from "@/../lib/store";
import { useT } from "@/i18n/client";

export default function ClientHeader() {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state.auth);
  const { t } = useT("header");

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <>
      {state.status === "authenticated" && (
        <div>{state?.user?.name && <div>{state.user.name}</div>}</div>
      )}
      {state.status !== "authenticated" && <div>{t("login")}</div>}
    </>
  );
}
