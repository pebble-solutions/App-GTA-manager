<template>
    <div class="border-bottom pb-3 mb-3">

        <div v-if="std.clock_status =='open'">
            <div class="alert alert-info text-center">
                <span>Ce pointage a débuté le {{formatedDd}} . <br>Vous ne pouvez pas modifier les informations sans clôturer. </span>
            </div>

            <button type="button" class="btn btn-warning col-12" @click.prevent="closeClock()" :disabled="pending.std">
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="pending.std"></span>
                <i class="bi bi-stopwatch" v-else></i>
                Cloturer manuellement
            </button>
        </div>

        <template v-else>
            <h4>Pointage</h4>
            <div class="mb-3">
                <label class="form-label">Date de début</label>
                <div class="d-flex align-items-content">
                    <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dd_date" readonly></Datepicker>
                    <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" format="HH:mm" v-model="tmpStd.dd_time" autoApply required>
                        <template #input-icon>
                            <i class="bi bi-clock px-2"></i>
                        </template>
                    </Datepicker>
                </div>
            </div>
    
            <div class="mb-3">
                <label class="form-label">Date de fin</label>
                <div class="d-flex align-items-content">
                    <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.df_date" :min-date="minDate" :max-date="maxDate" :startDate="minDate" :preventMinMaxNavigation="true" autoApply required></Datepicker>
                    <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" format="HH:mm" v-model="tmpStd.df_time" autoApply required>
                        <template #input-icon>
                            <i class="bi bi-clock px-2"></i>
                        </template>
                    </Datepicker>
                </div>
            </div>
    
            <div class="mt-4" v-if="showBreak">
                <div class="d-flex justify-content-between align-items-center">
                    <h5 class="text-secondary">Pause</h5>
                    
                    <div v-if="!tmpStd.valider">
                        <button class="btn btn-outline-danger btn-sm" type="button" @click="removeBreak()">
                            <i class="bi bi-trash"></i>
                            Supprimer
                        </button>
                    </div>
                </div>
    
                <div>
                    <div class="mb-3">
                        <label class="form-label">Date de début pause</label>
                        <div class="d-flex align-items-content">
                            <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dpd_date" :min-date="minDate" :max-date="maxDate" :startDate="minDate" :preventMinMaxNavigation="true" autoApply></Datepicker>
                            <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" format="HH:mm" v-model="tmpStd.dpd_time" autoApply>
                                <template #input-icon>
                                    <i class="bi bi-clock px-2"></i>
                                </template>
                            </Datepicker>
                        </div>
                    </div>
    
                    <div class="mb-3">
                        <label class="form-label">Date de fin de pause</label>
                        <div class="d-flex align-items-content">
                            <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dfp_date" :min-date="minDate" :max-date="maxDate" :startDate="minDate" :preventMinMaxNavigation="true" autoApply></Datepicker>
                            <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" format="HH:mm" v-model="tmpStd.dfp_time" autoApply>
                                <template #input-icon>
                                    <i class="bi bi-clock px-2"></i>
                                </template>
                            </Datepicker>
                        </div>
                    </div>
                </div>
            </div>
    
            <div class="d-grid" v-else-if="!showBreak && !tmpStd.valider">
                <button class="btn btn-light btn-sm" type="button" @click.prevent="showBreak = true">
                    <i class="bi bi-plus-circle"></i>
                    Ajouter une pause
                </button>
            </div>
    
            <div class="d-grid my-2"  v-if="!tmpStd.valider">
                <button class="btn btn-outline-danger btn-sm" type="button" @click.prevent="deleteStd()">
                    <i class="bi bi-trash"></i>
                    Supprimer le pointage
                </button>
            </div>
        </template>

    </div>

</template>

<script>

import { ref } from 'vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { mapActions } from 'vuex';

