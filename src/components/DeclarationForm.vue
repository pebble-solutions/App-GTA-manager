<template>
    <div>
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

                <input type="number" class="form-control" @keydown.enter.prevent="actionAddInfos()" v-model="infosToAdd.qte_retenue">

                <button type="button" class="btn btn-success" @click.prevent="actionAddInfos()">
                    <i class="bi bi-check"></i>
                </button>
            </div>
        </div>

        <DeclarationFormItem v-for="declaration in tmpDeclarations" :key="declaration.id" :declaration="declaration" @qte-change="changeDeclarationQte($event, declaration)" />
    </div>
</template>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';
import DeclarationFormItem from './DeclarationFormItem.vue';
import { mapState } from 'vuex';

export default {
    props: {
        gta_declarations: Object,
    },

    data() {
        return {
            addInfos: false,
            tmpDeclarations: [],
            infosToAdd: {
                gta__codage_id: null,
                qte_retenue: null
            },
            error: {
                addInfos : null,
            }
        }
    },

    components: { AlertMessage, DeclarationFormItem },

    computed: {
        ...mapState(['gta_codages'])
    },

    methods: {
        /**
         * Ajout une nouvelle declaration a la list des déclarations
         * et reset l'object this.infosToAdd
         */
        actionAddInfos() {
            if(!this.infosToAdd.gta__codage_id || !this.infosToAdd.qte_retenue) {
                this.error.addInfos = true;
            } else {
                let key= Object.keys(this.tmpDeclarations).length;
                let copyobj = Object.assign({}, this.infosToAdd);

                copyobj['correction'] = 'OUI';
                copyobj['qte'] = copyobj['qte_retenue'];
                
                this.tmpDeclarations[key] = copyobj;
                
                this.infosToAdd.nom = null;
                this.infosToAdd.qte_retenue = null;
            }
        },

        /**
         * Met à jour la quantité retenue.
         * 
         * @param {Number} value Valeur à enregistrer
         * @param {Object} declaration Déclaration sur laquelle affecter la valeur
         */
        changeDeclarationQte(value, declaration) {
            declaration.qte_retenue = value;
        }
    },
    
    mounted() {
        this.tmpDeclarations = this.gta_declarations;

        this.tmpDeclarations.forEach(declaration => {
            if (declaration.qte_retenue === null || typeof declaration.qte_retenue === 'undefined' || declaration.qte_retenue === '') {
                declaration.qte_retenue = declaration.qte;
            }
        });
    }
}
</script>