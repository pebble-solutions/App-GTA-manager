import {sqlDateToIso} from './date';

/**
 * Retourne la durée du travail pour une liste de StructureTempsDeclaration.
 * 
 * @param {object[]} stds Une collection de structure temps declarations
 * 
 * @return {number}
 */
export function getWorkingTime(stds) {
    let duration = 0;
    stds.forEach(std => {
        let dd = std.dd_finale ? new Date( sqlDateToIso(std.dd_finale) ) : new Date();
        let df = std.df_finale ? new Date( sqlDateToIso(std.df_finale) ) : new Date();
        let ddp = std.dpd_finale ? new Date( sqlDateToIso(std.dpd_finale) ) : 0;
        let dfp = std.dfp_finale ? new Date( sqlDateToIso(std.dfp_finale) ) : 0;
        duration += (df - dd) - (dfp - ddp);
    });
    return duration;
}