import React, { createContext, useState } from "react";

type AuthPayload = {
  token: string;
  type: "Bearer";
};

type AuthContextType = {
  payload: AuthPayload;
  setPayload: React.Dispatch<React.SetStateAction<AuthPayload>>;
  resetPayload: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {} & React.PropsWithChildren;

export function AuthProvider({ children }: AuthProviderProps) {
  const [payload, setPayload] = useState<AuthPayload>({
    token: "",
    type: "Bearer",
  });

  const resetPayload = () => setPayload({ token: "", type: "Bearer" });

  return (
    <AuthContext.Provider value={{ payload, setPayload, resetPayload }}>
      {children}
    </AuthContext.Provider>
  );
}
