/**
 * @author UMU618 <umu618@hotmail.com>
 * @copyright MEET.ONE 2019
 * @description Use block-always-using-brace npm-coding-style.
 */

'use strict'

function removeItemFromArray(a, i) {
  const n = []
  for (let j = 0; j < a.length; ++j) {
    if (i != j) {
      n.push(a[j])
    }
  }
  return n
}

function arrayIntersection(a, b) {
  const n = []
  for (let ai of a) {
    for (let j = 0; j < b.length; ++j) {
      if (ai === b[j]) {
        n.push(ai)
        b = removeItemFromArray(b, j)
        break
      }
    }
  }
  return n
}

(() => {
  let a = [1, 2, 3, 4, 0, 1, 2, 3, 4]
  let b = [0, 9, 8, 7, 6, 5, 4, 3, 3]
  console.log(a, b, arrayIntersection(a, b))
  console.log(a, b)

  a = [1, 2, 3, 4, 0, 1, 2, 3, 4]
  b = [11, 23, 45, 67, 89, 0, 12, 23, 3]
  console.log(a, b, arrayIntersection(a, b))

  console.log(process.argv.length)
  console.log(process.argv[1])
})()