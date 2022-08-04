<template>
    <Spinner v-if="pending.week"></Spinner>
    <div class="table-responsive" v-else>
        <table class="table table-bordered table-sm fs-7">
            <thead class="align-middle text-center table-secondary">
                <tr>
                    <th>Personnel</th>
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

            <PersonnelItem v-for="personnel in personnels_declarations" :key="'personnel-'+personnel.id"
                :personnel="personnel"
                :weekDays="weekDays"
                :gta_codages="gta_codages"
                :semaine="semaine"
            ></PersonnelItem>
        </table>
    </div>

    <div v-if="pointageSelected.length > 0" class="p-3 fixed-bottom bg-light shadow border-top ms-auto text-center" :style="sizeBar">
        <button type="submit" @click.prevent="validatePointage()" class="btn btn-primary col-2 mx-2" :disabled="pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Valider</span>
        </button>

        <button type ="submit" @click.prevent="rejectPointage()" class="btn btn-outline-danger col-2 mx-2" :disabled="pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Rejeter</span>
        </button>
    </div>

    <router-view :personnels_declarations="personnels_declarations" :gta_codages="gta_codages" @update-std="updateStds" @update-gta_declarations="UpdateGtaDeclarations"></router-view>
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

export default {
    inheritAttrs: false,

    props: {
        semaine: Object
    },

    data() {
        return {
            personnels_declarations: [],
            gta_codages: [],
            week: ['Monday', 'tuesday', 'wednesday', 'thursday', 'Friday', 'Saturday', 'Sunday'],
            resumePointageOptions: ['Total heures', 'Heures normales', 'Heures nuit', 'Prime A', 'Alerts'],
            pending: {
                week: true
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

        ...mapState(['pointageSelected']),

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
            this.loadDeclarations();
            this.resetPointage();
        }
    },

    components: {
        Spinner,
        PersonnelItem
    },

    methods: {
        ...mapActions(['resetPointage']),

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
                this.personnels_declarations = data.personnels;
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
                this.personnels_declarations.forEach(personnel => {
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
        UpdateGtaDeclarations(declarations) {
            declarations.forEach(declaration => {
                this.personnels_declarations.forEach(personnel => {
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
        }
    },

    /**
     * Met a jour la list de structure temps declaration (std)
     * @param {Array} stds contient un/des object structure temps declaration
     */
    mounted() {
        this.loadDeclarations();
        this.resetPointage();
    }

}
</script>