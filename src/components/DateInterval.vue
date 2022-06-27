<template>
    <span :class="classList">
        {{startDate}} 
        <i class="bi bi-chevron-right"></i>
        {{endDate}}
    </span>
</template>

<script>


export default {
    props: {
        dd: String,
        df: String,
        classList: {
            type: String,
            default: ''
        }
    },

    computed: {
        /**
         * Retourne la date de début dans un format humain.
         * Si l'année de début et l'année de fin de l'interval sont différentes, alors 
         * on affiche l'année.
         * @returns {String}
         */
        startDate() {
            let dd = new Date(this.dd);
            let df = new Date(this.df);

            return this.getHumanDate(dd, {year: dd.getFullYear() !== df.getFullYear() ? true : false});
        },

        /**
         * Retourne la date de fin dans un format humain
         * @returns {String}
         */
        endDate() {
            return this.getHumanDate(new Date(this.df), {year: true});
        }
    },

    methods: {

        /**
         * Retourne une date au format Lun. 20 Juin 2022
         * 
         * @param {Date} date La date à transformer
         * @param {Object} options 
         * - year               False par défaut. Si true, affiche l'année
         */
        getHumanDate(date, options) {
            options = typeof options === 'undefined' ? {} : options;

            let format = {weekday: "short", day:"numeric", month: "short"};

            if (options.year) {
                format.year = "numeric";
            }

            return date.toLocaleDateString('fr-FR', format);
        }
    }
}
</script>