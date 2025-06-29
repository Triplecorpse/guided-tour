const [{ DashboardPage }] = await Promise.all([
  import("@/[lng]/personal/dashboard/page"),
]);

export default function Personal() {
  return <DashboardPage></DashboardPage>;
}
