<template>
    <div class="position-relative periode-card">
        <span class="selection-checkbox cursor-pointer border border-2" v-if="selectable" :class="checkboxClass" @click.prevent="toggleSelection()"><i class="bi bi-check"></i></span>
        <div class="card border-2 mb-2 shadow overflow-hidden" :class="cardClass">
    
            <PeriodeCardHeader :GtaPeriode="periode" @click.prevent="toggleSelection()" :selectable="selectable" :hasComment="periode?.notes?.length"></PeriodeCardHeader>

            <div class="card-body" v-if="showDetails"> 

                <AbsenceInfos :absence="periode.gta_absence" v-if="absenceExist"/>

                <div class="d-grid mb-2" v-if="editable"> 
                    <router-link :to="'/week/'+$route.params.id+'/periode/'+periode.id" v-slot="{href, navigate}" custom>
                        <a :href="href" @click="navigate" class="btn btn-sm btn-light">
                            <i class="bi bi-pencil-fill"></i> Modifier
                        </a>
                    </router-link>
                </div>
                <div v-else class="alert alert-secondary p-1" title="Lorsqu'une période est traitée, les informations qu'elle contient ne sont plus modifiables.">
                    <i class="bi bi-lock-fill"></i> Période traitée.
                </div>
                
                <StdItem v-for="std in periode.structure_temps_declarations" :key="'std-item-'+std.id" :StructureTempsDeclaration="std" ></StdItem>
                
                <NoteButton :periode="periode" />

                <div class="mt-3 mb-2">
                    <strong>Déclarations</strong>
                </div>

                <div class="list-group list-group-flush">
                    <GtaDeclarationItem v-for="declaration in periode.gta_declarations" :key="'declration-item-'+declaration.id" :GtaDeclaration="declaration" ></GtaDeclarationItem>
                </div>
            </div>
    
            <div class="d-grid">
                <button class="btn btn-sm btn-light bg-gradient rounded-0" type="button" @click.prevent="showDetails = !showDetails">
                    Détails
                    <i class="bi" :class="detailsIcon"></i>
                </button>
            </div>
        </div>
    </div>

</template>

<style lang="scss" scoped>
.selection-checkbox {
    border-radius: 50%;
    width:20px;
    height:20px;
    line-height: 20px;
    text-align: center;
    position:absolute;
    top:-5px;
    left:-5px;
    z-index:5;
}

.selection-checkbox > i {
    line-height: 20px;
    display:none;
}

.selection-checkbox.bg-primary > i,
.periode-card:hover .selection-checkbox > i {
    display:inline;
}

.periode-card {
    z-index:10;
}
</style>

<script>

import { mapActions, mapState } from 'vuex';
import {calculateDiffDate} from '@/js/date.js';
import StdItem from './StdItem.vue';
import GtaDeclarationItem from './GtaDeclarationItem.vue';
import PeriodeCardHeader from './PeriodeCardHeader.vue';
import NoteButton from '../comment/NoteButton.vue';
import AbsenceInfos from './AbsenceInfos.vue'

export default {
    props: {
        periode: Object,
        personnel: Object
    },

    emits: ['change'],

    data() {
        return {
            showDetails: false,
            validate: false,
            selected: false,
            hasComment: null,
            nbComm: null,
        };
    },

    watch: {
        /**
         * Contrôle l'état de sélection de la période. Si la période est sélectionnée, elle 
         * est ajouté dans le tableau periodes_selected dans le store.
         * 
         * @param {boolean} newVal Nouveau statut de sélection
         */
        selected(newVal) {
            if (newVal) {
                this.addPeriodeToSelection(this.periode);
            }
            else {
                this.removePeriodeFromSelection(this.periode);
            }
        }
    }, 

    computed: {
        ...mapState(["periodes_selected", "personnelsDeclarations"]),

        /**
         * Calcule l'amplitude entre la date de début et la date de fin
         *
         * @return {Number}
         */
        amplitude() {
            let dd = this.pointage.dd_correction && this.pointage.dd_correction !== "0000-00-00 00:00:00" ? this.pointage.dd_correction : this.pointage.dd;
            let df = this.pointage.df_correction && this.pointage.df_correction !== "0000-00-00 00:00:00" ? this.pointage.df_correction : this.pointage.df;
            return calculateDiffDate(dd, df);
        },

        /**
         * Récupère la liste des GtaDéclaration qui on une valeur superieure a 0
         *
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty;
            if (this.gta_declarations) {
                notEmpty = this.gta_declarations.filter((e) => e.correction === "OUI" && e.qte_retenue > 0 || e.correction === null && e.qte > 0 || e.correction === "NON" && e.qte > 0);
            }
            return notEmpty;
        },

        /**
         * Retourne l'icon du bouton d'affichage des détails.
         * Flèche basse pour ouvrir, flèche haute pour fermer.
         *
         * @return {string}
         */
        detailsIcon() {
            return this.showDetails ? "bi-caret-up-fill" : "bi-caret-down-fill";
        },

        /**
         * Retourne la classe CSS générale de la carte en fonction du statut de validation.
         * - success : validé
         * - danger : refusé
         * - vide : sans état
         * 
         * @return {string}
         */
        cardClass() {
            if (this.periode.valider === "OUI") return "border-success";
            else if (this.periode.valider === "NON") return "border-danger";
            else if (this.selected) return "border-primary";
            else return "border-light";
        },

        /**
         * Si la periode est sélectionnée, retourne une checkbox primary
         * 
         * @return {string}
         */
        checkboxClass() {
            return this.selected ? "border-primary bg-primary text-light" : "bg-light text-muted";
        },

        /**
         * Contrôle si la période peut être sélectionnée.
         * 
         * @return {boolean}
         */
        selectable() {
            let clock_status = this.periode.structure_temps_declarations?.find(std => std.clock_status === "open");
            return (this.periode.traiter !== "OUI" && !clock_status);
        },

        /**
         * Une période est modifiable si elle n'est pas validée et si elle n'est pas traitée.
         * 
         * @return {boolean}
         */
        editable() {
            return (this.periode.traiter !== "OUI");
        },

        /**
         * Retourne un 'booléen' si sur la période il y a une absence
         * 
         * @return {number} gta_absence_id
         */
        absenceExist() {
            return this.periode.gta_absence_id;
        }

    },
    
    methods: {
        ...mapActions(["addPeriodeToSelection", "removePeriodeFromSelection"]),
        
        /**
         * Récupere l'action defini (add ou remove) par levent et renvoi un Array au composant parent
         * avec en premier params, l'OBJECT pointage et en second l'action qui a été effectuée.
         */
        toggleSelection() {
            if (this.selectable) {
                this.selected = !this.selected;
            }
        },
        
    },
    
    components: { StdItem, GtaDeclarationItem, PeriodeCardHeader, NoteButton, AbsenceInfos },
    
    updated() {
        this.$emit('change');
    },
}
</script>