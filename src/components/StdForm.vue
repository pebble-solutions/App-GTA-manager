<template>
    <div class="border-bottom pb-3 mb-3">
        <h4>Pointage</h4>
        <div class="mb-3">
            <label class="form-label">Date de début</label>
            <div class="d-flex align-items-content">
                <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dd_date" readonly></Datepicker>
                <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.dd_time" autoApply required>
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
                <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.df_time" autoApply required>
                    <template #input-icon>
                        <i class="bi bi-clock px-2"></i>
                    </template>
                </Datepicker>
            </div>
        </div>

        <div class="mt-4" v-if="showBreak">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="text-secondary">Pause</h5>
                
                <div>

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
                        <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.dfp_time" autoApply>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>
            </div>
        </div>

        <div class="d-grid" v-else>
            <button class="btn btn-light btn-sm" type="button" @click.prevent="showBreak = true">
                <i class="bi bi-plus-circle"></i>
                Ajouter une pause
            </button>
        </div>

        <div class="d-grid my-2">
            <button class="btn btn-outline-danger btn-sm" type="button" @click.prevent="deleteStd()">
                <i class="bi bi-trash"></i>
                Supprimer le pointage
            </button>
        </div>

    </div>

</template>

<script>

import { ref } from 'vue';

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    props: {
        std: Object
    },

    data() {
        return {
            tmpStd: {},
            showBreak: false,
            minDate: null,
            maxDate: null
        }
    },

    components: {Datepicker},

    methods: {
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
                    minutes : d_final ? d_final.getMinutes() : null
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
                this.$emit("delete");
            }
        }

    },

    mounted() {
        this.tmpStd = this.std;
        this.prepareDateTimeValues();
    },
}
</script>