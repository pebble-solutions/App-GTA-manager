<template>
    
    <div class="week-header">
        <table class="table table-sm table-bordered m-0" id="header-week">
            <thead class="align-middle text-center table-secondary text-secondary">
                <tr>
                    <th class="week-header-col"></th>
                    <th class="week-header-col fw-normal" v-for="day in weekDays" :key="'header-week-day-'+day.getDate()" v-html="getHeaderLabel(day)"></th>
                    <th class="week-header-col table-primary fw-normal text-primary">S{{semaine.week}}</th>
                </tr>
            </thead>
        </table>
    </div>

</template>

<style lang="scss" scoped>
.week-header {
    position:fixed;
    overflow: visible;
    z-index: 20;
}
</style>

<script>

export default {

    props: {
        weekDays: Array,
        semaine: Object
    },

    methods: {

        /**
         * Retourne le libellé au local depuis une date
         * 
         * @param {Date} date La date pour laquelle le libellé est à retourner
         * 
         * @return {String}
         */
        getHeaderLabel(date) {
            return '<span class="fs-7">'+date.toLocaleDateString('fr-FR', {weekday: 'short'}).toUpperCase()+'</span><br>'+date.toLocaleDateString('fr-FR', {day:'2-digit', month: '2-digit'})
        }
    }
}

</script>