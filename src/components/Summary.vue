<template>
    <tr class="text-center" >
        <PersonnelBadge :personnel="personnel" :rowspan="rowspan" :id="id" v-if="id == 0"> </PersonnelBadge>

        <td class="text-start">
            <span v-if="frSummary[resume]">{{frSummary[resume]}}</span>
            <span v-else>{{resume}}</span>
        </td>

        <td v-for="day in weekDays" :key="'th-'+day">
            {{valueSummaryDay(personnel.counters.days_summary, day, resume)}}
        </td>

        <td>
            {{valueSummaryWeek(personnel.counters.weeks_summary[yearWeek], resume)}}
        </td>
    </tr>
</template>

<script>
import PersonnelBadge from './PersonnelBadge.vue';


export default {
    props: {
        personnel: Object,
        id: Number,
        resume: String,
        weekDays: Array,
        gta_codages: Object,
        semaine: Object,
        rowspan: Number
    },

    data() {
        return {
            frSummary: {
                'working_time': 'Durée de travail',
                'break_time': 'Pause',
                'normal_hours': 'Heures normales',
                'night_hours': 'Heures de nuit',
                'holiday_hours': 'Jours férié',
                'sunday_hours': 'Heures du dimanche'
            },
        }
    },

    computed: {
        yearWeek() {
            let week = this.semaine.week;
            let splitDate = this.semaine.dd.split('-'); 
            let year = splitDate[0];

            return `${year}${week}`;
        }
    },

    components: {
        PersonnelBadge
    },

    methods: {
        /**
         * Renvoi les valeurs summary calculé sur un weekend
         * @param {Object} summaryWeek 
         * @param {String} summerKey
         * 
         * @return {Number}
         */
        valueSummaryWeek(summaryWeek, summaryKey) {
            let codage = this.gta_codages.find(e => e.nom == summaryKey);

            if(codage) {
                return this.twoDigitAfterComma(summaryWeek.gta_declarations[codage.id]);
            } 

            return this.twoDigitAfterComma(summaryWeek[summaryKey]);
            
        },

        /**
         * Renvoi les valeurs summary calculé sur un jour
         * @param {Object} summaryDay 
         * @param {Date} day 
         * @param {String} summaryKey
         * 
         * @return {Number}
         */
        valueSummaryDay(summaryDay, day, summaryKey) {
            let apiDate = `${day.getFullYear()}${Intl.DateTimeFormat('fr-FR',{month:'2-digit'}).format(day)}${Intl.DateTimeFormat('fr-FR',{day:'2-digit'}).format(day)}`;
            if(summaryDay[apiDate]) {
                let codage = this.gta_codages.find(e => e.nom == summaryKey);

                if(codage) {
                    if(summaryDay[apiDate]['gta_declarations'].length != 0) {
                        return this.twoDigitAfterComma(summaryDay[apiDate]['gta_declarations'][codage.id]);
                    }
                }

                if(summaryDay[apiDate][summaryKey]) {
                    return this.twoDigitAfterComma(summaryDay[apiDate][summaryKey]); 
                }
            }

            return;
        },

        /**
         * Retourn le chiffre a 2 chiffre apres la virgule ex: 5.62
         * @param {Number} number
         * 
         * @return {Number}
         */
        twoDigitAfterComma(number) {
            return Math.round(number * 100) / 100;
        }
    }
}
</script>