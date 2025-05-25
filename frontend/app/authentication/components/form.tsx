"use client";

const [{ TextField }, { useFormContext }, { useTranslation }, { useFormUI }] =
  await Promise.all([
    import("@mui/material"),
    import("react-hook-form"),
    import("react-i18next"),
    import("@/authentication/form-ui-context"),
    import("@/i18n/i18n"),
  ]);

interface AuthenticationFormProps {
  email: boolean;
  password: boolean;
  name: boolean;
}

export function AuthenticationForm(view: AuthenticationFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const { disabled } = useFormUI();
  const { t } = useTranslation();

  return (
    <div className="mb-4">
      <div className="mb-4">
        {view.email && (
          <>
            <TextField
              error={!!errors.email}
              disabled={disabled}
              className="w-full"
              id="email"
              label={t("authentication.email") + " *"}
              variant="standard"
              {...register("email", {
                required: t("authentication_errors.emailRequired"),
              })}
            />
            {errors.email && (
              <p className="text-mui-error text-sm">
                {errors.email.message as string}
              </p>
            )}
          </>
        )}
      </div>
      <div className="mb-4">
        {view.name && (
          <>
            <TextField
              error={!!errors.full_name}
              disabled={disabled}
              className="w-full"
              id="name"
              label={t("authentication.name") + " *"}
              variant="standard"
              {...register("full_name", {
                required: t("authentication_errors.nameRequired"),
              })}
            />
            {errors.full_name && (
              <p className="text-mui-error text-sm">
                {errors.full_name.message as string}
              </p>
            )}
          </>
        )}
      </div>
      <div className="mb-4">
        {view.password && (
          <>
            <TextField
              error={!!errors.password}
              disabled={disabled}
              className="w-full"
              id="password"
              type="password"
              label={t("authentication.password") + " *"}
              variant="standard"
              {...register("password", {
                required: t("authentication_errors.passwordRequired"),
              })}
            />
            {errors.password && (
              <p className="text-mui-error text-sm">
                {errors.password.message as string}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
