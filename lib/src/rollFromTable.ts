import { random } from './random'
import { last } from './utils'

type Table = [number, string][]

/**
 * Gives a random value from a static table.
 * Designed to be less performance-intensive than weightedRandomFetcher,
 *
 * The table should contain the intended probabilities of each result
 * for example, calling rollFromTable([[1, 'a'], [2, 'b']])
 * would return 'a' 1/3 of the time, and b 2/3 of the time.
 *
 * Defining maxRoll is not strictly necessary, although I recommend
 * doing so to prevent re-computing the same total of probabilities.
 *
 * Using bias will make certain outcomes more likely. Negative biases
 * skew results toward the first entries, and positive biases skew
 * toward the last entries.
 */
export function rollFromTable (table: Table, maxRoll?: number, bias = 0) {
  if (!maxRoll) {
    // set it to be the sum of probabilities
    maxRoll = table.reduce((a, [b]) => a + b, 0)
  }
  let roll = random(1, maxRoll) + bias

  for (const [prob, result] of table) {
    roll -= prob
    if (roll <= 0) return result
  }

  // roll too high, return last entry in table
  const [, result] = last(table)
  return result
}