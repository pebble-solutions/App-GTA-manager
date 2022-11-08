/**
 * Retourne la durée entre deux date au format H:MM
 * 
 * @param {String} sd       
 * @param {String} sf 
 * 
 * @return {String}
 */
export function calculateDiffDate(sd, sf) {
    let dd = new Date(sqlDateToIso(sd));
    let df = new Date(sqlDateToIso(sf));

    let diff = df - dd;

    if (diff < 0) diff = 0;

    return numberToTimeString(diff);
}

/**
 * Convertie un horaire sur deux digit (ex 5 => 05)
 * @param {number|string} time Durée à convertir
 * @returns {string}
 */
export function padTime(time) {
    if (typeof time !== 'string') {
        time = time.toString();
    }

    return time.padStart(2, "0");
}

/**
 * Transforme une date SQL en une date ISO8601
 * @param {String} date Date SQL à transformer
 * @returns {String}
 */
export function sqlDateToIso(date) {
    if (date) {
        date = date.replace(/(\d{4}-\d{2}-\d{2})\s/, '$1T');
        return date;
    }
    return null;
}

/**
 * Convertie un nombre entier ou flottant en durée.
 * Ex : 65 => 1:05
 * 
 * @param {number} time Nombre à convertir
 * @returns {string}
 */
export function numberToTimeString(time) {
    let minutes = Math.floor((time / (1000 * 60)) % 60),
        hours = Math.floor((time / (1000 * 60 * 60)) % 24);

    if(!minutes) {
        minutes = 0;
    }

    if(!hours) {    
        hours = 0;
    }

    return hours + ":" + padTime(minutes); 
}