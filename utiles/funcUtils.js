export const compareStrs = (s1, s2) => {
  if (s1.length === 0 || s2.length === 0) {
    return Math.max(s2.length, s1.length)
  }

  let opt = Math.max(s1.length, s2.length)

  if (s1[0] === s2[0]) {
    opt = compareStrs(s1.slice(1), s2.slice(1))
  }

  return Math.min(opt, 1 + compareStrs(s1.slice(1), s2))
}

export const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min) + min)
}
