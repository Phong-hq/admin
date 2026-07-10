export const useDebounce = (callbackFn: any, timeout: number = 300) => {
   let timer = null as any;
   return function () {
      const args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => {
         callbackFn(...args);
      }, timeout)
   }
}
