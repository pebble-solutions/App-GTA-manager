<template>
        <div :class="{'text-secondary': semaine.total == 0}">
            <div class="d-flex justify-content-between align-items-center fw-bold mb-2">
                <DateInterval :dd="semaine.dd" :df="semaine.df" classList="card-title m-0"></DateInterval>
                <span class="badge bg-secondary">S{{semaine.week}}</span>
            </div>

            <span class="fst-italic">{{allPointages()}}</span>

            <StackedBar :bars="stackedBarValue" :percentage="true" :totalValue="semaine.total" v-if="semaine.total > 0"></StackedBar>
        </div>
</template>

<script>
import StackedBar from '@/components/pebble-ui/charts/StackedBar.vue';
import DateInterval from './DateInterval.vue';

export default {
    props: {
        semaine: Object
    },

    computed: {
        /**
         * Retourne un tableau qui contient un object pour chaque bar
         * l'object contient une couleur et une valeur en %
         * 
         * @return {Array}     en % ex: 20 pour 20% 
         */
        stackedBarValue() {
            // let totalValider = (this.semaine.valider*100) / this.semaine.total;
            // let totalRejeter = (this.semaine.rejeter*100) / this.semaine.total;
            // let rest = 100 - (totalValider + totalRejeter);

            return [
                {
                    'color' : "success", 
                    // 'value' : totalValider.toFixed(0),
                    'value' : this.semaine.valider
                },
                {
                    'color' : "danger",
                    'value' : this.semaine.rejeter
                    // 'value' : totalRejeter.toFixed(0),
                },
                {
                    'color' : "warning",
                    'value' : this.semaine.total - (this.semaine.valider + this.semaine.rejeter)
                }
            ];
        }
    },

    components: {
        StackedBar,
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