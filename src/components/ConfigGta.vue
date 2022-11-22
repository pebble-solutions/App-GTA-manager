<template>
    <div v-if="tmpConfig && tmpNightHours">
        <h4 class="fs-5">Pointage</h4>
    
        <div class="row">
            <div class="col">
                <div class="mb-3">
                    <label for="MODULE_PAIE_CLOCK_ROUND" class="form-label">Arrondi des horaires <admin-pill /></label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="MODULE_PAIE_CLOCK_ROUND" 
                            v-model="tmpConfig.MODULE_PAIE_CLOCK_ROUND">
                        <span class="input-group-text">Minutes</span>
                    </div>
                    <div class="form-text">Les horaires de début et de fin de pointage seront arrondis selon la règle 
                        ci-dessus. Indiquez 5, 10, 15, 20, 30... Exemple : en renseignant 15, un pointage fait à 17h09 
                        sera arrondis à 17h15.</div>
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label for="MODULE_PAIE_CLOCK_MAX_DURATION" class="form-label">Durée maximum d'un pointage <admin-pill /></label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="MODULE_PAIE_CLOCK_MAX_DURATION" 
                            v-model="tmpConfig.MODULE_PAIE_CLOCK_MAX_DURATION">
                        <span class="input-group-text">Heures</span>
                    </div>
                    <div class="form-text">Durée à partir de laquelle le pointage ne pourra plus être arrêté par le 
                        personnel. En cas de travail de nuit (entre deux jours), le système autorisera le personnel 
                        à terminer son pointage à N+1 si il effectue sa sortie dans le temps indiqué.</div>
                </div>
            </div>
        </div>
    
        <hr>
    
        <h4 class="fs-5">Heures de nuit</h4>
        
        <div class="mb-3">
            <div class="row">
                <div class="col">
                    <label for="MODULE_PAIE_NIGHT_START_TIME-hours" class="form-label">Début <admin-pill /></label>
                    <div class="input-group">
                        <select name="MODULE_PAIE_NIGHT_START_TIME-hours" id="MODULE_PAIE_NIGHT_START_TIME-hours" class="form-select" v-model="tmpNightHours.start[0]">
                            <option :value="n-1" v-for="n in 24" :key="n-1">{{n-1}} h</option>
                        </select>
                        <select name="MODULE_PAIE_NIGHT_START_TIME-minutes" id="MODULE_PAIE_NIGHT_START_TIME-minutes" class="form-select" v-model="tmpNightHours.start[1]">
                            <option :value="n-1" v-for="n in 60" :key="n-1">{{n-1}} min</option>
                        </select>
                    </div>
                </div>
                <div class="col">
                    <label for="MODULE_PAIE_NIGHT_END_TIME-hours" class="form-label">Fin J+1 <admin-pill /></label>
                    <div class="input-group">
                        <select name="MODULE_PAIE_NIGHT_END_TIME-hours" id="MODULE_PAIE_NIGHT_END_TIME-hours" class="form-select" v-model="tmpNightHours.end[0]">
                            <option :value="n-1" v-for="n in 24" :key="n-1">{{n-1}} h</option>
                        </select>
                        <select name="MODULE_PAIE_NIGHT_END_TIME-minutes" id="MODULE_PAIE_NIGHT_END_TIME-minutes" class="form-select" v-model="tmpNightHours.end[1]">
                            <option :value="n-1" v-for="n in 60" :key="n-1">{{n-1}} min</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="form-text">La tranche horaire incrémentée sur les compteurs de nuit débute sur une journée J et 
                termine sur la journée suivante (J+1). Pour désactiver le compteur de nuit, indiquez 0 dans toutes les valeurs.
            </div>
        </div>

        <div class="mb-3">
            <label class="form-label">Jours exclus des heures de nuit <admin-pill /></label>
            <div class="input-group">
                <div class="form-check me-4" v-for="n in 7" :key="n">
                    <input class="form-check-input" type="checkbox" :value="n" v-model="tmpNightExcluded" name="MODULE_PAIE_NIGHT_EXCLUDED_DAYS[]" :id="'MODULE_PAIE_NIGHT_EXCLUDED_DAYS-'+n">
                    <label class="form-check-label" :for="'MODULE_PAIE_NIGHT_EXCLUDED_DAYS-'+n">{{dayDict[n-1]}}</label>
                </div>
            </div>
            <div class="form-text">Les jours cochés ne seront pas comptabilisés sur le compteur des heures de nuit.</div>
        </div>
    
        <hr>
    
        <h4 class="fs-5">Dépassement des heures</h4>
    
        <div class="mb-3">
            <label for="MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JOUR" class="form-label">Seuil horaire journalier <admin-pill /></label>
            <div class="input-group">
                <input type="text" class="form-control" id="MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JOUR" 
                    v-model="tmpConfig.MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JOUR">
                <span class="input-group-text">Heures</span>
            </div>
            <div class="form-text">Nombre d'heures à partir desquelles on concidère que le personnel 
                dépasse le plafond journalier. Indiquez 0 pour ne pas fixer de seuil.</div>
        </div>
    
        <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JUSTIFY" 
                v-model="tmpHeureSupJustify">
            <label class="form-check-label" for="MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JUSTIFY">Justifier les dépassements <admin-pill />
                <span class="form-text"> - Le personnel devra ajouter un commentaire lors de son pointage si le seuil 
                    journalier est dépassé.</span>
            </label>
        </div>

        <div class="my-3 text-end">
            <button type="button" class="btn btn-admin" @click.prevent="record()">
                <span class="spinner-border spinner-border-sm" v-if="pending.config"></span>
                <i class="bi bi-shield-shaded" v-else></i> 
                Appliquer
            </button>
        </div>
    </div>
