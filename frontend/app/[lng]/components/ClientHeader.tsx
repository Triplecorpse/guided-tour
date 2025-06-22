"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "@/../lib/slices/AuthSlice";
import type { RootState } from "@/../lib/store";

export default function ClientHeader() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth);
  debugger;

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div>
      {user?.name && <div>{user.name}</div>}
      {user && <Link href="/personal">personal</Link>}
    </div>
  );
}
