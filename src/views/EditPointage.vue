<template>
    <AppModal title="Modifier le pointage" :close-btn="true" :submit-btn="true" @modal-hide="routeToBack()" @submit="recordEditPointage()">
        <div v-if="std">
            <StdForm :std="tmpStd" />
        </div>

        <div v-if="tmpStd.gta_declarations.length > 0">
            <DeclarationForm :gta_declarations="tmpStd.gta_declarations" :gta_codages="gta_codages" />
        </div>
    </AppModal>
</template>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue'
import { ref } from 'vue';

import date from 'date-and-time';
import StdForm from '@/components/StdForm.vue';
import DeclarationForm from '../components/DeclarationForm.vue';
import { mapActions, mapState } from 'vuex';

export default {
    props: {
        gta_codages: Array
    },  

    data() {
        return {
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
            }
        }
    },

    computed: {

        ...mapState(["personnelsDeclarations"]),

        /**
         * Recupere une structure temps declaration a partir de l'id dans l'url
         */
        std() {
            let periodeId = this.$route.params.idPeriode;
            let std;

            this.personnelsDeclarations.forEach(personnel => {
                personnel.gta_periodes.forEach(periode => {
                    if(periode.id == periodeId) {
                        std = periode.structure_temps_declarations[0];
                    }
                    // periode.structure_temps_declarations.forEach(e => {
                    //     if(e.id == stdId) {
                    //         std = e;
                    //     }
                    // });
                });
            });

            return std;
        },

        /**
         * Récupère la liste des Gta Declarations correspondant au pointage 
         */
        gta_declarations() {
            let periodeId = this.$route.params.idPeriode;
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

            this.personnelsDeclarations.find((personnel) => {
                personnel.gta_periodes.find((periode) => {
                    // gtap.structure_temps_declarations.find((s) => {
                    //     if(s.id == stdId) {
                    //         gta_declarations = gtap.gta_declarations;
                    //         return gta_declarations;
                    //     }
                    // });

                    if(periode.id == periodeId) {
                        gta_declarations = periode.gta_declarations;
                    }
                })
            });

            return gta_declarations;
        },

        personnelId() {
            let periodeId = this.$route.params.idPeriode;
            let id;

            this.personnelsDeclarations.forEach(personnel => {
                personnel.gta_periodes.forEach(periode => {
                    // periode.structure_temps_declarations.forEach(e => {
                    //     if(e.id == stdId) {
                    //         id = personnel.id;
                    //     }
                    // });
                    if(periode.id == periodeId) {
                        id = personnel.id;
                    }
                });
            });

            return id;
        }

    },  

    components: { AppModal, StdForm, DeclarationForm },

    methods: {
        ...mapActions(['refreshPersonnelGtaPeriodes', 'refreshPersonnel']),
        
        /**
         * Permet de retourner a lurl avant louverture de la modal quand on vient fermer cette modal
         */
        routeToBack() {
            this.$router.push({name:'Validation'})
        },

        /**
         * Envoi a l'api les nouvelles données du pointage édité
         */
        recordEditPointage() {
            let urlApi = 'gtaPeriode/POST/' + this.$route.params.idPeriode;
            let query = {};

            if(this.std) {
                query.dd_correction = date.format(this.tmpStd.dd_date, 'YYYY-MM-DD') + ' ' + this.tmpStd.dd_time.hours + ':' + this.tmpStd.dd_time.minutes;
                query.df_correction = date.format(this.tmpStd.df_date, 'YYYY-MM-DD') + ' ' + this.tmpStd.df_time.hours + ':' + this.tmpStd.df_time.minutes;
                query.dpd_correction = this.tmpStd.dpd_date ? date.format(this.tmpStd.dpd_date, 'YYYY-MM-DD') + ' ' + (this.tmpStd.dpd_time.hours < 10 ? "0" : "") + this.tmpStd.dpd_time.hours + ':' + (this.tmpStd.dpd_time.minutes < 10 ? "0" : "") + this.tmpStd.dpd_time.minutes : null;
                query.dfp_correction = this.tmpStd.dfp_date ? date.format(this.tmpStd.dfp_date, 'YYYY-MM-DD') + ' ' + (this.tmpStd.dfp_time.hours < 10 ? "0" : "") + this.tmpStd.dfp_time.hours + ':' + (this.tmpStd.dfp_time.minutes < 10 ? "0" : "") + this.tmpStd.dfp_time.minutes : null;
                query.structure_temps_declaration = this.std.id;
            }

            if(this.gta_declarations) {
                query.gta_declarations = JSON.stringify(this.tmpStd.gta_declarations)
            }

            this.$app.apiPost(urlApi, query)
            .then(() => {      
                let urlApiCounters = "structureTempsDeclaration/GET/listDeclarations"
                let startDate = this.getStartDateOfISOWeek(this.$route.params.id.substr(4,2), this.$route.params.id.substr(0,4));

                return this.$app.apiGet(urlApiCounters, {
                    'dd': date.format(startDate, 'YYYY-MM-DD') ,
                    'df': date.format(date.addDays(startDate, +6), 'YYYY-MM-DD'),
                    'group_by_personnel': true,
                    'structure__personnel_id': this.personnelId,
                });
            })
            .then((dataByPersonnel) => {                
                this.refreshPersonnel(dataByPersonnel.personnels);
                this.$router.push('/week/'+ this.$route.params.id);
            })
            .catch(this.$app.catchError);
        },

        /**
         * Retourn la date de debut en fonction du numero de semaine et de l'année fournit
         * 
         * @param Integer   week        numero de semaine
         * @param Integer   year        numero de l'année
         */
        getStartDateOfISOWeek(week, year) {
            let simple = new Date(year, 0, 1+(week-1)*7);
            let dow = simple.getDay();
            let ISOweekStart = simple;
            
            if(dow <= 4) {
                ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
            } else {
                ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());
            }

            return ISOweekStart;
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
        },
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
        }

        if(this.gta_declarations) {
            this.tmpStd.gta_declarations = JSON.parse(JSON.stringify(this.gta_declarations));
        }
    },
}
</script>