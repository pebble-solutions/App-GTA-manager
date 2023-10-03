<template>
    <div>
        <div class="btn-group w-100 mb-3">
            <input type="radio" class="btn-check" name="restriction" id="restriction-radio-active" autocomplete="off" v-model="restriction" value="active">
            <label class="btn btn-outline-secondary" for="restriction-radio-active">Personnel actif</label>

            <input type="radio" class="btn-check" name="restriction" id="restriction-radio-all" autocomplete="off" v-model="restriction" value="all">
            <label class="btn btn-outline-secondary" for="restriction-radio-all">Tout le personnel</label>
        </div>

        <div class="px-3">
            <div class="form-check text-nowrap">
                <input type="checkbox" class="form-check-input" id="ckb-personnel-tous" :checked="!checkedPersonnelsId.length" @click="resetSelection()">
                <label class="form-check-label" for="ckb-personnel-tous">
                    Tous le personnel
                </label>
            </div>
        </div>
        <hr>
        <div class="list-group list-group-flush">
            <div v-for="group in personnelGroups" :key="'group-'+group.id" class="list-group-item">
                <div class="form-check text-nowrap">
                    <input type="checkbox" class="form-check-input" :id="'ckb-personnel-group-'+group.id" :value="group.id" v-model="checkedGroupsId">
                    <label class="form-check-label" :for="'ckb-personnel-group-'+group.id">
                        <h5>{{group.nom}}</h5>
                    </label>
                </div>
                <template  v-for="personnel in group.personnels" :key="'personnel-'+personnel.id">
                    <div class="form-check text-nowrap" v-if="isDisplayable(personnel)">
                        <input type="checkbox" class="form-check-input" :id="'ckb-personnel-'+personnel.id" :value="personnel.id" v-model="checkedPersonnelsId">
                        <label class="form-check-label" :for="'ckb-personnel-'+personnel.id">
                            {{personnel.cache_nom}}
                        </label>
                    </div>

                </template>
            </div>
        </div>

    </div>
</template>

<script>
import { mapState } from 'vuex'
import { sqlDateToIso } from '../js/date';

export default {

    emits: ['selection-change'],

    data() {
        return {
            checkedPersonnelsId: [],
            checkedGroupsId: [],
            restriction: "active"
        }
    },

    computed: {
        ...mapState(['personnels', 'selectedPersonnels']),

        /**
         * Regroupe le personnel par fonction (basé sur mls__fonction).
         * 
         * @return {array}
         * - personnels [...personnel]
         */
        personnelGroups() {
            let groups = this.personnels.map(x => x.mls__fonction);

            let personnelGroups = [];

            groups.forEach(gid => {

                let found = personnelGroups.find(e => e.id == gid);

                if (!found) {
                    let group = {
                        id: gid,
                        personnels: []
                    };
    
                    group.personnels = this.personnels.filter(p => p.mls__fonction == gid);

                    group.nom = group.personnels[0]?.mls__fonction_label;
    
                    personnelGroups.push(group);
                }
            });

            return personnelGroups;
        }
    },

    watch: {
        /**
         * Envoie un événement avec la nouvelle sélection de personnes lorsque celle 
         * ci change.
         * 
         * @param {array} val Nouvelle sélection des personnes
         */
        checkedPersonnelsId(val) {
            this.$emit('selection-change', val);
        },

        /**
         * Contrôle le changement d'état de sélection par groupe. On va récupérer :
         * 
         * - Les nouvelles entrées pour sélectionner l'ensemble du personnel contenu :
         *      Il s'aggit d'ids présents dans newVal et absent dans prevVal
         * - Les nouvelles sorties pour désélectionner l'ensemble du personnel contenu
         *      Il s'aggit d'ids absents de newVal et présent dans prevVal
         * 
         * Les ids présents dans les deux tableaux (new et prev) ne sont pas touchés.
         * @param {array} newVal La nouvelle sélection
         * @param {array} prevVal La sélection avant le changement d'état
         */
        checkedGroupsId(newVal, prevVal) {
            let newIds = newVal.filter(e => !prevVal.includes(e));
            let rmIds = prevVal.filter(e => !newVal.includes(e));

            // Ajout à la sélection
            newIds.forEach(gid => {
                let group = this.personnelGroups.find(g => g.id == gid);

                if (group) {
                    group.personnels.forEach(personnel => {
                        if (!this.checkedPersonnelsId.includes(personnel.id)) {
                            this.checkedPersonnelsId.push(personnel.id);
                        }
                    });
                }
            });

            // Retrait de la sélection
            rmIds.forEach(gid => {
                let group = this.personnelGroups.find(g => g.id == gid);

                if (group) {
                    group.personnels.forEach(personnel => {
                        let index = this.checkedPersonnelsId.findIndex((e) => {
                            return e == personnel.id;
                        });

                        if (index !== -1) {
                            this.checkedPersonnelsId.splice(index, 1);
                        }
                    })
                }
            });

            this.$emit('selection-change', this.checkedPersonnelsId);
        }
    },

    methods: {
        /**
         * Ajouter ou retire un personnel de la sélection.
         * 
         * @param {object} personnel Le personnel à ajouter/retirer
         */
        resetSelection() {
            this.checkedPersonnelsId = [];
            this.checkedGroupsId = [];
        },

        /**
         * Contrôle si le personnel fait partie de la sélection ou non
         * 
         * @param {object} personnel Personnel à vérifier
         * 
         * @return {boolean}
         */
        isSelected(personnel) {
            let found = this.selectedPersonnels.find(e => e.id == personnel.id);
            return found ? true : false;
        },

        /**
         * Retourne vrais si le personnel doit être affiché
         * 
         * @param {object} personnel Le personnel à tester
         */
        isDisplayable(personnel) {
            if (this.restriction === "all") {
                return true;
            }

            else {
                if (!personnel.dsortie || personnel.dsortie === "0000-00-00" || personnel.dsortie === "0000-00-00 00:00:00") {
                    return true;
                }

                const dateStart = new Date(sqlDateToIso(personnel.dentree));
                const now = new Date();

                if (dateStart >= now) {
                    return  true;
                }
            }

            return false;
        }
    },

    mounted() {
        this.personnels.forEach(e => {
            if (this.isSelected(e)) {
                this.checkedPersonnelsId.push(e.id);
            }
        });
    }
}

</script>