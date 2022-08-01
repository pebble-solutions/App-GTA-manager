<template>
    <div class="card border border-2 mb-2 fs-7" :class="{'border border-info border-2 shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click.prevent="selectedAction()">
        <div class="card-body text-center d-flex justify-content-between align-items-center" v-if="displayMoreInfosTiming">
            <div class="text-secondary" v-if="periode.valider !== 'OUI'">
                <i class="bi bi-square" v-if="!selected"></i>
                <i class="bi bi-check2-square square-color" v-else></i>
            </div>  
            
            <div class="ms-auto">
                <router-link :to="{name: 'EditPointage', params: {idStd: pointage.id}}" custom v-slot="{navigate, href}" v-if="periode.valider !== 'OUI'">
                    <a :href="href" @click.stop="navigate" class="text-primary text-decoration-none">
                        <i class="bi bi-pencil-square "></i>
                        Modifier
                    </a>
                </router-link>
                
                <div class="text-success" v-else>
                    <i class="bi bi-lock-fill"></i>
                    Validé
                </div>
            </div>
        </div>
        
        <div class="text-center">
            <div class="alert alert-success border-success rounded-0 mb-0" :class="{'py-1': !displayMoreInfosTiming}">
                <div v-if="pointage.clock_status === 'over'" :class="{'d-flex justify-content-between align-items-center': !displayMoreInfosTiming && getGtaDeclarationsNotEmpty != 0, 'd-flex justify-content-start align-items-center': getGtaDeclarationsNotEmpty == 0 && !displayMoreInfosTiming}">
                    <div class="text-secondary" :class="{'me-2' : getGtaDeclarationsNotEmpty == 0}" v-if="!displayMoreInfosTiming">
                        <i class="bi bi-square" v-if="!selected"></i>
                        <i class="bi bi-check2-square square-color" v-else></i>
                    </div>  
                    
                    <div v-if="displayMoreInfosTiming">Durée de travail</div>
                    <div class="fs-5 fw-bold">{{dureetravail}}</div>

                    <div v-if="getGtaDeclarationsNotEmpty.length > 0 && !displayMoreInfosTiming" class="badge bg-secondary">
                        {{getGtaDeclarationsNotEmpty.length}}
                    </div>
                </div>

                <div v-else>
                    <div>
                        début 
                        <span v-if="pointage.dd_correction && pointage.dd_correction != '0000-00-00 00:00:00'">
                            {{new Date(pointage.dd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                        </span>

                        <span v-else>
                            {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                        </span>
                    </div>
                    <div>En cours...</div>
                </div>

                <transition name="slide">
                    <div v-if="displayMoreInfosTiming">
                        <div class="border-top border-warning py-2 my-2" v-if="pause !== '00:00'">
                            <div>Pause</div>
                            <div class="fs-5 fw-bold">{{pause}}</div>
                            <div>
                                <span v-if="pointage.dpd_correction && pointage.dpd_correction !== '0000-00-00 00:00:00'">
                                    {{new Date(pointage.dpd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else-if="pointage.dpd_correction === '0000-00-00 00:00:00'">
                                    00:00
                                </span>
                                <span v-else>
                                    {{new Date(pointage.dpd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>

                                <i class="bi bi-chevron-right"></i>

                                <span v-if="pointage.dfp_correction && pointage.dfp_correction !== '0000-00-00 00:00:00'">
                                    {{new Date(pointage.dfp_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else-if="pointage.dfp_correction === '0000-00-00 00:00:00'">
                                    00:00
                                </span>
                                <span v-else>
                                    {{new Date(pointage.dfp).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                            </div>
                        </div>

                        <div class="border-top border-warning pt-2 mt-2" v-if="!pointage.dpd || pointage.dpd !== '0000-00-00 00:00:00'">
                            <div>Amplitude</div>
                            <div class="fs-5 fw-bold">{{amplitude}}</div>
                            <div>
                                <span v-if="pointage.dd_correction && pointage.dd_correction != '0000-00-00 00:00:00'">
                                    {{new Date(pointage.dd_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else>
                                    {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>

                                <i class="bi bi-chevron-right"></i>

                                <span v-if="pointage.df_correction && pointage.df_correction != '0000-00-00 00:00:00'">
                                    {{new Date(pointage.df_correction).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else>
                                    {{new Date(pointage.df).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                            </div>
                        </div>

                        <div class="border-top border-warning pt-2 mt-2" v-if="pointage.justification">
                            <div>
                                <h3 class="fs-7 fw-bold">Justification</h3>

                                <div class="text-secondary text-center fst-italic">{{pointage.justification}}</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

        </div>

        <GtaDeclarationsList v-if="displayMoreInfosTiming" :gta_declarations="gta_declarations" :gta_codages="gta_codages"></GtaDeclarationsList>

        <button type="button" class="btn btn-success w-100 rounded-0 d-flex justify-content-between align-items-center" @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">                              
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
import { mapActions } from 'vuex';

export default {
    props: {
        pointage: Object,
        gta_codages: Object,
        periode: Object
    },

    data() {
        return {
            displayMoreInfosTiming : false,
            selected: false,
            validate: false,
        }
    },

    components: {
        GtaDeclarationsList
    },

    computed: {
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
            return this.calculateDiffDate(dd, df);
        },

        /**
         * Calcule la pause entre la date de début et la date de fin 
         * 
         * @return {Number}
         */
        pause() {
            let dpd = this.pointage.dpd_correction ? this.pointage.dpd_correction : this.pointage.dpd;
            let dfp = this.pointage.dfp_correction ? this.pointage.dfp_correction : this.pointage.dfp;
            return this.calculateDiffDate(dpd, dfp);
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

            return this.calculateDiffDate(amplitude, pause);
        },

        /**
         * Récupère la liste des GtaDéclaration qui on une valeur superieure a 0
         * 
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty;

            if(this.gta_declarations) {
                notEmpty = this.gta_declarations.filter((e) => e.qte > 0);
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

        /**
         * Calcule une durée entre 2 date
         * @param {String} sd       
         * @param {String} sf 
         * 
         * @return {String}         format hours : minutes
         */
        calculateDiffDate(sd, sf) {
            let dd = new Date(sd);
            let df = new Date(sf);

            let diff = Math.abs(dd - df);

            let minutes = Math.floor((diff / (1000 * 60)) % 60),
                hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

            if(!minutes) {
                minutes = '0';
            }

            if(!hours) {
                hours = '0';
            }

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;

            return hours + ":" + minutes; 
        },
    }
}
</script>