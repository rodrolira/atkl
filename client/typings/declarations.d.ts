declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMeta {
  env: {
    VITE_API_URL: string;
    [key: string]: string;
  };
}