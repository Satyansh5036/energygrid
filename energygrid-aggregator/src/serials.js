export function generateSerials(count = 500) {
  return Array.from({ length: count }, (_, i) =>
    `SN-${String(i).padStart(3, "0")}`
  );
}
