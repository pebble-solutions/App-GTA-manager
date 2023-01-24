/**
 * Retourne une semaine dans une liste depuis son code YW
 * 
 * @param {number} ym Le code de la semaine YW (ex : 202301)
 * @param {array} weeks La collection de semaine dans laquelle chercher la correspondance
 * 
 * @returns {object}
 */
export function getWeekFromYW(yw, weeks) {
    let week = null;

    if (weeks.length > 0) {
        week = weeks.find((e) => `${e.year}${e.week}` == yw);
    }

    return week;
}