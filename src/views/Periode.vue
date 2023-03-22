<template>
    <AppModal title="Modifier la période" :cancel-btn="true" :submit-btn="!gta_periode.valider" @modal-hide="routeToBack()" @submit="recordPeriode()" :pending="pending.periode">

        <validation-status @refresh="refreshData" :gta-periode="gta_periode" v-if="gta_periode.valider !== null"></validation-status>

        <div v-if="removedStd" class="alert alert-secondary">
            <i class="bi bi-trash"></i>
            Le pointage sera supprimé après l'enregistrement.
        </div>
        <div v-if="!gta_periode.gta_absence_id || stds.length">
            <div v-if="gta_periode.gta_absence_id" class="text-danger">
                <i class="bi bi-exclamation-triangle-fill"></i> Un pointage est enregistré sur 
                une période déclarée en absence. Cela semble être incohérent. Vérifiez les informations.
            </div>
            
            <div :class="{'pe-none' : gta_periode.valider !== null }">
                <StdForm :std="std" v-for="std in stds" :key="'std-'+std.id" @delete="deleteStd(std.id)" @upstd=" analyseStd($event)" @updated="importGtaPeriode()" /> 
            </div>

            <div class="d-grid">
                <button type="button" class="btn btn-sm btn-outline-primary" v-if="!stds.length && !gta_periode.valider" @click.prevent="addStd()"><i class="bi bi-plus-circle"></i> Ajouter un pointage</button>
            </div>
        </div>

        <div v-if="gta_periode.gta_absence_id" class="alert alert-info">
            <i class="bi bi-brightness-high"></i> Période d'absence déclarée.
        </div>

        <div :class="{'pe-none' : gta_periode.valider !== null}">
            <DeclarationForm 
                :gta_declarations="gta_declarations" 
                :gta_codages="gta_codages"
                :gta-periode="gta_periode"
                @add-declaration="addDeclaration" />

        </div>
    </AppModal>
</template>

<script>

import AppModal from '@/components/pebble-ui/AppModal.vue';

import date from 'date-and-time';
import StdForm from '../components/periode/StdForm.vue';
import DeclarationForm from '../components/periode/DeclarationForm.vue';
import { mapActions, mapState } from 'vuex';

import {padTime} from '../js/date';
import ValidationStatus from '../components/ValidationStatus.vue';

