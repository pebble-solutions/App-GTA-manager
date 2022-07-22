<template>
    <AppModal title="Modifier le pointage" :close-btn="true" :submit-btn="true" @modal-hide="routeToBack()">
        <div>
            <!-- <div>
                <div class="input-group">
                    <label>Misson :</label>
                    <select>
                        <option>Mission1</option>
                        <option>Mission2</option>
                        <option>Mission3</option>
                        <option>Mission4</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Projet :</label>
                    <select>
                        <option>Projet1</option>
                        <option>Projet2</option>
                        <option>Projet3</option>
                        <option>Projet4</option>
                    </select>
                </div>
            </div> -->

            <div>
                <div class="input-group mb-2">
                    <label>Date de début</label>
                    <div class="d-flex align-items-content">
                        <Datepicker class="pe-2" :enableTimePicker="false" position="left" :format="format" v-model="tmpStd.dd_date" readonly></Datepicker>
                        <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.dd_time" required>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>

                <div class="input-group">
                    <label>Date de fin</label>
                    <div class="d-flex align-items-content">
                        <Datepicker class="pe-2" :enableTimePicker="false" position="left" :format="format" v-model="tmpStd.df_date" required></Datepicker>
                        <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" v-model="tmpStd.df_time" required>
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
                        <button class="btn btn-outline-primary btn-sm" v-if="!showBreak" @click="showBreak = true">
                            <i class="bi bi-plus-circle"></i>
                            Ajouter           
                        </button>
    
                        <button class="btn btn-outline-danger btn-sm" v-else @click="showBreak = false">
                            <i class="bi bi-trash"></i>
                            Supprimer
                        </button>
                    </div>
                </div>

                <div class="py-2 d-flex justify-content-between align-items-center" v-if="showBreak">
                    <div class="input-group justify-content-between align-items-center pe-2">
                        <label>Début de pause :</label>
                        <Datepicker :enableTimePicker="false" position="right" :format="format" required></Datepicker>
                    </div>

                    <div class="input-group justify-content-between align-items-center ps-2">
                        <label>Durée :</label>
                        <Datepicker timePicker modeHeight="120" postion="right" required>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>
            </div>

            <hr>
            <div class="mt-2 d-flex justify-content-between align-items-center">
                <h4>Infos déclarées</h4>

                <button v-if="!addInfos" type="button" class="btn btn-outline-primary btn-sm" @click="addInfos = !addInfos">
                    <i class="bi bi-plus-circle"></i>
                    Ajouter
                </button>

                <button v-else type="button" class="btn btn-outline-secondary btn-sm" @click="addInfos = !addInfos">
                    <i class="bi bi-x-circle"></i>
                    Annuler
                </button>
            </div>

            <div v-if="error.addInfos">ERROR ADD INFOS</div>
            <div v-show="addInfos" class="py-2" >
                <div class="input-group" >
                    <select class="form-select" id="inputGroupSelect04" v-model="infosToAdd.gta__codage_id" aria-label="Example select with button addon">
                        <option class="text-truncate" v-for="gta_codage in gta_codages" :key="'gtacodage-'+gta_codage.id" :value="gta_codage.id">
                            {{gta_codage.nom}}
                        </option>
                    </select>

                    <input type="number" class="form-control" v-model="infosToAdd.qte">

                    <button type="button" class="btn btn-success" @click.prevent="actionAddInfos()">
                        <i class="bi bi-check"></i>
                    </button>

                    <!-- AFFICHE LE BOUTON QUE SIL Y  A PLUS DE 1 ELEMENT DANS LE TABLEAU-->
                    <!-- <button type="button" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                    </button> -->
                </div>
            </div>

            <div v-for="declaration in tmpStd.gta_declarations" :key="declaration.id">
                <div class="border-dashed d-flex justify-content-between align-items-center my-2" v-if="declaration.qte != 0.00">
                    <label for="qt-row-1 text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</label>

                    <div class="sizeBoxQte">
                        <div class="input-group input-group-sm ms-auto">
                            <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('add', declaration)">
                                <i class="bi bi-plus-lg"></i>
                            </button>

                            <input type="text" class="form-control text-center" :value="declaration.qte" id="qt-row-1" >
    
                            <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('remove', declaration)">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<style lang="scss">
    .infosValue {
        width:50px;
    }

    .sizeBoxQte {
        width: 120px;
    }
