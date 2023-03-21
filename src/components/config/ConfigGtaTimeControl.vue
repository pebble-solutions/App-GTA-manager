<template>
    <form v-if="opened_time_control" method="post" @submit.prevent="record()">
        <h3>Éditer une action</h3>

        <div class="mb-3">
            <label for="time_control_name" class="form-label">Nom</label>
            <input type="text" class="form-control" id="time_control_name" name="name" v-model="opened_time_control.name" required>
        </div>

        <div class="row g-2">
            <div class="col">
                <div class="mb-3">
                    <label for="time_control_time_start" class="form-label">Heure de début</label>
                    <input type="time" class="form-control" id="time_control_time_start" name="time_start" v-model="opened_time_control.time_start" required>
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label for="time_control_time_end" class="form-label">Heure de fin</label>
                    <input type="time" class="form-control" id="time_control_time_end" name="time_end" v-model="opened_time_control.time_end" required>
                </div>
            </div>
        </div>

        <div class="form-check mb-3">
            <input class="form-check-input" type="checkbox" value="1" id="time_control_break" name="break" v-model="opened_time_control.break">
            <label class="form-check-label" for="time_control_break">
                C'est une pause. <span class="form-text">Une pause sera automatiquement ajoutée aux pointages partiellement ou totalement
                    réalisés sur cette période.
                </span>
                <div class="text-warning form-text" v-if="opened_time_control.break">
                    <i class="bi bi-exclamation-circle-fill"></i> Le système enregistrera une pause maximum par période de pointage. Consultez 
                    la documentation sur les limitations liées aux pauses pour plus d'information.
                </div>
            </label>
        </div>

        <h4>Ajouter un compteur</h4>
        <p>
            Un compteur peut être automatiquement ajouté aux pointages réalisés sur cette période.
        </p>

        <div class="mb-3">
            <label for="time_control_codage_id" class="form-label">Type de compteur</label>
            <select class="form-select" id="time_control_codage_id" name="codage_id" v-model="opened_time_control.codage_id">
                <option value="">Aucun compteur</option>
                <option :value="codage.id" v-for="codage in gta_codages" :key="codage.id">{{gtaCodageFullLabel(codage)}}</option>
            </select>
        </div>

        <div v-if="opened_time_control.codage_id">

            <div class="row g-2">
                <div class="col">
                    <div>
                        <label for="time_control_absolute_value" class="form-label">Valeur absolue</label>
                        <input type="number" step=".01" class="form-control" name="absolute_value" id="time_control_absolute_value" v-model="opened_time_control.absolute_value">
                    </div>
                </div>
                <div class="col">
                    <div>
                        <label for="time_control_relative_value" class="form-label">Valeur relative</label>
                        <input type="number" step=".01" class="form-control" name="relative_value" id="time_control_relative_value" v-model="opened_time_control.relative_value">
                    </div>
                </div>
            </div>
            <div class="form-text mb-3">
                Valeur du compteur :
                <code class="d-block">{{previewOperation(opened_time_control)}}</code>
                <span class="fs-8 text-warning d-block" v-if="operationWarning(opened_time_control)">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i> {{operationWarning(opened_time_control)}}
                </span>
            </div>
        
        </div>

        <h4>Conditions</h4>

        <div class="row g-2" v-if="!pending.characteristics">
            <div class="col">
                <div class="mb-3">
                    <label for="time_control_condition_fonction_id" class="form-label">Fonction</label>
                    <select name="condition_fonction_id" id="time_control_condition_fonction_id" class="form-select" v-model="opened_time_control.condition_fonction_id">
                        <option value="">Aucune condition</option>
                        <option :value="fonction.id" v-for="fonction in fonctions" :key="fonction.id">{{fonction.nom}}</option>
                    </select>
                </div>
            </div>
            <div class="col">
                <div class="mb-3">
                    <label for="time_control_condition_secteur_id" class="form-label">Secteur</label>
                    <select name="condition_secteur_id" id="time_control_condition_secteur_id" class="form-select" v-model="opened_time_control.condition_secteur_id">
                        <option value="">Aucune condition</option>
                        <option :value="secteur.id" v-for="secteur in secteurs" :key="secteur.id">{{secteur.nom}}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="mb-3" v-if="!pending.personnels">
            <label for="time_control_condition_personnel_id" class="form-label">Personnel</label>
            <select name="condition_personnel_id" id="time_control_condition_personnel_id" class="form-select" v-model="opened_time_control.condition_personnel_id">
                <option value="">Aucune condition</option>
                <option :value="personnel.id" v-for="personnel in personnels" :key="personnel.id">{{personnel.cache_nom}}</option>
            </select>
        </div>

        <div class="d-flex align-items-center justify-content-between">
            <div>
                <button class="btn btn-outline-danger" type="button" v-if="opened_time_control.id" title="Supprimer" @click.prevent="deleteTimeControl(opened_time_control)" :disabled="pending.delete">
                    <i class="bi bi-trash" v-if="!pending.delete"></i>
                    <span class="spinner-border spinner-border-sm" role="status" v-else></span>
                </button>
            </div>
            <div class="text-end">
                <button class="btn btn-secondary me-2" type="button" @click.prevent="close()">Annuler</button>
                <button class="btn btn-primary" type="submit" :disabled="pending.record">
                    <i class="bi bi-check" v-if="!pending.record"></i>
                    <span class="spinner-border spinner-border-sm" role="status" v-else></span>
                    Valider
                </button>
            </div>
        </div>
    </form>

    <div v-else>

        <div class="d-flex align-items-center justify-content-between">
            <h3>Actions au pointage</h3>
            <button class="btn btn-primary" type="button" @click.prevent="newTimeControl()">
                <i class="bi bi-plus me-1"></i>
                Nouveau
            </button>
        </div>

        <p>
            Dans cette section, vous pouvez créer des actions qui s'ajouteront automatiquement lorsque 
            le personnel pointera sur les horaires déterminées par les conditions de l'action.
        </p>

        <alert-message icon="bi-exclamation-circle-fill" variant="warning" v-if="pauseConditionsNum > 1">
            <div>Il y a <strong>{{pauseConditionsNum}} actions pouvant générer des pauses</strong>. Cela est possible mais notez que une seule pause peut être
            enregistrée par période de pointage. Si les conditions de plusieurs pauses sont remplie pour une période de pointage, la première 
            condition sera retenue, les autres seront ignorées.</div>
        </alert-message>

        <table class="table" v-if="time_controls.length">
            <thead class="table-light">
                <tr>
                    <th>Nom</th>
                    <th>Période</th>
                    <th>Pause</th>
                    <th>Déclaration</th>
                    <th>Conditions</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="timeControl in time_controls" :key="timeControl.id">
                    <td>{{timeControl.name}}</td>
                    <td><i class="bi bi-clock"></i> {{getTime(timeControl.time_start)}} <i class="bi bi-chevron-right"></i> {{getTime(timeControl.time_end)}}</td>
                    <td>
                        <span class="badge rounded-pill text-bg-success" v-if="timeControl.break"><i class="bi bi-pause"></i></span>
                    </td>
                    <td>
                        <span v-if="timeControl.codage_id">
                            {{timeControl.codage_label}}
                            <code class="d-block">{{previewOperation(timeControl)}}</code>
                            <span class="fs-8 text-warning d-block" v-if="operationWarning(timeControl)">
                                <i class="bi bi-exclamation-triangle-fill me-2"></i> {{operationWarning(timeControl)}}
                            </span>
                        </span>
                    </td>
                    <td class="fs-8">
                        {{getConditionsRow(timeControl)}}
                    </td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm" @click.prevent="openTimeControl(timeControl)"><i class="bi bi-pencil-square"></i></button>
                    </td>
                </tr>
            </tbody>
        </table>
        <template v-else>
            <div v-if="pending.time_controls" class="d-flex align-items-center">
                <div class="spinner-border text-secondary" role="status"></div>
                <span class="ms-2">Chargement...</span>
            </div>
            <div class="alert alert-info" v-else>
                Il n'y a pas d'actions enregistrées. <a href="#!" @click.prevent="newTimeControl()" class="alert-link">Créer votre première action</a>
            </div>
        </template>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import AlertMessage from '../pebble-ui/AlertMessage.vue';

