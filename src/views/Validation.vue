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
            ></PersonnelItem>

            <!-- <tbody v-for="personnel in personnels_declarations" :key="'personnel-'+personnel.id" class="table-group-divider"> 
                <tr class="text-center" v-for="(resume, key) in getSummary(personnel)" :key="'resumme-'+key">
                    <td :rowspan="rowspan[personnel.id]" class="text-center" v-if="key == 0">
                        <UserImage :name="personnel.cache_nom" size="user-image-lg" class-name="my-1"></UserImage>
                        <div>{{personnel.cache_nom}}</div>
                    </td>

                    <td class="text-start">
                        <span v-if="frSummary[resume]">{{frSummary[resume]}}</span>
                        <span v-else>{{resume}}</span>
                    </td>

                    <td v-for="day in weekDays" :key="'th-'+day">
                        {{valueSummaryDay(personnel.counters.days_summary, day, resume)}}
                    </td>

                    <td>
                        {{valueSummaryWeek(personnel.counters.weeks_summary[yearWeek], resume)}}
                    </td>
                </tr>

                <tr v-if="personnels_declarations">
                    <td></td>

                    <td class="col-day" v-for="day in weekDays" :key="'personnel-'+personnel.id+'-'+day.getDate()">
                        <template v-for="periode in getPeriodesFromDate(personnel.gta_periodes, day)" :key="'periode-'+periode.id">
                            <template v-if="periode.structure_temps_declarations.length > 0">
                                <PointageCard 
                                    @select-pointage="selectedPointage"
    
                                    :pointage="std" 
                                    :gta_declarations="periode.gta_declarations"
                                    :gta_codages="gta_codages"
                                    
                                    v-for="std in periode.structure_temps_declarations" 
                                    :key="'declaration-'+periode.id+'-'+std.id"></PointageCard>
                            </template>

                            <template v-else-if="periode.gta_declarations.length > 0 && periode.structure_temps_declarations.length == 0">
                                <GtaDeclarationsList :gta_declarations="periode.gta_declarations" :gta_codages="gta_codages" :card="true"></GtaDeclarationsList>
                            </template>

                            <template v-else>
                                <div class="card border border-2">
                                    <div class="card-body text-center">
                                        Periode Vide

                                        <button class="btn btn-danger">
                                            <i class="bi bi-trash"></i>
                                            Supprimer
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </td>

                    <td class="col-day"></td>
                </tr>
            </tbody> -->
        </table>
    </div>

    <div v-if="selectedPointages.length > 0" class="p-3 fixed-bottom bg-light shadow border-top ms-auto text-center" :style="sizeBar">
        <button type="submit" @click.prevent="validatePointage()" class="btn btn-primary col-2 mx-2" :disabled="pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Valider</span>
        </button>

        <button type ="submit" @click.prevent="rejectPointage()" class="btn btn-outline-danger col-2 mx-2" :disabled="pending.validate">
            <span v-if="pending.validate">En cours...</span>
            <span v-else>Rejeter</span>
        </button>
    </div>

    <router-view :personnels_declarations="personnels_declarations" :gta_codages="gta_codages"></router-view>
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
import PointageCard from '@/components/PointageCard.vue';
import UserImage from '@/components/pebble-ui/UserImage.vue';
import Spinner from '@/components/pebble-ui/Spinner.vue';
import GtaDeclarationsList from '@/components/GtaDeclarationsList.vue';
import PersonnelItem from '../components/personnelItem.vue';

