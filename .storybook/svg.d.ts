/* SVG modules resolve to URL strings via Vite's asset pipeline. */
declare module '*.svg' {
  const src: string;
  export default src;
}
