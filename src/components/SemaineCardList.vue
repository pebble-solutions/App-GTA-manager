<template>
        <div class="">
            <div class="d-flex justify-content-between align-items-center fw-bold mb-2">
                <span class="card-title m-0 fs-5">{{startDate}}<span v-if="year.start != year.end">{{year.start}}</span><i class="bi bi-chevron-right"></i>{{endDate}} {{year.end}}</span>
                <span>S{{semaine.week}}</span>
            </div>

            <span class="fst-italic">{{allPointages()}}</span>

            <ProgressBar :two-color="true" progress-color="success" rest-color="warning" :progress-value="progressValue" v-if="semaine.valider > 0"></ProgressBar>
            <ProgressBar v-else></ProgressBar>
        </div>
</template>

<script>
import ProgressBar from '@/components/pebble-ui/ProgressBar.vue';

export default {
    props: {
        semaine: Object
    },

    data() {
        return {
            year: {
                start: null,
                end: null
            }
        }
    },

    computed: {
        progressValue() {
            return (this.semaine.valider*100)/this.semaine.total;
        },

        startDate() {
            let dateFormat = {weekday: "short", day:"numeric"};
            let beginDate = new Date(this.semaine.dd).toLocaleDateString('fr-FR', dateFormat);
            
            return beginDate;
        },

        endDate() {
            let dateFormat = {weekday: "short", day:"numeric"};
            let endDate = new Date(this.semaine.df).toLocaleDateString('fr-FR', dateFormat);

            return endDate;
        }




    },

    components: {
        ProgressBar
    },

    methods: {
        allPointages() {
            if(this.semaine.total > 1 ) {
                return this.semaine.total + ' Pointages';
            } else {
                return this.semaine.total + ' Pointage'
            }
        }
    },

    mounted() {
        let startDate = new Date(this.semaine.dd)
        this.year.start = startDate.getFullYear();

        this.year.end = new Date(this.semaine.df).getFullYear();

        console.log(this.semaine.dd);
        console.log(this.semaine.df);
        console.log(typeof this.semaine.dd);
        console.log(typeof this.semaine.df);

        console.log(this.year.start);
        console.log(this.year.end);
    },
}
</script>