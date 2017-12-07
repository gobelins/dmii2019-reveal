export const randomInt = (min = 0, max = 1) => Math.floor((Math.random() * ((max - min) + 1)) + min)

export const randomFloat = (min = 0, max = 1) => (Math.random() * (max - min)) + min

export const tween = (input, output, progress) => input + (progress * (output - input))

export const arrayAverage = array => array.reduce((a, b) => a + b) / array.length

export const roundToPrec = (num, prec) => Math.round(num * (10 ** prec)) / (10 ** prec)

export const ceilToPrec = (num, prec) => Math.ceil(num * (10 ** prec)) / (10 ** prec)

export const shuffleArray = (array) => {
  let j = 0
  let temp = null

  for (let i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}