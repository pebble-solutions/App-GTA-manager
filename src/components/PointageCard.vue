<template>
    <div class="card border border-2 mb-2 fs-7" :class="{'border border-info border-2 shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click.prevent="selectedAction()">
        <PointageCardHeader :selected="selected" 
                            :periode="periode" 
                            :pointage="pointage" 
                            :displayMoreInfosTiming="displayMoreInfosTiming" 
                            :getGtaDeclarationsNotEmpty="getGtaDeclarationsNotEmpty" 
                            :dureetravail="dureetravail"
                            :personnel="personnel"/>

        <transition name="slide">
            <PointageCardDetail v-if="displayMoreInfosTiming" 
                                
                                :periode="periode" 
                                :pointage="pointage" 
                                :dureetravail="dureetravail" 
                                :pause="pause"
                                :personnel="personnel"/>
        </transition>

        <GtaDeclarationsList    v-if="displayMoreInfosTiming" 
                                
                                :periode="periode" 
                                :gta_declarations="gta_declarations" 
                                :gta_codages="gta_codages">
        </GtaDeclarationsList>

        <button type="button" 
                
                class="btn w-100 rounded-0 d-flex justify-content-between align-items-center" 
                :class="{'btn-secondary bg-gradient' : periode.valider !== 'OUI' && periode.valider !== 'NON', 'btn-success bg-gradient': periode.valider === 'OUI', 'btn-danger bg-gradient': periode.valider === 'NON'}" 
                
                @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">                              
            <div>Détails</div>
            <i class="bi" :class="{'bi-caret-up-fill': displayMoreInfosTiming, 'bi-caret-down-fill': !displayMoreInfosTiming}"></i>                                 
        </button>
    </div>

</template>

<style lang="scss">
    .slide-enter-active, 
    .slide-leave-active {
        transition: max-height 0.5s ease-in-out;
    }

    .slide-enter-to,
    .slide-leave-from {
        max-height: 200px;
        overflow: hidden;
    }

    .slide-enter-from,
    .slide-leave-to {
        overflow: hidden;
        max-height: 0px;
    }
</style>

<script>

import GtaDeclarationsList from '@/components/GtaDeclarationsList.vue';
import { mapActions, mapState } from 'vuex';
import PointageCardHeader from './PointageCardHeader.vue';
import PointageCardDetail from './PointageCardDetail.vue';
import {calculateDiffDate} from '@/js/date.js';

export default {
    props: {
        pointage: Object,
        gta_codages: Object,
        periode: Object,
        personnel: Object
    },

    data() {
        return {
            displayMoreInfosTiming : false,
            validate: false,
        }
    },

    components: { GtaDeclarationsList, PointageCardHeader, PointageCardDetail },

    computed: {
        ...mapState(["pointageSelected"]),

        /**
         * le pointage passe en selected si il se trouve dans le tableau pointageSelected
         * du store
         */
        selected() { 
            let found = this.pointageSelected.find(e => e.id == this.periode.id);
            return found ? true : false;
        },

        /**
         * Retourne les gta_declarations
         * @return {Object}
         */
        gta_declarations() {
            return this.periode.gta_declarations;
        },

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
         * Calcule la durée de travail entre la date de début et la date de fin 
         * 
         * @return {Number}
         */
        dureetravail() {
            if(!this.pause || this.pause === "00:00") {
                return this.amplitude;
            }

            let amplitudeArray = this.amplitude.split(':');
            let amplitude = new Date();
            amplitude.setHours(amplitudeArray[0]);
            amplitude.setMinutes(amplitudeArray[1]);

            let pauseArray = this.pause.split(':');
            let pause = new Date();
            pause.setHours(pauseArray[0]);
            pause.setMinutes(pauseArray[1]);

            return calculateDiffDate(amplitude, pause);
        },

        /**
         * Calcule la pause entre la date de début et la date de fin 
         * 
         * @return {Number}
         */
        pause() {
            let dpd = this.pointage.dpd_correction ? this.pointage.dpd_correction : this.pointage.dpd;
            let dfp = this.pointage.dfp_correction ? this.pointage.dfp_correction : this.pointage.dfp;
            return calculateDiffDate(dpd, dfp);
        },

        /**
         * Récupère la liste des GtaDéclaration qui on une valeur superieure a 0
         * 
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty;

            if(this.gta_declarations) {
                notEmpty = this.gta_declarations.filter((e) => e.correction === "OUI" && e.qte_retenue > 0 || e.correction === null && e.qte > 0 || e.correction === "NON" && e.qte > 0);
            }

            return notEmpty
        },
    },

    methods: {
        ...mapActions(["addPointage", "removePointage"]),
        
        /**
         * Récupere l'action defini (add ou remove) par levent et renvoi un Array au composant parent
         * avec en premier params, l'OBJECT pointage et en second l'action qui a été effectuée.
         */
        selectedAction() {
            if(this.periode.valider === 'OUI' || this.periode.valider === 'NON' || this.pointage.clock_status === "open") {
                return;
            }

            if(!this.selected) {
                this.addPointage(this.periode);
            } else {
                this.removePointage(this.periode)
            }
        },
    }
}
</script>