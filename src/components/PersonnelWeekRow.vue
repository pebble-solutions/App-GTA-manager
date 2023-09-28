<template>
    <tbody class="table-group-divider table-personnel">

        <tr v-if="personnel" class="table-secondary">
            <td colspan="9">
                <div class="d-flex justify-content-between align-items-center">
                    <PersonnelBadge :personnel="personnel"></PersonnelBadge>
                    <div>
                        <router-link :to="'/week/'+$route.params.id+'/export/personnel/'+personnel.id" v-slot="{href, navigate}" custom>
                            <a :href="href" @click="actionOnClick(navigate)" class="btn btn-light btn-sm me-1" type="button">
                                <i class="bi bi-cloud-download me-1" v-if="!pending.export"></i>
                                <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" v-else></span>
                                <span>Exporter</span>
                            </a> 
                        </router-link>

                        <router-link :to="'/week/'+$route.params.id+'/data/personnel/'+personnel.id" v-slot="{href, navigate}" custom>
                            <a :href="href" @click="navigate" class="btn btn-sm btn-light" title="Afficher la source des données">
                                <i class="bi bi-database"></i>
                            </a>
                        </router-link>
                    </div>
                </div>
            </td> 
        </tr>

        <template v-if="summary.length != 0">
            <SummaryPersonnel v-for="(resume, index) in summary" 
                :key="'resume-'+index"
                :id="index"
                :personnel="personnel"
                :resume="resume"
                :weekDays="weekDays"
                :gta_codages="gta_codages"
                :semaine="semaine"
                :rowspan="rowspan"
            ></SummaryPersonnel>
        </template>

        <tr v-if="personnel" class="personnel-periodes">

            <td class="col-day"></td>

            <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                <PeriodeCard 
                    v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)" 
                    :key="'periode-'+periode.id"
                    :periode="periode"
                    :personnel="personnel"
                    @change="$emit('change')" />
                
                <div class="d-grid gap-2">
                    <button class="btn btn-light shadow" type="button" @click.prevent="createPeriode(day)"><i class="bi bi-plus"></i> Ajouter</button>
                </div>
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

import SummaryPersonnel from '@/components/Summary.vue';
import PersonnelBadge from './PersonnelBadge.vue';
import { mapActions, mapState } from 'vuex';
import PeriodeCard from './periode/PeriodeCard.vue';
import { toSqlDate } from '../js/date';
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
            pending: {
                export: false
            }
        }
    },

    computed: {
        ...mapState(['gta_codages']),

        summary() {
            return this.getSummary();
        }
    },

    components: { SummaryPersonnel, PersonnelBadge, PeriodeCard},

    methods: {
        ...mapActions(['refreshPersonnelGtaPeriodes']), 

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
                                if(codage){
                                    declarations.push(codage.nom);
                                }
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
        },

        /**
         * Crée une nouvelle période sur la journée sélectionnée et reroute sur la configuration de la période
         * 
         * @param {Date} date
         */
        createPeriode(date) {
            this.$app.apiPost('structurePersonnel/POST/'+this.personnel.id+'/createGtaPeriode', {
                date: toSqlDate(date)
            }).then((periode) => {
                periode.structure_temps_declarations = [];
                periode.gta_declarations = [];
                this.refreshPersonnelGtaPeriodes([periode]);
                this.$router.push(`/week/${this.semaine.year}${this.semaine.week}/periode/${periode.id}`);
            }).catch(this.$app.catchError);
        },

        actionOnClick(navigate){
            return navigate
        }
    }
}
</script>

