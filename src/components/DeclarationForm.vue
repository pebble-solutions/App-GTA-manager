<template>
    <div class="my-2">
        <div class="d-flex justify-content-between align-items-center">
            <h4 class="card-title">Déclarations</h4>

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
                <select class="form-select" id="inputGroupSelect04" v-model="newDeclaration.gta__codage_id" aria-label="Example select with button addon">
                    <option class="text-truncate" v-for="gta_codage in gta_codages" :key="'gtacodage-'+gta_codage.id" :value="gta_codage.id">
                        {{gta_codage.nom}}
                    </option>
                </select>

                <input type="number" class="form-control" @keydown.enter.prevent="addDeclaration()" v-model="newDeclaration.qte_retenue">

                <button type="button" class="btn btn-success" @click.prevent="addDeclaration()">
                    <i class="bi bi-check"></i>
                </button>
            </div>
        </div>

        <div class="list-group list-group-flush">
            <DeclarationFormItem v-for="declaration in gta_declarations" :key="declaration.id" :declaration="declaration" @qte-change="changeDeclarationQte($event, declaration)" />
        </div>
    </div>
</template>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';
import DeclarationFormItem from './DeclarationFormItem.vue';
import { mapState } from 'vuex';

export default {
    props: {
        gta_declarations: Array,
    },

    data() {
        return {
            addInfos: false,
            tmpDeclarations: [],
            newDeclaration: {
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
         * et reset l'object this.newDeclaration
         */
        addDeclaration() {
            if(!this.newDeclaration.gta__codage_id || !this.newDeclaration.qte_retenue) {
                this.error.addInfos = true;
            } else {
                let declaration = JSON.parse(JSON.stringify(this.newDeclaration));
                declaration.correction = 'OUI';
                declaration.qte = declaration.qte_retenue;

                this.$emit('add-declaration', declaration);
                
                this.newDeclaration.nom = null;
                this.newDeclaration.qte_retenue = null;
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
            declaration.correction = "OUI";
        }
    },
    
    mounted() {
        this.tmpDeclarations = this.gta_declarations;
    }
}
</script>