<template>
    <tr class="text-center" > <!--COMPONENT SUMMARY -->
        <td :rowspan="rowspan[personnel.id]" class="text-center" v-if="key == 'resume-0'">
            <UserImage :name="personnel.cache_nom" size="user-image-lg" class-name="my-1"></UserImage>
            <div>{{personnel.cache_nom}}</div>
        </td>

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
import UserImage from '@/components/pebble-ui/UserImage.vue';

export default {
    props: {
        personnel: Object,
        key: String,
        resume: String
    },

    data() {
        return {
            rowspan: [],
            frSummary: {
                'working_time': 'Durée de travail',
                'break_time': 'Pause',
                'normal_hours': 'Heures normal',
                'night_hours': 'Heures de nuit',
                'holiday_hours': 'Jours férié',
                'sunday_hours': 'Heures du dimanche'
            },
        }
    },

    components: {
        UserImage
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
                    return this.twoDigitAfterComma(summaryDay[apiDate]['gta_declarations'][codage.id]);
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