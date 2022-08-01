<template>
    <div :class="{'card border border-2 mb-2': card, 'border-danger': anomaly && !selected, 'border border-info border-2 shadow-info': selected}" v-if="getGtaDeclarationsNotEmpty.length > 0 || card" @click.prevent="selectedAction()">
        <div v-if="anomaly">


            <div class="alert alert-danger d-flex justify-content-between mb-0">
                <div class="text-secondary" >
                    <i class="bi bi-square" v-if="!selected"></i>
                    <i class="bi bi-check2-square square-color" v-else></i>
                </div>
                
                Sans durée             
            </div>
        </div>

        <div class="card-body" :class="{'py-1 pt-2': card}">

            <div class="fw-bold cursor-pointer" @click.stop="displayMoreInfosReport = !displayMoreInfosReport" >
                <div class="d-flex justify-content-between align-items-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold text-truncate me-2" :class="{'mb-0': card}" :title="getGtaDeclarationsNotEmpty.length + ' Déclarations'">
                        {{getGtaDeclarationsNotEmpty.length}} Déclarations
                    </h3>
    
                    <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosReport, 'bi-chevron-double-down': !displayMoreInfosReport}" v-if="getGtaDeclarationsNotEmpty.length > 0"></i>  
                </div>
            </div>
    
            <transition name="slide">
                <ul class="px-0" v-if="displayMoreInfosReport && getGtaDeclarationsNotEmpty.length > 0">
                    <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2" v-for="declaration in getGtaDeclarationsNotEmpty" :key="'declaration-'+declaration.id">
                            <span class="text-start text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</span>
                            <span>{{declaration.qte}}</span>
                    </li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    props: {
        gta_declarations: Object,
        gta_codages: Object,
        periode: Object,
        card: {
            type: Boolean,
            default: false
        },
        anomaly: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            displayMoreInfosReport: false,
            selected: false,
        };
    },
    computed: {
        /**
         * Filtre gta_declarations pour n'avoir que ce avec un qte superieur a 0
         *
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty = this.gta_declarations.filter((e) => e.qte > 0);
            return notEmpty;
        },
    },
    methods: {
        ...mapActions(["addPointage", "removePointage"]),

        /**
         * Récupère le gta_codages voulu et renvoi le nom
         *
         * @param {Number} id
         *
         * @return {String}
         */
        getCodageNom(id) {
            let gtaCodage = this.gta_codages.find((e) => e.id === id);
            return gtaCodage.nom;
        },

                /**
         * Récupere l'action defini (add ou remove) par levent et renvoi un Array au composant parent
         * avec en premier params, l'OBJECT pointage et en second l'action qui a été effectuée.
         */
        selectedAction() {
            if(this.periode.valider === 'OUI') {
                return;
            } 
            
            this.selected = !this.selected;

            if(this.selected) {
                this.addPointage(this.periode);
            } else {
                this.removePointage(this.periode)
            }
        },


    },
}
</script>