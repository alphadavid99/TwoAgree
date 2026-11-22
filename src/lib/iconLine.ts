/**
 * The line an icon is drawn with, in screen pixels, by how big it's drawn
 * (design hack 5). Icons are drawn on a 24-unit grid, so a fixed strokeWidth
 * used to grow with the icon: 1.4px at 17px, 3.7px at 44px. Now an icon next
 * to small text gets 1.75px, a normal one 2px, a large one 2.5px.
 */
export function iconLine(size: number): number {
  return size >= 40 ? 2.5 : size >= 22 ? 2 : 1.75;
}