export default {
    inheritAttrs: false,

    props: {
        semaine: Object
    },

    data() {
        return {
            personnels_declarations: [],
            gta_codages: [],
            selectedPointages: [],
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

        yearWeek() {
            let week = this.semaine.week;
            let splitDate = this.semaine.dd.split('-');
            let year = splitDate[0];

            return `${year}${week}`;
        }
    },

    watch: {
        semaine() {
            this.loadDeclarations();
        }
    },

    components: {
    PointageCard,
    UserImage,
    Spinner,
    GtaDeclarationsList,
    PersonnelItem
},

    methods: {
        /**
         * add or remove in array selectedPointages an pointage
         * 
         * @param {Array} payload 
         * - {Object}   Object du pointage
         * - {String}   action a faire add ou remomve
         */
        selectedPointage(payload) {
            if(payload[1] === 'add') {
                this.selectedPointages.push(payload[0]);
            } else {
                let index = this.selectedPointages.indexOf(this.selectedPointages.find((e) => e.id == payload[0].id));

                this.selectedPointages.splice(index,1);
            }
        },

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
         * Retourne une collection de période basées sur le même jour que la date passée 
         * en paramètre
         * 
         * @param {Array} periodes Liste des periodes à analyser
         * @param {Date} date L'objet représentant le jour
         * 
         * @returns {Array}
         */
        getPeriodesFromDate(periodes, date) {
            return periodes.filter(e => e.period_year == date.getFullYear() && e.period_month == (date.getMonth()+1) && e.period_day == date.getDate());
        },

        /**
         * Renvoi un tableau summary avec juste les informations qui nous interesse et non null
         * 1- ajout dans un nouveau trableau juste les element qui nous interesse
         * 2- Si index = Gta_declaration alors on boucle sur le resultat pour recuperer l'id qu'on map avec l'id de gta_codages pour récup le nom.
         * @param {Object} total_summary 
         * 
         * @return {Array} merge
         */
        getSummary(personnel) {
            let total_summary = personnel.counters.total_summary;
            let personnelId = personnel.id;
            let summary = [];
            let declarations = [];

            for( const index in total_summary) {
                if(index !== "declarations" && index!== 'amplitude' && index !== 'gta_declarations' && index != 'hours_per_day') {
                    if(total_summary[index]) {
                        summary.push(index);
                    }
                }

                if(index == 'gta_declarations') {
                    if(total_summary[index]) {
                        for(const codageId in total_summary[index]) {
                            if(total_summary[index][codageId]) {
                                let codage = this.gta_codages.find(e => e.id == codageId);
        
                                declarations.push(codage.nom);
                            }
                        }
                    }
                }
            }

            let merge = summary.concat(declarations);

            this.rowspan[personnelId] = merge.length+1;

            return merge;
        },

        /**
         * Renvoi les valeurs summary calculé sur un weekend
         * @param {Object} summaryWeek 
         * @param {String} summerKey
         * 
         * @return {Number}
         */
        valueSummaryWeek(summaryWeek, summaryKey) {
            let codage = this.gta_codages.find(e => e.nom == summaryKey);

            if(codage) {
                return this.twoDigitAfterComma(summaryWeek.gta_declarations[codage.id]);
            } 

            return this.twoDigitAfterComma(summaryWeek[summaryKey]);
            
        },

        /**
         * Renvoi les valeurs summary calculé sur un jour
         * @param {Object} summaryDay 
         * @param {Date} day 
         * @param {String} summaryKey
         * 
         * @return {Number}
         */
        valueSummaryDay(summaryDay, day, summaryKey) {
            let apiDate = `${day.getFullYear()}${Intl.DateTimeFormat('fr-FR',{month:'2-digit'}).format(day)}${Intl.DateTimeFormat('fr-FR',{day:'2-digit'}).format(day)}`;

            if(summaryDay[apiDate]) {
                let codage = this.gta_codages.find(e => e.nom == summaryKey);

                if(codage) {
                    return this.twoDigitAfterComma(summaryDay[apiDate]['gta_declarations'][codage.id]);
                }
                if(summaryDay[apiDate][summaryKey]) {
                    return this.twoDigitAfterComma(summaryDay[apiDate][summaryKey]); 
                }
            }

            return;
        },

        /**
         * Retourn le chiffre a 2 chiffre apres la virgule ex: 5.62
         * @param {Number} number
         * 
         * @return {Number}
         */
        twoDigitAfterComma(number) {
            return Math.round(number * 100) / 100;
        }
    },

    mounted() {
        this.loadDeclarations();
    }

}
</script>