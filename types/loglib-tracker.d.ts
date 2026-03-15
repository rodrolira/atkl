declare module "@loglib/tracker" {
  export const loglib: {
    record: (config?: { id?: string; [key: string]: unknown }) => void;
    track: (name: string, payload?: Record<string, unknown>) => void;
    identify: (payload: Record<string, string>) => void;
    setConsent: (consent: "granted" | "denied") => void;
  };
}
