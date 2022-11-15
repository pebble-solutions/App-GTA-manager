<template>
    <Spinner v-if="pending.week"></Spinner>
    
    <div class="table-responsive" v-else-if="!pending.week && personnelsDeclarations.length">

        <WeekHeader :week-days="weekDays" :semaine="semaine"></WeekHeader>

        <table class="table table-bordered table-sm fs-7" id="week-personnels-table">
            <PersonnelWeekRow 
                v-for="personnel in personnelsDeclarations" 
                :key="'personnel-'+personnel.id"
                :personnel="personnel"
                :weekDays="weekDays"
                :semaine="semaine"
                @change="resizeHeader()"
            ></PersonnelWeekRow>
        </table>
    </div>

    <div v-else class="py-3 lead text-secondary text-center">
        <div><i class="bi bi-file-x"></i></div>
        <div>Pas de déclarations sur cette semaine</div>
    </div>

    <FooterToolbar v-if="periodes_selected.length" className="bg-dark text-light">
        <ValidationButtons cancelLabel="Refuser" :pending="pending.validation" @confirm="actionForSelection('valider')" @cancel="actionForSelection('refuser')" />
    </FooterToolbar>

    <router-view
        @update-std="updateStds" 
        @update-gta_declarations="updateGtaDeclarations"></router-view>
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
        max-width: 11.11%;
        min-width: 11.11%;
        width: 11.11%;
    }

</style>

<script>

import Spinner from '@/components/pebble-ui/Spinner.vue';
import PersonnelWeekRow from '@/components/PersonnelWeekRow.vue';
import { mapActions, mapState } from 'vuex';
import FooterToolbar from '../components/pebble-ui/toolbar/FooterToolbar.vue';
import ValidationButtons from '../components/pebble-ui/toolbar/ValidationButtons.vue';
import WeekHeader from '../components/WeekHeader.vue';

export default {
    inheritAttrs: false,

    props: {
        semaine: Object
    },

    data() {
        return {
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

        ...mapState(['periodes_selected', 'login', 'personnelsDeclarations', 'semaines', 'gta_codages']),

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
            this.resetPeriodeSelection();
        }
    },

    components: { Spinner, PersonnelWeekRow, FooterToolbar, ValidationButtons, WeekHeader },

    methods: {
        ...mapActions(['resetPeriodeSelection', 'refreshPersonnel', 'resetPersonnel', 'refreshPersonnelGtaPeriodes', 'refreshSemaines']),

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
                this.refreshPersonnel(data.personnels);
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

            this.periodes_selected.forEach(pointage => {
                listId.push(pointage.id);
            });

            listId.join(',');

            let urlApi = `/gtaPeriode/POST/${listId}/${action}`;

            this.$app.apiPost(urlApi, query)
            .then((data) => {
                this.refreshPersonnelGtaPeriodes(data);
                this.resetPeriodeSelection();
                this.pending.validation = false;

                let urlApi = "gtaPeriode/GET/listWeeksAnalytics?week_start=" + this.$route.params.id + "&week_end=" + this.$route.params.id + "&order_direction=ASC"

                return this.$app.apiGet(urlApi);
            }).then((data) => {
                this.refreshSemaines(data);

                let urlApiCounters = "structureTempsDeclaration/GET/listDeclarations";

                return this.$app.apiGet(urlApiCounters, {
                    'dd': this.semaine.dd,
                    'df': this.semaine.df,
                    'group_by_personnel': true
                });
            }).then((data) => {
                this.refreshPersonnel(data.personnels);
            }).catch(this.$app.catchError);
        },

        /**
         * Met à jour la largeur de chaque colonne du header en fonction des largeurs de colonnes
         * du tableau principal.
         */
        resizeHeader() {
            let headerWeek = document.getElementById('header-week');

            if (headerWeek) {
                let headerCols = headerWeek.querySelectorAll('.week-header-col');

                let personnelTable = document.getElementById('week-personnels-table');

                if (personnelTable) {
                    let tableCols = personnelTable.querySelectorAll('.personnel-periodes td');

                    personnelTable.style.marginTop = headerWeek.offsetHeight+'px';
    
                    if (tableCols) {
                        for (let i=0; i<headerCols.length; i++) {
                            let val = tableCols[i].offsetWidth+'px';
                            headerCols[i].style.width = val;
                            headerCols[i].style.minWidth = val;
                            headerCols[i].style.maxWidth = val;
                        }
                    }
                }
        
            }
        }
    },

    updated() {
        this.resizeHeader();
    },

    mounted() {
        this.resetPersonnel();
        this.loadDeclarations();
        this.resetPeriodeSelection();

        window.addEventListener("resize", () => {
            this.resizeHeader();
        });
    }

}
</script>