export default {
  components: { AlertMessage },
    data() {
        return {
            time_controls: [],
            opened_time_control: null,
            fonctions: [],
            secteurs: [],
            personnels: [],
            pending: {
                time_controls: true,
                delete: false,
                record: false,
                characteristics: true,
                personnels: true
            }
        }
    },

    computed: {
        ...mapState(['gta_codages']),

        /**
         * Retourne le nombre de time controls générant des pauses.
         * 
         * @return {number}
         */
        pauseConditionsNum() {
            let tc = this.time_controls.filter(e => e.break);
            return tc.length;
        }
    },

    methods: {
        ...mapActions(['getCodageLabelFromId']),

        /**
         * Retourne une ligne de synthèse des conditions à remplir pour que le time control
         * soit utilisé lors du pointage.
         * 
         * @param {object} timeControl Le GtaTimeControl à analyser
         * 
         * @return {string}
         */
        getConditionsRow(timeControl) {
            let conditions = [];

            if (timeControl.condition_personnel_id) {
                let personnel = this.personnels.find(e => e.id == timeControl.condition_personnel_id);
                conditions.push([`Personnel ${personnel?.cache_nom}`]);
            }
            if (timeControl.condition_secteur_id) {
                let secteur = this.secteurs.find(e => e.id == timeControl.condition_secteur_id);
                conditions.push([`Secteur ${secteur?.nom}`]);
            }
            if (timeControl.condition_fonction_id) {
                let fonction = this.fonctions.find(e => e.id == timeControl.condition_fonction_id);
                conditions.push([`Fonction ${fonction?.nom}`]);
            }
            return conditions.join(' + ');
        },

        /**
         * Charge les GtaTimeControls depuis le serveur
         */
        loadTimeControls() {
            this.pending.time_controls = true;
            this.$app.apiGet('gtaTimeControl/GET/list')
            .then(data => {
                this.time_controls = data;
                this.getCodageLabels();
            }).catch(this.$app.catchError).finally(() =>  this.pending.time_controls = false);
        },

        /**
         * Lance la création d'un nouveau GtaTimeControl
         */
        newTimeControl() {
            this.opened_time_control = {
                id: 0,
                name: '',
                time_start: '00:00:00',
                time_end: '23:59:59',
                break: 0,
                absolute_value: null,
                relative_value: null,
                condition_personnel_id: null,
                condition_fonction_id: null,
                condition_secteur_id: null
            };
        },

        /**
         * Crée une copie d'un GtaTimeControl et l'ouvre dans data.
         * 
         * @param {object} timeControl GtaTimeControl
         */
        openTimeControl(timeControl) {
            this.opened_time_control = JSON.parse(JSON.stringify(timeControl));
            this.opened_time_control.break = this.opened_time_control.break ? true : false;
        },

        /**
         * Retourne le libellé complet d'un GtaCodage
         * 
         * Nom codage (CODE)
         * 
         * @param {object} codage GtaCodage
         * 
         * @return {string}
         */
        gtaCodageFullLabel(codage) {
            let label = codage.nom ?? codage.nom_commun ?? 'Sans-nom';
            let code = codage.code ?? codage.code_nouveau ?? codage.code_ancien;

            if (code) {
                label += ` (${code})`;
            }

            return label;
        },

        /**
         * Ferme le time_control ouvert.
         */
        close() {
            this.opened_time_control = null;
        },

        /**
         * Supprime un GtaTimeControl du serveur
         * 
         * @param {object} timeControl GtaTimeControl
         */
        deleteTimeControl(timeControl) {
            if (window.confirm("Souhaitez-vous supprimer cette action ?")) {
                this.pending.delete = true;
                this.$app.apiPost('gtaTimeControl/DELETE/'+timeControl.id)
                .then(() => {
                    let index = this.time_controls.findIndex(e => e.id == timeControl.id);
                    if (index !== -1) {
                        this.time_controls.splice(index, 1);
                    }
                    this.close();
                }).catch(this.$app.catchError).finally(() => this.pending.delete = false);
            }
        },

        /**
         * Enregistre les informations du codage ouvert sur le serveur.
         */
        record() {
            this.pending.record = true;
            let route = 'gtaTimeControl/POST/'+this.opened_time_control.id;

            this.opened_time_control.break = this.opened_time_control.break ? 1 : 0;

            this.$app.apiPost(route, this.opened_time_control)
            .then((data) => {
                this.refreshTimeControl([data]);
                this.close();
            }).catch(this.$app.catchError).finally(() => this.pending.record = false);
        },

        /**
         * Met à jour une liste de gta time controls dans data
         * 
         * @param {array} time_controls Collection de GtaTimeControl
         */
        refreshTimeControl(time_controls) {
            time_controls.forEach(timeControl => {
                let found = this.time_controls.find(e => e.id == timeControl.id);

                if (found) {
                    for (const key in timeControl) {
                        found[key] = timeControl[key];
                    }
                }
                else {
                    this.time_controls.push(timeControl);
                }
            });

            this.getCodageLabels();
        },

        /**
         * Récupère les libelles de codage depuis le store et les affecte à une clé codage_label sur
         * chaque time_controls
         */
        getCodageLabels() {
            this.time_controls.forEach(timeControl => {
                this.getCodageLabelFromId(timeControl.codage_id).then(label => timeControl.codage_label = label);
            });
        },

        /**
         * Analyse les valeurs relative et absolue pour les transformer en nombre si nécessaire.
         * 
         * @param {object} timeControl GtaTimeControl
         * 
         * @return {object} {relative: number, absolute: number}
         */
        getOperationValues(timeControl) {
            let relative = timeControl.relative_value ?? 0;
            let absolute = timeControl.absolute_value ?? 0;

            if (relative == '') relative = 0;
            if  (absolute == '') absolute = 0;

            return { relative, absolute };
        },

        /**
         * Retourne un aperçu de l'opération mathématique qui sera exécutée
         * 
         * @param {object} timeControl GtaTimeControl
         * 
         * @return {string}
         */
        previewOperation(timeControl) {
            let values = this.getOperationValues(timeControl);
            return `Qte = Durée_Heures * ${values.relative} + ${values.absolute}`;
        },

        /**
         * Fait des tests sur les valeurs relative et absolue des actions.
         * Si les tests retournent toujours 0, retourne l'avertissement.
         * 
         * @param {object} timeControl GtaTimeControl
         * 
         * @return {string|null}
         */
        operationWarning(timeControl) {
            let values = this.getOperationValues(timeControl);

            let test1 = (1 * values.relative + values.absolute);
            let test2 = (2 * values.relative + values.absolute);

            if (!test1 && !test2) {
                return "Avec cette configuration, il est probable que le compteur soit toujours à 0.";
            }
            return null;
        },

        /**
         * Transforme un horaire vers hh:ii
         * 
         * @param {string} time Un horaire au format hh:ii:ss ou hh:ii
         * 
         * @return {string}
         */
        getTime(time) {
            let part = time.split(':');
            return part[0]+':'+part[1];
        },

        /**
         * Charge les charactéristiques du personnel : liste des fonction, liste des secteurs.
         */
        loadPersonnelCharacteristics() {
            this.pending.characteristics = true;
            this.$app.apiGet('structurePersonnel/GET/listCharacteristics', {
                groupes: 'fonction,secteur' 
            }).then(data => {
                this.fonctions = data.fonction;
                this.secteurs = data.secteur;
            }).catch(this.$app.catchError).finally(() => this.pending.characteristics = false);
        },

        /**
         * Charge la liste du personnel
         */
        loadPersonnels() {
            this.pending.personnels = true;
            this.$app.apiGet('structurePersonnel/GET/list')
            .then(data => this.personnels = data).catch(this.$app.catchError).finally(() => this.pending.personnels = false);
        }
    },

    mounted() {
        this.loadTimeControls();
        this.loadPersonnels();
        this.loadPersonnelCharacteristics();
    }
}

</script>