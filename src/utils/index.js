/* eslint no-await-in-loop: 0, no-restricted-syntax: 0 */

class Utils {
  static async loopSequentially(array, callback) {
    const resultArray = [];
    for (const [index, data] of array.entries()) {
      const result = await callback(data, index);
      resultArray.push(result);
    }
    return resultArray;
  }
}

export default Utils;
