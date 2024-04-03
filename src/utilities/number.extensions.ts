interface Number {
  mod(n: number): number;
}

Number.prototype.mod = function (n: number): number {
  "use strict";
  return ((Number(this) % n) + n) % n;
};