</style>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue'

import { ref } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    setup() {
        const format = (date) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;

            if(month.toString.length < 2) {
                month = '0' + month;
            }

            let year = date.getFullYear();

            return `${day}/${month}/${year}`;
        }

        return {
            format
        }
    },

    props: {
        personnels_declarations : Array,
        gta_codages: Array
    },  

    data() {
        return {
            addInfos: false,
            tmpStd: {
                dd_date: null,
                dd_time: null,
                df_date: null,
                df_time: null,
                gta_declarations: []
            },
            showBreak: false,
            infosToAdd: {
                gta__codages_id: null,
                qte: null
            },
            error: {
                addInfos : null,
            }
        }
    },

    computed: {
        std() {
            let stdId = this.$route.params.idStd;
            let std;
            this.personnels_declarations.find((pd) => {
                pd.gta_periodes.find((gtap) => {
                    gtap.structure_temps_declarations.find((s) => {
                        if(s.id == stdId) {
                            std = s
                            return std;
                        }
                    });
                })
            });

            return std;
        },

        gta_declarations() {
            let stdId = this.$route.params.idStd;
            let gta_declarations;

            this.personnels_declarations.find((pd) => {
                pd.gta_periodes.find((gtap) => {
                    gtap.structure_temps_declarations.find((s) => {
                        if(s.id == stdId) {
                            gta_declarations = gtap.gta_declarations;
                            return gta_declarations;
                        }
                    });
                })
            });

            return gta_declarations;
        }

    },  

    components: {
        AppModal,
        Datepicker
    },

    methods: {
        routeToBack() {
            this.$router.push({name:'Validation'})
        },

        haveBreak() {
            if(this.std.dpd && this.std.dpd !== '0000-00-00 00:00:00') {
                this.showBreak = true;

                return true
            }

            return false;
        },

        getCodageNom(id) {
            let gtaCodage = this.gta_codages.find((e) => e.id === id);

            return gtaCodage.nom;
        },

        /**
         * Update the qte result of the declaration,
         * - add        ajout +1
         * - remove     remove -1
         * @param {Object} declaration 
         */
        updateQte(action, declaration) {
            if(action === "add") {
                declaration.qte++;
            } else {
                declaration.qte--;
            }
        },

        actionAddInfos() {
            if(!this.infosToAdd.gta__codage_id || !this.infosToAdd.qte) {
                this.error.addInfos = true;
            } else {
                let key= Object.keys(this.tmpStd.gta_declarations).length;
                let copyobj = Object.assign({}, this.infosToAdd);
                
                /**try to put it in float */
                copyobj.qte.toFixed(2);
                copyobj['qte'].toFixed(2);

                this.tmpStd.gta_declarations[key] = copyobj;
                
                this.infosToAdd.nom = null;
                this.infosToAdd.qte = null;
            }
        }
    },

    mounted() {
        if(this.std) {
            let dd = new Date(this.std.dd);
            this.tmpStd.dd_date = ref(dd);
            this.tmpStd.dd_time = ref({
                hours : dd.getHours(),
                minutes : dd.getMinutes()
            });

            let df = new Date(this.std.df);
            this.tmpStd.df_date = ref(df);
            this.tmpStd.df_time = ref({
                hours: df.getHours(),
                minutes: df.getMinutes()
            });
            
            this.tmpStd.gta_declarations = Object.assign({}, this.gta_declarations);
        }


    }
}
</script>