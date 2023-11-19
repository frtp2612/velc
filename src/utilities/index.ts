export function deepEqual(obj1: any, obj2: any) {
  // Check if the two objects are of the same type
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  // If they are primitives, compare their values
  if (typeof obj1 !== "object" || obj1 === null) {
    return obj1 === obj2;
  }

  // Get the keys of both objects
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  // Check if they have the same number of keys
  if (keys1.length !== keys2.length) {
    return false;
  }

  // Recursively compare the values of nested properties
  for (const key of keys1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  // If all checks pass, the objects are deep equal
  return true;
}

export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
