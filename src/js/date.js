/**
 * Calcule une durée entre 2 date
 * @param {String} sd       
 * @param {String} sf 
 * 
 * @return {String}         format hours : minutes
 */
export function calculateDiffDate(sd, sf) {
    let dd = new Date(sd);
    let df = new Date(sf);

    let diff = Math.abs(dd - df);

    let minutes = Math.floor((diff / (1000 * 60)) % 60),
        hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    if(!minutes) {
        minutes = '0';
    }

    if(!hours) {
        hours = '0';
    }

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return hours + ":" + minutes; 
}