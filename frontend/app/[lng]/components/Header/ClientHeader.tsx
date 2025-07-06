"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutThunk } from "@/../lib/slices/AuthSlice";
import type { RootState } from "@/../lib/store";
import { useT } from "@/i18n/client";
import {
  FormControl,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function ClientHeader() {
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.auth);
  const { t } = useT("header");

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (state.status === "unauthenticated") {
      router.push("/");
    }
  }, [state.status]);

  function onChange(event: SelectChangeEvent<string>) {
    const value = event.target.value;
    if (value === "logout") {
      dispatch(logoutThunk());
    } else if (value === "dashboard") {
      router.push("/dashboard");
    }
  }

  return (
    <>
      {state.status === "authenticated" && (
        <div>
          {state?.user?.name && (
            <FormControl>
              <Select value="" onChange={onChange} displayEmpty>
                <MenuItem value="" disabled>
                  {state.user.name}
                </MenuItem>
                <MenuItem value="dashboard">{t("dashboard")}</MenuItem>
                <MenuItem value="logout">{t("logout")}</MenuItem>
              </Select>
            </FormControl>
          )}
        </div>
      )}
      {state.status !== "authenticated" && (
        <Link href={"/authentication"}>{t("login")}</Link>
      )}
    </>
  );
}