</template>

<script>

import { mapActions, mapState } from 'vuex'
import AdminPill from './pebble-ui/admin/AdminPill.vue';
import { padTime } from '../js/date';

export default {
  components: { AdminPill },

    data() {
        return {
            tmpConfig: null,
            tmpNightHours: {
                start: [0,0],
                end: [0,0]
            },
            tmpNightExcluded: [],
            tmpHeureSupJustify: false,
            dayDict: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'],
            pending: {
                config: false
            }
        }
    },

    computed: {
        ...mapState(['config'])
    },

    watch: {
        /**
         * Lorsque les heures de nuits sont modifiées, elles sont transférées à la configuration générale
         * et reformatée.
         * 
         * @param {object} newVal La nouvelle valeur des heures de nuit
         */
        tmpNightHours: {
            handler(newVal) {
                let start = parseInt(`${newVal.start[0]}${padTime(newVal.start[1])}`);
                let end = parseInt(`${newVal.end[0]}${padTime(newVal.end[1])}`);
                this.tmpConfig.MODULE_PAIE_NIGHT_START_TIME = start;
                this.tmpConfig.MODULE_PAIE_NIGHT_END_TIME = end;
            },
            deep: true
        },

        /**
         * Lorsque les jours à exclure des heures de nuit est modifié dans le formulaire, l'array
         * est associé via des virgules et transféré à la configuration générale.
         * 
         * @param {string} newVal La nouvelle valeur des jours à exclure des heures de nuit
         */
        tmpNightExcluded(newVal) {
            this.tmpConfig.MODULE_PAIE_NIGHT_EXCLUDED_DAYS = newVal.join(",");
        },

        /**
         * Lorsque la variable d'état de justification des heures supplémentaire est modifiée, 
         * la valeur associée dans la configuration est mise à jour.
         * 
         * @param {boolean} newVal Nouvel état
         */
        tmpHeureSupJustify(newVal) {
            this.tmpConfig.MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JUSTIFY = newVal ? 1 : 0;
        }
    },

    methods: {
        ...mapActions(['updateConfigGta']),

        /**
         * Récupère les données depuis le store afin de les préparer pour l'affichage.
         */
        importData() {
            this.tmpConfig = JSON.parse(JSON.stringify(this.config.gta));
            let start = String(this.tmpConfig.MODULE_PAIE_NIGHT_START_TIME);
            let end = String(this.tmpConfig.MODULE_PAIE_NIGHT_END_TIME);

            this.tmpNightHours = {
                start: [parseInt(start.substring(0, start.length - 2)), parseInt(start.substring(start.length - 2))],
                end: [parseInt(end.substring(0, end.length - 2)), parseInt(end.substring(end.length - 2))]
            };

            this.tmpNightExcluded = this.tmpConfig.MODULE_PAIE_NIGHT_EXCLUDED_DAYS.split(',');

            this.tmpHeureSupJustify = this.tmpConfig.MODULE_PAIE_HEURES_SUPPLEMENTAIRES_JUSTIFY ? true : false;
        },

        /**
         * Enregistre les informations de configuration sur le serveur et met à jour la configuration locale.
         */
        record() {
            if (window.confirm("La modification de ces paramètres impacte l'ensemble des prochaines pointages et déclarations réalisés sur cette structure. Souhaitez-vous confirmer ?")) {
                this.pending.config = true;
                this.$app.apiPost('gtaDeclaration/POST/config', this.tmpConfig)
                .then(() => {
                    this.updateConfigGta(this.tmpConfig);
                    this.$emit('config-gta-update', this.tmpConfig);
                })
                .catch(this.$app.catchError).finally(() => this.pending.config = false);
            }
        }
    },

    mounted() {
        this.importData();
    }
}

</script>