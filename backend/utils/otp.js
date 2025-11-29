export const generateOtp = (length = 6) => {
  const min = 10 ** (length - 1)
  const max = 10 ** length
  return Math.floor(Math.random() * (max - min) + min).toString()
}


