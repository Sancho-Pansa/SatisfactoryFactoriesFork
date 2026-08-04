/**
 * Implements pluralization rules of Russian language:
 * singular - 1 and every cardinal ending with 1, except 11;
 * paucal - 2-4 and every cardinal ending with 2-4 (24, 343, etc), except 12-14;
 * plural - 0, 5-19, and every other not falling into above.
 * @param number cardinal of the item
 * @param variantNumber Quantity of supplied forms
 * @returns Which counting form to use
 */
function ru (count: number): number {
  const isTeen = count > 10 && count < 20
  if (count % 10 === 1 && !isTeen) {
    return 0
  }
  if (count % 10 >= 2 && count % 10 <= 4 && !isTeen) {
    return 1
  }
  return 2
}

export {
  ru,
}
