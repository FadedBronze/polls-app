export type Color = readonly [number, number, number]

export function isDark(color: Color): boolean {
  return color[0] + color[1] + color[2] < 382
}

export function mix(...colors: Color[]) {
  let r = 0
  let g = 0
  let b = 0
  
  for (const color of colors) {
    r += color[0]
    g += color[1]
    b += color[2]
  }

  r/=colors.length
  g/=colors.length
  b/=colors.length
  
  return [r, g, b] as Color
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function colorString(color: Color) {
  return "#" + componentToHex(color[0]) + componentToHex(color[1]) + componentToHex(color[2]);
}

export function hex(str: string): Color {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(str);
  
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
}

export const blue: Color = [0, 0, 255]
export const orange: Color = [255, 127, 0]
export const red: Color = [255, 0, 0]
export const green: Color = [0, 255, 0]
export const magenta: Color = [255, 0, 255]
export const yellow: Color = [255, 255, 0]
export const white: Color = [255, 255, 255]
export const black: Color = [0, 0, 0]

//pastel

export const pastel_yellow = hex("fbf8cc")
export const pastel_tan = hex("fde4cf")
export const pastel_orange = hex("ffcfd2")
export const pastel_violet = hex("f1c0e8")
export const pastel_purple = hex("cfbaf0")
export const pastel_blue = hex("a3c4f3")
export const pastel_sky_blue = hex("90dbf4")
export const pastel_light_blue = hex("8eecf5")
export const pastel_aqua = hex("98f5e1")
export const pastel_green = hex("b9fbc0")