"use client";

import { useDispatch, useSelector } from "react-redux";
import { logoutThunk } from "@/../lib/slices/AuthSlice";
import type { RootState, AppDispatch } from "@/../lib/store";
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
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const state = useSelector((state: RootState) => state.auth);
  const { t } = useT("header");

  async function onChange(event: SelectChangeEvent<string>) {
    const value = event.target.value;
    if (value === "logout") {
      await dispatch(logoutThunk());
      router.push("/");
    } else if (value === "dashboard") {
      router.push("/dashboard");
    } else if (value === "profile") {
      router.push("/personal/profile");
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
                <MenuItem value="profile">{t("profile")}</MenuItem>
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