export default {
    props: {
        std: Object
    },

    data() {
        return {
            tmpStd: {},
            showBreak: false,
            minDate: null,
            maxDate: null,
            pending: {
                std: false
            },

            stdTemporaly : {}
        }
    },

    components: {Datepicker},

    emits: ['updated', 'upstd','delete'],

    watch: {
        /**
         * Si une nouvelle valeur STD est reçu, on met à jour les informations de date et heure
         * du formulaire.
         */
        std() {
            this.tmpStd = this.std;
            this.prepareDateTimeValues();
        },

        /**
         * Si une nouvelle valeur de tmpStd est reçu, on le compare a la première valeur de chargement de std: 
         *  - Si elle sont différentes, on envoie un emits à l'élément parent de la modification
         */
        tmpStd: {
            handler(newValue , oldValue) {
                if (!oldValue.id){
                    this.stdTemporaly = JSON.parse( JSON.stringify(newValue) );
                }

                if (newValue.dd_time.hours != this.stdTemporaly.dd_time.hours || newValue.dd_time.minutes != this.stdTemporaly.dd_time.minutes) {
                    this.$emit('upstd', "Dd")
                }
                if (newValue.df_time.hours != this.stdTemporaly.df_time.hours || newValue.df_time.minutes != this.stdTemporaly.df_time.minutes) {
                    this.$emit('upstd', "Df")
                }
                if (newValue.dpd_time.hours != this.stdTemporaly.dpd_time.hours || newValue.dpd_time.minutes != this.stdTemporaly.dpd_time.minutes) {
                    this.$emit('upstd', "Dpd")
                }
                if (newValue.dfp_time.hours != this.stdTemporaly.dfp_time.hours || newValue.dfp_time.minutes != this.stdTemporaly.dfp_time.minutes) {
                    this.$emit('upstd', "Dfp")
                }
            },
            deep: true
        } 
    },

    computed: {
        /**
         * Retourne la date de début du pointage au format fr-FR
         */
        formatedDd() {
            return this.formatDate(this.std.dd);
        }
    },

    methods: {
        ...mapActions(['refreshPersonnelStd']),

        /**
         * Cache le formulaire de pause et reset les valeurs du formulaire
         */
        removeBreak() {
            if (confirm("Souhaitez vous supprimer la pause ?")) {
                this.showBreak = false;
                
                this.tmpStd.dpd_date = null;
                this.tmpStd.dpd_time.hours = null;
                this.tmpStd.dpd_time.minutes = null;
    
                this.tmpStd.dfp_date = null;
                this.tmpStd.dfp_time.hours = null;
                this.tmpStd.dfp_time.minutes = null;
            }
        },

        /**
         * Retourne la bonne date à utiliser en fonction si il y a eu une correction ou pas.
         * 
         * @param string    dateNoCorrection    la date initial
         * @param string    dateCorrection      la date valide si il y a eu une correction
         * 
         * return void                          soit null soit une Date
         */
        getFinalDate(dateNoCorrection, dateCorrection) {
            let date;

            if(dateCorrection && dateCorrection !== "0000-00-00 00:00:00") {
                date = new Date(dateCorrection);
            } else {
                date = !dateNoCorrection || dateNoCorrection == "0000-00-00 00:00:00" ? null : new Date(dateNoCorrection);
            }

            return date;
        },
        
        /**
         * Prépare les valeurs de date pour le formulaire "datepicker"
         */
        prepareDateTimeValues() {
            if(this.getFinalDate(this.std.dpd, this.std.dpd_correction)) {
                this.showBreak = true;
            }

            let dates = ['dd', 'df', 'dpd', 'dfp'];

            dates.forEach(d => {
                let d_correction = d+'_correction';
                let d_date = d+'_date';
                let d_time = d+'_time';

                let d_final = this.getFinalDate(this.std[d], this.std[d_correction]);
                this.tmpStd[d_date] = ref(d_final);
                this.tmpStd[d_time] = ref({
                    hours : d_final ? d_final.getHours() : null,
                    minutes : d_final ? d_final.getMinutes() : null,
                });
            });

            let refDate = new Date(this.tmpStd.dd_date);

            this.minDate = ref(new Date(refDate));
            this.maxDate = ref(new Date(refDate.setDate(refDate.getDate() + 1)));
        },

        /**
         * Envoie d'un événement de suppression à l'élément parent.
         */
        deleteStd() {
            if (confirm("Supprimer le pointage ?")) {
                this.$emit('delete');
            }
        },

        /**
         * Transforme une date SQL en une date au format fr-FR
         * @param {string} d Date au format YYYY-MM-DDTHH:II:SS
         * @return {string}
         */
        formatDate(d) {
            if (d) {
                let date = new Date(d.replace(' ', 'T'));
                return date.toLocaleString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric'
                });
            }
            else {
                return null;
            }
        },

        /**
         * Lance un appel pour cloturer le compteur si celui-ci est encore ouvert (clock_status "open")
         */
        closeClock() {
            if(window.confirm('En clôturant ce pointage, vous prenez la main et le personnel ne pourra peut-être plus le modifier.')) {
                this.pending.std = true;
                this.$app.apiPost('structureTempsDeclaration/POST/'+this.std.id+'/doClock')
                .then(data => {
                    this.refreshPersonnelStd(data);
                    this.$emit("updated");
                })
                .catch(this.$app.catchError)
                .finally(() => {
                    this.pending.std = false;
                });
            }
        }
        
    },

    mounted() {
        this.tmpStd = this.std;
        this.prepareDateTimeValues();
    },
}
</script>