export default {
    props: {
        gta_codages: Array
    },  

    data() {
        return {
            pending: {
                periode: false,
            },
            gta_periode: {
                structure_temps_declarations: [],
                gta_declarations: []
            },
            removedStd: false,
            modifAdd: []
        }
    },

    computed: {

        ...mapState(["personnelsDeclarations"]),

        /**
         * Retourne l'ID de la période depuis l'URL
         * 
         * @return {number}
         */
        periodeId() {
            return parseInt(this.$route.params.idPeriode);
        },

        /**
         * Recupere une structure temps declaration a partir de l'id dans l'url
         * 
         * @return {array}
         */
        stds() {
            return this.gta_periode.structure_temps_declarations;
        },

        /**
         * Récupère la liste des Gta Declarations correspondant au pointage 
         * 
         * @return {array}
         */
        gta_declarations() {
            return this.gta_periode.gta_declarations;
        },

        /**
         * Retourne l'ID du personnel attaché à la période
         * 
         * @return {number}
         */
        personnelId() {
            return this.gta_periode.structure__personnel_id;
        },

        /**
         * Retourne la date du jour de la période au format YYYY-MM-DD
         * 
         * @return {string}
         */
        periodeDateSql() {
            return `${this.gta_periode.period_year}-${padTime(this.gta_periode.period_month)}-${padTime(this.gta_periode.period_day)}`;
        }

    },  

    components: { AppModal, StdForm, DeclarationForm, ValidationStatus },

    methods: {
        ...mapActions(['refreshPersonnelGtaPeriodes', 'refreshPersonnel']),
        
        /**
         * Permet de retourner a lurl avant louverture de la modal quand on vient fermer cette modal
         */
        routeToBack() {
            this.$router.push({name:'Validation'})
        },

        /**
         * Crée un prompt pour l'ajout de la justification de modification ou de création d'une période
         * 
         * @param {string} preRoute 
         * 
         * @return {string} Commentaire de justification
         */
        justificationModal(preRoute) {

            let message

            if  ( preRoute) {
                message = prompt("Vous avez créé une nouvelle periode. Apportez une justification :", "");
            } else {
                message = prompt("Vous avez modifié les informations suivantes : " + this.modifAdd.filter((x, i) => this.modifAdd.indexOf(x) === i).toString() +". Apportez une justification :", "");
            }

            if (message === "") {
                alert("Entrez un commentaire");
                this.justificationModal(preRoute)
            } else if (message !== null) {
                return message
            }
            
        },
        
        /**
         * Envoi a l'api les nouvelles données du pointage édité aprés avoir récupéré le commentaire de justification de l'utilisateur
         */
        recordPeriode() {

            let justification
        
            if (this.$router.options.history.state.back == '/week/'+ this.$route.params.id + '/insert') {
                justification = this.justificationModal("Insert")
            } else if (this.modifAdd.length) {
                justification = this.justificationModal()
            } else {
                confirm("Veuillez modifier un parametre avant d'enregistrer ou bien annuler.");
            }

            
            if (justification) {

                let urlApi = 'gtaPeriode/POST/' + this.periodeId;
                let query = {};
    
                this.gta_periode.structure_temps_declarations.forEach(std => {
                    std.dd_correction = date.format(std.dd_date, 'YYYY-MM-DD') + ' ' + padTime(std.dd_time.hours) + ':' + padTime(std.dd_time.minutes);
                    std.df_correction = date.format(std.df_date, 'YYYY-MM-DD') + ' ' + padTime(std.df_time.hours) + ':' + padTime(std.df_time.minutes);
                    std.dpd_correction = std.dpd_date ? date.format(std.dpd_date, 'YYYY-MM-DD') + ' ' + padTime(std.dpd_time.hours) + ':' + padTime(std.dpd_time.minutes) : null;
                    std.dfp_correction = std.dfp_date ? date.format(std.dfp_date, 'YYYY-MM-DD') + ' ' + padTime(std.dfp_time.hours) + ':' + padTime(std.dfp_time.minutes) : null;
                });
    
                query.structure_temps_declarations = JSON.stringify(this.gta_periode.structure_temps_declarations);
    
                if(this.gta_declarations) {
                    query.gta_declarations = JSON.stringify(this.gta_declarations);
                }

                query.motif = justification;
    
                this.pending.periode = true;
    
                this.$app.apiPost(urlApi, query)
                .then(() => {      
                    let urlApiCounters = "structureTempsDeclaration/GET/listDeclarations"
                    let startDate = this.getStartDateOfISOWeek(this.$route.params.id.substr(4,2), this.$route.params.id.substr(0,4));
    
                    return this.$app.apiGet(urlApiCounters, {
                        'dd': date.format(startDate, 'YYYY-MM-DD') ,
                        'df': date.format(date.addDays(startDate, +6), 'YYYY-MM-DD'),
                        'group_by_personnel': true,
                        'structure__personnel_id': this.personnelId,
                        'include_absence': true,
                    });
                })
                .then((dataByPersonnel) => {               
                    this.refreshPersonnel(dataByPersonnel.personnels);
                    this.$router.push('/week/'+ this.$route.params.id);
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.periode = false;
                });
            }

        },

        /**
         * Retourne la date de debut en fonction du numero de semaine et de l'année fournit
         * 
         * @param Integer   week        numero de semaine
         * @param Integer   year        numero de l'année
         */
        getStartDateOfISOWeek(week, year) {
            let simple = new Date(year, 0, 1+(week-1)*7);
            let dow = simple.getDay();
            let ISOweekStart = simple;
            
            if(dow <= 4) {
                ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            } else {
                ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            }

            return ISOweekStart;
        },
        
        /**
         * Retourne la GtaPeriode ouverte
         * 
         * @return {object}
         */
        getGtaPeriode() {
            let periode;

            this.personnelsDeclarations.forEach(personnel => {
                if (!periode) {
                    periode = personnel.gta_periodes.find(e => e.id == this.periodeId);
                }
            });

            return periode || {
                id: 0,
                structure_temps_declarations: [],
                gta_declarations: []
            };
        },

        /**
         * Ajoute un StructureTempsDeclaration à la période
         */
        addStd() {
            this.gta_periode.structure_temps_declarations.push({
                id: 0,
                structure__personnel_id: this.personnelId,
                dd: this.periodeDateSql+' 09:00:00',
                df: this.periodeDateSql+' 18:00:00',
                gta__periode_id: this.gta_periode.id
            });

            this.modifAdd.push(`Ajout d'un pointage`);
        },

        /**
         * Retire un pointage de la collection stds
         * 
         * @param {number} stdId        L'ID du std à retirer.
         */
        deleteStd(stdId) {
            let index = this.gta_periode.structure_temps_declarations.findIndex(e => e.id == stdId);

            if (index !== -1) {
                this.gta_periode.structure_temps_declarations.splice(index, 1);
                this.removedStd = true;
            }

            this.modifAdd.push(`Suppression d'un pointage`);
        },

        /**
         * Ajoute une GtaDéclaration à la liste.
         * 
         * @param {object} declaration GtaDeclaration à ajouter
         */
        addDeclaration(declaration) {
            this.gta_periode.gta_declarations.push(declaration);
            this.modifAdd.push(" Liste des déclarations ")
        },

        /**
         *  Analyse les nouvelles données STD pour ajouter les modification dans le tableau de modification
         */
        analyseStd(newValue) {
            this.modifAdd.push(' ' + newValue)
        },

        /**
         * Récupère et copie la GtaPeriode depuis le store
         */
        importGtaPeriode() {
            this.gta_periode = JSON.parse(JSON.stringify(this.getGtaPeriode()));
        },

        /**
         * Met à jour les données de la GtaPeriode
         * 
         * @param {object} data Les nouvelles données de la GtaPeriode
         */
        refreshData(data) {
            this.refreshPersonnelGtaPeriodes(data);
            this.importGtaPeriode();
        }
    },

    mounted() {
        this.importGtaPeriode();
    },
}
</script>