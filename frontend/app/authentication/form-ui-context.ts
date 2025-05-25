const [{ createContext, useContext }] = await Promise.all([import("react")]);

export const FormUIContext = createContext<{ disabled: boolean }>({
  disabled: false,
});

export const useFormUI = () => useContext(FormUIContext);
