<template>
    <div class="card border border-2 mb-2 fs-7" :class="{'border border-info border-2 shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click.prevent="selectedAction()">
        <div class="card-body text-center d-flex justify-content-between align-items-center" v-if="displayMoreInfosTiming">
            <div class="text-secondary">
                <i class="bi bi-square" v-if="!selected"></i>
                <i class="bi bi-check2-square square-color" v-else></i>
            </div>  
            
            <div>
                <router-link :to="{name: 'EditPointage', params: {idStd: pointage.id}}" custom v-slot="{navigate, href}" v-if="pointage.valider !== 'OUI'">
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

            <!-- <div class="mb-3">
                <div>Service en salle</div>
                <div>Projet Non-définie</div>
            </div> -->
        </div>
        
        <div class="text-center">
            <div class="alert alert-warning border-warning rounded-0 mb-0" :class="{'py-1': !displayMoreInfosTiming}">
                <div v-if="pointage.clock_status === 'over'" :class="{'d-flex justify-content-between align-items-center': !displayMoreInfosTiming && getGtaDeclarationsNotEmpty != 0}">
                    <div v-if="displayMoreInfosTiming">Durée de travail</div>
                    <div class="fs-5 fw-bold" :class="{'me-2': !displayMoreInfosTiming}">{{dureetravail}}</div>
                    <div v-if="getGtaDeclarationsNotEmpty.length > 0 && !displayMoreInfosTiming" class="badge bg-secondary">
                        {{getGtaDeclarationsNotEmpty.length}} Info<span v-if="getGtaDeclarationsNotEmpty.length > 1">s</span>
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
                        <div class="border-top border-bottom border-warning py-2 my-2" v-if="pointage.dpd && pointage.dpd !== '0000-00-00 00:00:00'">
                            <div>Pause</div>
                            <div class="fs-5 fw-bold">{{pause}}</div>
                            <div>
                                <span v-if="pointage.dpd_correction && pointage.dpd_correction != '0000-00-00 00:00:00'">
                                    {{new Date(pointage.dpd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else>
                                    {{new Date(pointage.dpd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>

                                <i class="bi bi-chevron-right"></i>

                                <span v-if="pointage.dfp_correction && pointage.dfp_correction != '0000-00-00 00:00:00'">
                                    {{new Date(pointage.dfp).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
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
                                    {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else>
                                    {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>

                                <i class="bi bi-chevron-right"></i>

                                <span v-if="pointage.df_correction && pointage.df_correction != '0000-00-00 00:00:00'">
                                    {{new Date(pointage.df).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                                <span v-else>
                                    {{new Date(pointage.df).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                </span>
                            </div>
                        </div>

                        <div class="border-top border-warning pt-2 mt-2">
                            <div>
                                <h3 class="fs-7 fw-bold">Justification</h3>

                                <div class="text-secondary text-center fst-italic">{{pointage.note}}</div>
                            </div>
                        </div>
                    </div>
                </transition>
            </div>

            <button type="button" class="btn btn-warning w-100 rounded-0 d-flex justify-content-between align-items-center" @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">                              
                <div>Détails</div>
                <i class="bi" :class="{'bi-caret-up-fill': displayMoreInfosTiming, 'bi-caret-down-fill': !displayMoreInfosTiming}"></i>                                 
            </button>
        </div>

        <GtaDeclarationsList v-if="displayMoreInfosTiming" :gta_declarations="gta_declarations" :gta_codages="gta_codages"></GtaDeclarationsList>
    </div>

</template>

<style lang="scss">
    .shadow-info {
        box-shadow: 0 0.5rem 1rem rgba(13, 202, 240, .15);
    }
    
    .square-color {
        color: rgba(13, 202, 240);
    }

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

export default {
    props: {
        pointage: Object,
        gta_codages: Object,
        gta_declarations: Object
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
         * Calcule l'amplitude entre la date de début et la date de fin 
         * 
         * @return {Number}
         */
        amplitude() {
            return this.calculateDiffDate(this.pointage.dd, this.pointage.df);
        },

        /**
         * Calcule la pause entre la date de début et la date de fin 
         * 
         * @return {Number}
         */
        pause() {
            return this.calculateDiffDate(this.pointage.dpd, this.pointage.dfp);
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

            return this.calculateDiffDate(this.amplitude, this.pause);
        },

        /**
         * Récupère la liste des GtaDéclaration qui on une valeur superieure a 0
         * 
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty = this.gta_declarations.filter((e) => e.qte > 0);
            return notEmpty
        },
    },

    methods: {
        /**
         * Récupere l'action defini (add ou remove) par levent et renvoi un Array au composant parent
         * avec en premier params, l'OBJECT pointage et en second l'action qui a été effectuée.
         */
        selectedAction() {
            this.selected = !this.selected;

            let options = [this.pointage];

            if(this.selected) {
                options.push('add');
            } else {
                options.push('remove');
            }

            this.$emit('select-pointage', options);
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

            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;

            return hours + ":" + minutes; 
        },
    }
}
</script>