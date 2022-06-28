<template>
    <div class="card border border-2 mb-2 fs-7" :class="{'border border-info border-2 shadow-info': selected, 'border border-success': validate, 'shadow': !selected}" @click.prevent="selectedAction()">
        <div class="card-body text-center d-flex justify-content-between align-items-center">
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
            <div class="alert alert-warning border-warning rounded-0 mb-0">
                <div v-if="pointage.clock_status === 'over'">
                    <div>Durée de travail</div>
                    <div class="fs-5 fw-bold">{{dureetravail}}</div>
                    <div class="fs-8 fst-italic lh-sm" style="">La durée journalière standard est dépassée</div>
                </div>

                <div v-else>
                    <div>début {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}</div>
                    <div>En cours...</div>
                </div>

                <transition name="slide">
                    <div v-if="displayMoreInfosTiming">
                        <div class="border-top border-bottom border-warning py-2 my-2" v-if="pointage.dpd && pointage.dpd !== '0000-00-00 00:00:00'">
                            <div>Pause</div>
                            <div class="fs-5 fw-bold">{{pause}}</div>
                            <div>
                                {{new Date(pointage.dpd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                <i class="bi bi-chevron-right"></i>
                                {{new Date(pointage.dfp).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                            </div>
                        </div>

                        <div :class="{'border-top border-warning pt-2 mt-2': !pointage.dpd || pointage.dpd !== '0000-00-00 00:00:00'}">
                            <div>Amplitude</div>
                            <div class="fs-5 fw-bold">{{amplitude}}</div>
                            <div>
                                {{new Date(pointage.dd).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                                <i class="bi bi-chevron-right"></i>
                                {{new Date(pointage.df).toLocaleTimeString('fr-FR', {hour:'numeric', minute:'2-digit'})}}
                            </div>
                            <div class="fs-8 fst-italic lh-sm">L'Amplitude journalière maximum est dépassée</div>
                        </div>
                    </div>
                </transition>
            </div>

            <button type="button" class="btn btn-warning w-100 rounded-0 d-flex justify-content-between align-items-center" @click.stop="displayMoreInfosTiming = !displayMoreInfosTiming">
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
                <div>détails</div>                                  
                <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosTiming, 'bi-chevron-double-down': !displayMoreInfosTiming}"></i>                                     
            </button>
        </div>

        <div class="card-body">
            <div class="mb-2">
                <div class="text-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">Justification</h3>

                    <div class="text-secondary text-center fst-italic">Une justification a donner</div>
                </div>
            </div>

            <div class="fw-bold cursor-pointer" @click.stop="displayMoreInfosReport = !displayMoreInfosReport" v-if="getGtaDeclarationsNotEmpty.length > 0">
                <div class="d-flex justify-content-between align-items-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold">
                        {{getGtaDeclarationsNotEmpty.length}} infos
                    </h3>

                    <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosReport, 'bi-chevron-double-down': !displayMoreInfosReport}"></i>  
                </div>
            </div>

            <transition name="slide">
                    <ul class="px-0" v-if="displayMoreInfosReport">
                        <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2" v-for="declaration in getGtaDeclarationsNotEmpty" :key="'declaration-'+declaration.id">
                                <span class="text-start text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</span>
                                <span>{{declaration.qte}}</span>
                        </li>
                    </ul>
            </transition>
        </div>
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


export default {
    props: {
        pointage: Object,
        gta_codages: Object,
        gta_declarations: Object
    },

    data() {
        return {
            displayMoreInfosTiming : false,
            displayMoreInfosReport : false,
            selected: false,
            validate: false,
            gta_declarationsNotEmpty: []
        }
    },

    computed: {
        /**
         * Calcule l'amplitude entre la date de début et la date de fin 
         */
        amplitude() {
            return this.calculateDiffDate(this.pointage.dd, this.pointage.df);
        },

        /**
         * Calcule la pause entre la date de début et la date de fin 
         */
        pause() {
            return this.calculateDiffDate(this.pointage.dpd, this.pointage.dfp);
        },


        /**
         * Calcule la durée de travail entre la date de début et la date de fin 
         */
        dureetravail() {
            if(!this.pause || this.pause === "00:00") {
                return this.amplitude;
            }

            return this.calculateDiffDate(this.amplitude, this.pause);
        },


        getGtaDeclarationsNotEmpty() {
            let notEmpty = this.gta_declarations.filter((e) => e.qte > 0);
            return notEmpty
        },
    },

    methods: {
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



        getCodageNom(id) {
            let gtaCodage = this.gta_codages.find((e) => e.id === id);

            return gtaCodage.nom;
        }
    },

    mounted() {
        // console.log('********************************************************************');
        //console.log(this.pointage);
        // console.log('--------------');
        // console.log(this.gta_codages);
        // console.log('--------------');
        // console.log(this.gta_declarations);
    }
}
</script>