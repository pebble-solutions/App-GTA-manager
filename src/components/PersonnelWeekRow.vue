<template>
    <tbody class="table-group-divider table-personnel">

        <tr v-if="personnel" class="table-secondary">
            <td colspan="9"><PersonnelBadge :personnel="personnel"></PersonnelBadge></td>
        </tr>

        <template v-if="summary.length != 0">
            <Summary v-for="(resume, index) in summary" 
                :key="'resume-'+index"
                :id="index"
                :personnel="personnel"
                :resume="resume"
                :weekDays="weekDays"
                :gta_codages="gta_codages"
                :semaine="semaine"
                :rowspan="rowspan"
            ></Summary>
        </template>

        <tr v-if="personnel" class="text-center personnel-periodes">

            <td class="col-day"></td>

            <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                <PeriodeCard 
                    v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)" 
                    :key="'periode-'+periode.id"
                    :periode="periode"
                    :personnel="personnel"
                    @change="$emit('change')" />
            </td>

            <td class="col-day"></td>
        </tr>
    </tbody>
</template>

<style lang="scss">
    .shadow-info {
        box-shadow: 0 0.5rem 1rem rgba(13, 202, 240, .15);
    }
    
    .square-color {
        color: rgba(13, 202, 240);
    }
</style>

<script>
import Summary from '@/components/Summary.vue';
import PersonnelBadge from './PersonnelBadge.vue';
import { mapState } from 'vuex';
import PeriodeCard from './PeriodeCard.vue';

export default {
    props: {
        personnel: Object,
        weekDays: Array,
        semaine: Object
    },

    emits: ['change'],

    data() {
        return {
            rowspan: null,
        }
    },

    computed: {
        ...mapState(['gta_codages']),

        summary() {
            return this.getSummary();
        }
    },

    components: { Summary, PersonnelBadge, PeriodeCard },

    methods: {
        /**
         * Renvoi un tableau summary avec juste les informations qui nous interesse et non null
         * 1- ajout dans un nouveau trableau juste les element qui nous interesse
         * 2- Si index = Gta_declaration alors on boucle sur le resultat pour recuperer l'id qu'on map avec l'id de gta_codages pour récup le nom.
         * @param {Object} total_summary 
         * 
         * @return {Array} merge
         */
        getSummary() {
            let total_summary = this.personnel.counters.total_summary;
            let summary = [];
            let declarations = [];

            for( const index in total_summary) {
                if(index !== "declarations" && index!== 'amplitude' && index !== 'gta_declarations' && index != 'hours_per_day') {
                    if(total_summary[index]) {
                        summary.push(index);
                    }
                }

                if(index == 'gta_declarations') {
                    if(total_summary[index]) {
                        for(const codageId in total_summary[index]) {
                            if(total_summary[index][codageId]) {
                                let codage = this.gta_codages.find(e => e.id == codageId);
        
                                declarations.push(codage.nom);
                            }
                        }
                    }
                }
            }

            let merge = summary.concat(declarations);

            this.rowspan = merge.length+1;

            return merge;
        },

        /**
         * Retourne une collection de période basées sur le même jour que la date passée 
         * en paramètre
         * 
         * @param {Array} periodes Liste des periodes à analyser
         * @param {Date} date L'objet représentant le jour
         * 
         * @returns {Array}
         */
        getPeriodesFromDate(periodes, date) {
            return periodes.filter(e => e.period_year == date.getFullYear() && e.period_month == (date.getMonth()+1) && e.period_day == date.getDate());
        }
    }
}
</script>

