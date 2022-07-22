<template>
        <div :class="{'text-secondary': semaine.total == 0}">
            <div class="d-flex justify-content-between align-items-center fw-bold mb-2">
                <DateInterval :dd="semaine.dd" :df="semaine.df" classList="card-title m-0"></DateInterval>
                <span class="badge bg-secondary">S{{semaine.week}}</span>
            </div>

            <span class="fst-italic">{{allPointages()}}</span>

            <ProgressBar :two-color="true" progress-color="success" rest-color="warning" :progress-value="progressValue" v-if="semaine.total > 0"></ProgressBar>
        </div>
</template>

<script>
import ProgressBar from '@/components/pebble-ui/ProgressBar.vue';
import DateInterval from './DateInterval.vue';

export default {
    props: {
        semaine: Object
    },

    computed: {
        /**
         * Calcule la progression de la progressbar
         * 
         * @return {Number}     en % ex: 20 pour 20% 
         */
        progressValue() {
            return (this.semaine.valider*100)/this.semaine.total;
        }
    },

    components: {
        ProgressBar,
        DateInterval
    },

    methods: {
        /**
         * Make the character string plural or not depending on the "total" nb de semaine
         */
        allPointages() {
            if(this.semaine.total > 1 ) {
                return this.semaine.total + ' Pointages';
            } else {
                return this.semaine.total + ' Pointage'
            }
        }
    }
}
</script>