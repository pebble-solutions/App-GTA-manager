<template>
    <tbody class="table-group-divider">
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

        <tr v-if="personnel">
            <td v-if="summary.length == 0">
                <PersonnelBadge :personnel="personnel" :rowspan="rowspan"> </PersonnelBadge>
            </td>

            <td v-else></td>

            <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                <template v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)" :key="'periode-'+periode.id">
                    <template v-if="periode.structure_temps_declarations.length > 0">
                        <PointageCard 
                            :periode="periode"
                            :pointage="std" 
                            :gta_codages="gta_codages"
                            
                            v-for="std in periode.structure_temps_declarations" 
                            :key="'declaration-'+periode.id+'-'+std.id"></PointageCard>
                    </template>

                    <template v-else-if="periode.gta_declarations.length > 0 && periode.structure_temps_declarations.length == 0">
                        <GtaDeclarationsList 
                            :gta_declarations="periode.gta_declarations" 
                            :gta_codages="gta_codages" 
                            :periode="periode" 
                            :anomaly="true" 
                            :card="true"></GtaDeclarationsList>
                    </template>

                    <template v-else>
                        <div class="card border border-2">
                            <div class="card-body text-center">
                                Periode Vide

                                <button class="btn btn-danger">
                                    <i class="bi bi-trash"></i>
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    </template>
                </template>
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
import PointageCard from '@/components/PointageCard.vue';
import GtaDeclarationsList from '@/components/GtaDeclarationsList.vue';
import PersonnelBadge from './PersonnelBadge.vue';


export default {
    props: {
        personnel: Object,
        weekDays: Array,
        gta_codages: Object,
        semaine: Object
    },

    data() {
        return {
            rowspan: null,
        }
    },

    computed: {
        summary() {
            return this.getSummary();
        }
    },

    components: {
        Summary,
        PointageCard,
        GtaDeclarationsList,
        PersonnelBadge
    },

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

