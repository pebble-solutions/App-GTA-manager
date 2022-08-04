<template>
    <AppModal title="Modifier le pointage" :close-btn="true" :submit-btn="true" @modal-hide="routeToBack()" @submit="recordEditPointage()">
        <div>
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
                        <button class="btn btn-outline-primary btn-sm" v-if="!showBreak" @click="showBreak = true">
                            <i class="bi bi-plus-circle"></i>
                            Ajouter           
                        </button>
    
                        <button class="btn btn-outline-danger btn-sm" v-else @click="hideShowBreak()">
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

            <AlertMessage v-if="error.addInfos" variant="danger">Impossible d'ajouter la déclaration</AlertMessage>

            <div v-show="addInfos" class="py-2" >
                <div class="input-group" >
                    <select class="form-select" id="inputGroupSelect04" v-model="infosToAdd.gta__codage_id" aria-label="Example select with button addon">
                        <option class="text-truncate" v-for="gta_codage in gta_codages" :key="'gtacodage-'+gta_codage.id" :value="gta_codage.id">
                            {{gta_codage.nom}}
                        </option>
                    </select>

                    <input type="number" class="form-control" v-model="infosToAdd.qte_retenue">

                    <button type="button" class="btn btn-success" @click.prevent="actionAddInfos()">
                        <i class="bi bi-check"></i>
                    </button>
                </div>
            </div>

            <div v-for="declaration in tmpStd.gta_declarations" :key="declaration.id">
                <div class="border-dashed d-flex justify-content-between align-items-center my-2" v-if="declaration.correction === null && declaration.qte != 0.00 || declaration.correction === 'OUI' && declaration.qte_retenue != 0.00 && declaration.qte_retenue !== null || declaration.corretion === 'NON' && declaration.qte != 0.00">
                    <label for="qt-row-1 text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</label>

                    <div class="sizeBoxQte">
                        <div class="input-group input-group-sm ms-auto">
                            <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('remove', declaration)">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                            
                            <input type="text" class="form-control text-center" :value="declaration.qte_retenue ? declaration.qte_retenue : declaration.qte" id="qt-row-1" >
    
                            <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('add', declaration)">
                                <i class="bi bi-plus-lg"></i>
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
import '@vuepic/vue-datepicker/dist/main.css';
import date from 'date-and-time';
import AlertMessage from './pebble-ui/AlertMessage.vue';

