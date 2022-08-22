<template>
    <Spinner v-if="pending.week"></Spinner>
    <div class="table-responsive" v-else>
        <table class="table table-bordered table-sm fs-7">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th class="col-md-2">Personnel</th>
                    <th></th>

                    <th class="col-day" v-for="day in weekDays" :key="'day-header-'+day.getDate()">
                        <div>{{day.toLocaleDateString('fr-FR', {weekday: 'long'})}}</div>
                        <div>{{dateToDayMonth(day)}}</div>
                    </th>

                    <th class="col-day">
                        <div>S{{semaine.week}}</div>
                    </th>
                </tr>
            </thead>

            <PersonnelItem v-for="personnel in personnelsDeclarations" :key="'personnel-'+personnel.id"
                :personnel="personnel"
                :weekDays="weekDays"
                :gta_codages="gta_codages"
                :semaine="semaine"
            ></PersonnelItem>
        </table>
    </div>

    <FooterToolbar v-if="pointageSelected.length">
        <ValidationButtons cancelLabel="Refuser" :pending="pending.validation" @confirm="actionForSelection('valider')" @cancel="actionForSelection('refuser')" />
    </FooterToolbar>

    <router-view :gta_codages="gta_codages"
                
                @update-std="updateStds" 
                @update-gta_declarations="updateGtaDeclarations" 
                @update-summary="updateSummary"></router-view>
</template>

<style lang="scss">
    .vertical-slides-enter-active,
    .vertical-slides-leave-active {
        transition: height .5s ease-in-out;
    }

    .vertical-slides-enter-from,
    .vertical-slides-leave-to {
        height: 0;
    }

    .col-day {
        max-width: 150px;
        min-width: 150px;
        width: 150px;
    }

</style>

<script>
import Spinner from '@/components/pebble-ui/Spinner.vue';
import PersonnelItem from '@/components/PersonnelItem.vue';
import { mapActions, mapState } from 'vuex';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';
import ValidationButtons from '../components/pebble-ui/toolbar/ValidationButtons.vue';

export default {
    inheritAttrs: false,

    props: {
        semaine: Object
    },

    data() {
        return {
            gta_codages: [],
            week: ['Monday', 'tuesday', 'wednesday', 'thursday', 'Friday', 'Saturday', 'Sunday'],
            resumePointageOptions: ['Total heures', 'Heures normales', 'Heures nuit', 'Prime A', 'Alerts'],
            pending: {
                week: true,
                validation: false
            },
            summary: [],
            frSummary: {
                'working_time': 'Durée de travail',
                'break_time': 'Pause',
                'normal_hours': 'Heures normal',
                'night_hours': 'Heures de nuit',
                'holiday_hours': 'Jours férié',
                'sunday_hours': 'Heures du dimanche'
            },
            rowspan:[]

        }
    },

    computed: {

        ...mapState(['pointageSelected', 'login', 'personnelsDeclarations']),

        /**
         * Retourne la liste des jours entre dd et df.
         * La valeur retournée est une collection d'objets Date
         * @returns {Array}
         */
        weekDays() {
            let dd = new Date(this.semaine.dd);
            let days = [];

            for (let i=0; i<7; i++) {
                let date = new Date(dd);
                date.setDate(dd.getDate() + i);
                days.push(date);
            }

            return days;
        },

        /**
         * Calcule la largeur du navigateur
         * @return {String}         Taille du navigateur moins les elements de gauche
         */
        sizeBar() {
            let size = window.innerWidth - 402;
            size = window.innerWidth - 418;

            return 'width:'+ size +'px';
        },
    },

    watch: {
        semaine() {
            this.resetPersonnel();
            this.loadDeclarations();
            this.resetPointage();
        }
    },

    components: { Spinner, PersonnelItem, FooterToolbar, ValidationButtons },

    methods: {
        ...mapActions(['resetPointage', 'addPersonnel', 'resetPersonnel', 'refreshPersonnelGtaPeriodes']),

        /**
         * Get the day number and month number 
         * if the length is equal at 1, add '0' before the number
         * 
         * @param {Date} date 
         */
        dateToDayMonth(date) {
            let dd = new Date(date);
            return dd.toLocaleDateString('fr-FR', {day:'2-digit', month: '2-digit'});
        },


        /**
         * Charge les déclarations depuis le serveur
         */
        loadDeclarations() {
            let apiUrl = 'structureTempsDeclaration/GET/listDeclarations';

            this.pending.week = true;

            this.$app.apiGet(apiUrl, {
                dd: this.semaine.dd,
                df: this.semaine.df,
                group_by_personnel: true
            })
            .then( (data) => {
                data.personnels.forEach( (personnel) => {
                    this.addPersonnel(personnel);
                });

                this.gta_codages = data.gta_codages;
                this.pending.week = false;
            })
            .catch(this.$app.catchError);
        },


        /**
         * Met a jour la liste des pointages selectionnés
         * @param {Array} selectedPointage liste des pointages selectionnés
         */
        updateSelectedPointages(selectedPointage) {
            this.selectedPointages = selectedPointage;
        },


        /**
         * Met a jour la list de structure temps declaration (std)
         * @param {Array} stds contient un/des object structure temps declaration
         */
        updateStds(stds) {
            stds.forEach(std => {
                this.personnelsDeclarations.forEach(personnel => {
                    personnel.gta_periodes.forEach(periode => {
                        let storedStd = periode.structure_temps_declarations.find(e => e.id == std.id);

                        if (storedStd) {
                            for (const key in std) {
                                storedStd[key] = std[key];
                            }
                        }
                    });
                });
            });
        },


        /**
         * Met a jour la list de gta_declaration 
         * @param {Array} declarations contient un/des object gta_declaration
         */
        updateGtaDeclarations(declarations) {
            console.log(declarations);
            declarations.forEach(declaration => {
                this.personnelsDeclarations.forEach(personnel => {
                    personnel.gta_periodes.forEach(periode => {
                        let storedDeclaration = periode.gta_declarations.find(e => e.id == declaration.id);

                        if(storedDeclaration) {
                            for (const key in declaration) {
                                storedDeclaration[key] = declaration[key]
                            }
                        }
                    });
                });
            });
        },


        /**
         * Valide ou refuse les pointages selectionnés
         * @param {String} action       action valide ou refuse
         */
        actionForSelection(action) {

            if (!['valider', 'refuser'].includes(action)) {
                throw new Error("L'action doit être [valider] ou [refuser]");
            }

            this.pending.validation = true;

            let listId= [];
            let query = {'personneId' : this.login.primary_personne_physique}

            this.pointageSelected.forEach(pointage => {
                listId.push(pointage.id);
            });

            listId.join(',');

            let urlApi = `/gtaPeriode/POST/${listId}/${action}`;

            this.$app.apiPost(urlApi, query)
            .then((data) => {
                this.refreshPersonnelGtaPeriodes(data);
                this.resetPointage();
                this.pending.validation = false;
            }).catch(this.$app.catchError);
        },

        updateSummary(codages){
            console.table(codages);
        }
    },

    mounted() {
        this.resetPersonnel();
        this.loadDeclarations();
        this.resetPointage();
    }

}
</script>