export const debounce = (func, timeout) => {
  let timer;
  // 引数に受け取った関数 func を拡張して返す
  return function (...args) {
    clearTimeout(timer);
    // timeout で指定された時間後に呼び出しをスケジュール
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  }
}