export default {
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
                dpd_date: null,
                dpd_time: null,
                dfp_date: null,
                dfp_time: null,
                gta_declarations: []
            },
            showBreak: false,
            infosToAdd: {
                gta__codage_id: null,
                qte_retenue: null
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

            this.personnels_declarations.forEach(personnel => {
                personnel.gta_periodes.forEach(periode => {
                    periode.structure_temps_declarations.forEach(e => {
                        if(e.id == stdId) {
                            std = e;
                        }
                    });
                });
            });

            return std;
        },

        gta_declarations() {
            let stdId = this.$route.params.idStd;
            let gta_declarations;

            // this.personnels_declarations.forEach(personnel => {
            //     personnel.gta_periodes.foreach(periode => {
            //         periode.structure_temps_declarations.forEach(e => {
            //             if(e.id == stdId) {
            //                 gta_declarations = periode.gta_declarations;
            //             }
            //         });
            //     });
            // });

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
        Datepicker,
        AlertMessage
    },

    methods: {
        /**
         * Permet de retourner a lurl avant louverture de la modal quand on vient fermer cette modal
         */
        routeToBack() {
            this.$router.push({name:'Validation'})
        },

        /**
         * Montre ou cache la partie pour ajouter une pause
         * 
         * @return {Boolean}
         */
        haveBreak() {
            if(this.std.dpd && this.std.dpd !== '0000-00-00 00:00:00') {
                this.showBreak = true;

                return true
            }

            return false;
        },
        
        /**
         * Retourn le nom du gta codages spécifique a son id
         * @param {integer} id l'id du gta codages recherché
         * 
         * @return {String}
         */
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
                declaration.qte_retenue ? declaration.qte_retenue++ : declaration.qte++;
            } else {
                declaration.qte_retenue ? declaration.qte_retenue-- : declaration.qte--;
            }
        },

        /**
         * Ajout une nouvelle declaration a la list des déclarations
         * et reset l'object this.infosToAdd
         */
        actionAddInfos() {
            if(!this.infosToAdd.gta__codage_id || !this.infosToAdd.qte_retenue) {
                this.error.addInfos = true;
            } else {
                let key= Object.keys(this.tmpStd.gta_declarations).length;
                let copyobj = Object.assign({}, this.infosToAdd);

                copyobj['correction'] = 'OUI';
                copyobj['qte'] = copyobj['qte_retenue'];
                
                this.tmpStd.gta_declarations[key] = copyobj;
                
                this.infosToAdd.nom = null;
                this.infosToAdd.qte_retenue = null;
            }
        },

        /**
         * Envoi a l'api les nouvelles données du pointage édité
         * 
         */
        recordEditPointage() {
            let urlApi = 'gtaPeriode/POST/' + this.std.gta__periode_id;
            
            console.log('gta declarations', this.tmpStd.gta_declarations);

            this.$app.apiPost(urlApi, {
                'dd_correction': date.format(this.tmpStd.dd_date, 'YYYY-MM-DD') + ' ' + this.tmpStd.dd_time.hours + ':' + this.tmpStd.dd_time.minutes,
                'df_correction': date.format(this.tmpStd.df_date, 'YYYY-MM-DD') + ' ' + this.tmpStd.df_time.hours + ':' + this.tmpStd.df_time.minutes,
                'dpd_correction': this.tmpStd.dpd_date ? date.format(this.tmpStd.dpd_date, 'YYYY-MM-DD') + ' ' + (this.tmpStd.dpd_time.hours < 10 ? "0" : "") + this.tmpStd.dpd_time.hours + ':' + (this.tmpStd.dpd_time.minutes < 10 ? "0" : "") + this.tmpStd.dpd_time.minutes : null,
                'dfp_correction': this.tmpStd.dfp_date ? date.format(this.tmpStd.dfp_date, 'YYYY-MM-DD') + ' ' + (this.tmpStd.dfp_time.hours < 10 ? "0" : "") + this.tmpStd.dfp_time.hours + ':' + (this.tmpStd.dfp_time.minutes < 10 ? "0" : "") + this.tmpStd.dfp_time.minutes : null,
                'gta_declarations' : JSON.stringify(this.tmpStd.gta_declarations),
                'structure_temps_declaration': this.std.id
            }).then((data) => {
                console.log('data berfore', this.std);
                console.log('delcaration before', this.gta_declarations);
                
                console.log(this.personnels_declarations);
                console.log('data', data);
                console.log('test', data['structure_temps_declaration'])
                
                this.$emit('update-std', data['structure_temps_declaration']);
                this.$emit('update-gta_declarations', data['gta_declarations']);


                console.log('return api edit', data);
                this.$router.push('/week/'+ this.$route.params.id);
            }) .catch(this.$app.catchError);
        },

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

        /**
         * Retourne la bonne date à utiliser en fonction si il y a eu une correction ou pas.
         * @param string    dateNoCorrection    la date initial
         * @param string    dateCorrection      la date valide si il y a eu une correction
         * 
         * return void                          soit null soit une Date
         */
        checkIfCorrection(dateNoCorrection, dateCorrection) {
            let date;

            if(dateCorrection && dateCorrection !== "0000-00-00 00:00:00") {
                date = new Date(dateCorrection);
            } else {
                date = !dateNoCorrection || dateNoCorrection == "0000-00-00 00:00:00" ? null : new Date(dateNoCorrection);
            }

            return date;
        }
    },


    mounted() {
        if(this.std) {
            if(this.checkIfCorrection(this.std.dpd, this.std.dpd_correction)) {
                this.showBreak = true;
            }

            let dd = this.checkIfCorrection(this.std.dd, this.std.dd_correction);
            this.tmpStd.dd_date = ref(dd);
            this.tmpStd.dd_time = ref({
                hours : dd ? dd.getHours() : null,
                minutes : dd ? dd.getMinutes() : null
            });


            let df = this.checkIfCorrection(this.std.df, this.std.df_correction);
            this.tmpStd.df_date = ref(df);
            this.tmpStd.df_time = ref({
                hours: df ? df.getHours() : null,
                minutes: df ? df.getMinutes() : null
            });

            let dpd = this.checkIfCorrection(this.std.dpd, this.std.dpd_correction);
            this.tmpStd.dpd_date = ref(dpd);
            this.tmpStd.dpd_time = ref({
                hours: dpd ? dpd.getHours() : null,
                minutes: dpd ? dpd.getMinutes() : null
            });

            let dfp = this.checkIfCorrection(this.std.dfp, this.std.dfp_correction);
            this.tmpStd.dfp_date = ref(dfp);
            this.tmpStd.dfp_time = ref({
                hours: dfp ? dfp.getHours() : null,
                minutes: dfp ? dfp.getMinutes() : null
            });

            this.tmpStd.gta_declarations = JSON.parse(JSON.stringify(this.gta_declarations));
        }


    }
}
</script>