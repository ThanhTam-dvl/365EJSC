function add(a: number, b: number): number {
  return a + b;
}
add(5, 6);   // OK
add(5, "6"); // Lỗi: '6' không phải number
