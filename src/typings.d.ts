// Typings reference file, you can add your own global typings here
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var componentHandler: any;
declare var dialogPolyfill: {
  forceRegisterDialog: (HTMLElement) => void,
  registerDialog: (HTMLElement) => void,
  DialogManager: () => HTMLElement,
};

declare module 'just-compare' {
  const compare: (val1: any, val2: any) => boolean;
  export default compare;
}
