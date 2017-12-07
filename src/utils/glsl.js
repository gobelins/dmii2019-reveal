import { Vector3 } from 'three'

export const rgbToVec3 = (r, g, b) => new Vector3(r / 255, g / 255, b / 255)
export const rgbArrayToVec3 = (rgbArr) => new Vector3(rgbArr[0] / 255, rgbArr[1] / 255, rgbArr[2] / 255)
