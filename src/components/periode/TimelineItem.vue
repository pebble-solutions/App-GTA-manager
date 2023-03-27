<template>
    <div class="timeline-item fs-6 text-warning"   v-if="date_origin != date_record && !isToleratedDelta">
        <span class="timeline-icon"><i class="bi bi-exclamation-diamond"></i></span>
        <span class="timeline-label" style="text-decoration : line-through">
            {{time_record}}
        </span>
    </div>
    <div class="timeline-item text-secondary fs-6"   v-if="date_origin != date_finale">
        <span class="timeline-icon"><i class="bi bi-exclamation-diamond"></i></span>
        <span class="timeline-label" style="text-decoration : line-through">
            {{time_origin}}
        </span>
    </div>
    <div class="timeline-item fs-6">
        <span class="timeline-icon text-secondary"><i class="bi bi-stopwatch"></i></span>
        <span class="timeline-label">
            {{time_finale}}
        </span>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import { dateToTime } from '../../js/date';

export default {
    props: {
        date_origin: String,
        date_finale: String,
        date_record: String,
        ref_origin: String,
        ref_finale: String,
        ref_record: String,
        clock_status: {
            type: String,
            default: "over"
        }
    },

    computed: {

        ...mapState(['config']),

        /**
         * Retourne l'heure d'origine déclarée
         * @return {string}
         */
        time_origin() {
            return this.returnWithStatus(this.dateToTime(this.date_origin, this.ref_origin));
        },

        /**
         * Retourne l'heure finale
         * @return {string}
         */
        time_finale() {
            return this.returnWithStatus(this.dateToTime(this.date_finale, this.ref_finale));
        },

        /**
         * Retourne l'heure au moment de l'enregistrement
         * @return {string}
         */
        time_record() {
            return this.returnWithStatus(this.dateToTime(this.date_record, this.ref_record));
        },

        /**
         * Retourne true si la différence entre dd_record et dd_finale est tolérée par la configuration
         * 
         * @return {bool}
         */
        isToleratedDelta() {
            return true;
        }
    },

    methods: {
        /**
         * Retourne la date SQL au format H:MM ou J+1 H:MM.
         *
         * @param {string} val La date à convertir
         * @param {string} refVal La valeur précédente (pour avoir le J+1 sur la date de fin)
         *
         * @return {string}
         */
        dateToTime(val, refVal) {
            return dateToTime(val, refVal);
        },

        /**
         * Retourne la valeur ou "En cours" si le status n'est pas terminé
         * 
         * @param {string} val Valeur si le status est terminé
         * 
         * @return {string}
         */
        returnWithStatus(val) {
            return this.clock_status !== "over" ? "En cours" : val;
        }
    }
};
</script>
