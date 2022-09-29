<template>
    <div>
        <div class="input-group mb-2">
            <label>Date de début</label>
            <div class="d-flex align-items-content">
                <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dd_date" readonly></Datepicker>
                <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.dd_time" autoApply required>
                    <template #input-icon>
                        <i class="bi bi-clock px-2"></i>
                    </template>
                </Datepicker>
            </div>
        </div>

        <div class="input-group">
            <label>Date de fin</label>
            <div class="d-flex align-items-content">
                <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.df_date" autoApply required></Datepicker>
                <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.df_time" autoApply required>
                    <template #input-icon>
                        <i class="bi bi-clock px-2"></i>
                    </template>
                </Datepicker>
            </div>
        </div>
    </div>

    <div class="mt-4">
        <hr>
        <div class="d-flex justify-content-between align-items-center">
            <h4>Pause</h4>
            
            <div>
                <button class="btn btn-outline-primary btn-sm" type="button" v-if="!showBreak" @click="showBreak = true">
                    <i class="bi bi-plus-circle"></i>
                    Ajouter           
                </button>

                <button class="btn btn-outline-danger btn-sm" type="button" v-else @click="hideShowBreak()">
                    <i class="bi bi-trash"></i>
                    Supprimer
                </button>
            </div>
        </div>

        <div v-if="showBreak">
            <div class="input-group mb-2">
                <label>Date de début pause</label>
                <div class="d-flex align-items-content">
                    <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dpd_date" autoApply></Datepicker>
                    <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" format="HH:mm" v-model="tmpStd.dpd_time" autoApply>
                        <template #input-icon>
                            <i class="bi bi-clock px-2"></i>
                        </template>
                    </Datepicker>
                </div>
            </div>

            <div class="input-group">
                <label>Date de fin de pause</label>
                <div class="d-flex align-items-content">
                    <Datepicker class="pe-2" :enableTimePicker="false" position="left" format="dd/MM/yyyy" v-model="tmpStd.dfp_date" autoApply></Datepicker>
                    <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.dfp_time" autoApply>
                        <template #input-icon>
                            <i class="bi bi-clock px-2"></i>
                        </template>
                    </Datepicker>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

export default {
    props: {
        std: Object
    },

    data() {
        return {
            tmpStd: {},
            showBreak: false
        }
    },

    components: {Datepicker},

    methods: {
        /**
         * Cache le formulaire de pause et reset les valeurs du formulaire
         */
        hideShowBreak() {
            this.showBreak = false;

            this.tmpStd.dpd_date = null;
            this.tmpStd.dpd_time.hours = null;
            this.tmpStd.dpd_time.minutes = null;

            this.tmpStd.dfp_date = null;
            this.tmpStd.dfp_time.hours = null;
            this.tmpStd.dfp_time.minutes = null;   
        },


    },

    mounted() {
        this.tmpStd = this.std;
    },
}
</script>