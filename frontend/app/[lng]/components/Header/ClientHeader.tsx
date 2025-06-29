"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/../lib/slices/AuthSlice";
import type { RootState } from "@/../lib/store";
import { useT } from "@/i18n/client";
import Link from "next/link";

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
        <div>
          {state?.user?.name && (
            <Link href={"/personal"}>{state.user.name}</Link>
          )}
        </div>
      )}
      {state.status !== "authenticated" && (
        <Link href={"/authentication"}>{t("login")}</Link>
      )}
    </>
  );
}
