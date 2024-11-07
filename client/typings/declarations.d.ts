declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

interface ImportMeta {
  env: {
    [key: string]: string;
  };
}