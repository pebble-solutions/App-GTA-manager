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
                    <option class="text-truncate" v-for="gta_codage in gtaCodagesList" :key="'gtacodage-'+gta_codage.id" :value="gta_codage.id">
                        {{gta_codage.nom}}
                    </option>
                </select>

                <input type="number" class="form-control" v-model="infosToAdd.qte_retenue">

                <button type="button" class="btn btn-success" @click.prevent="actionAddInfos()">
                    <i class="bi bi-check"></i>
                </button>
            </div>
        </div>

        <div v-for="declaration in tmpDeclarations" :key="declaration.id">
            <div class="border-dashed d-flex justify-content-between align-items-center my-2" v-if="declaration.correction === null && declaration.qte != 0.00 || declaration.correction === 'OUI' && declaration.qte_retenue != 0.00 && declaration.qte_retenue !== null || declaration.corretion === 'NON' && declaration.qte != 0.00">
                <label for="qt-row-1 text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</label>

                <div class="sizeBoxQte">
                    <div class="input-group input-group-sm ms-auto">
                        <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('remove', declaration)">
                            <i class="bi bi-dash-lg"></i>
                        </button>
                        
                        <input type="text" class="form-control text-center" :value="declaration.qte_retenue ? declaration.qte_retenue : declaration.qte" id="qt-row-1" >

                        <button type="button" class="btn btn-outline-secondary input-group-text" @click.prevent="updateQte('add', declaration)">
                            <i class="bi bi-plus-lg"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .sizeBoxQte {
        width: 120px;
    }
</style>

<script>
import AlertMessage from '@/components/pebble-ui/AlertMessage.vue';

export default {
    props: {
        gta_declarations: Object,
        gta_codages: Object,
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
            },
            gtaCodagesList: null,
        }
    },

    components: {AlertMessage},

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
         * Retourn le nom du gta codages spécifique a son id
         * @param {integer} id l'id du gta codages recherché
         * 
         * @return {String}
         */
        getCodageNom(id) {
            let gtaCodage = this.gta_codages.find((e) => e.id === id);

            return gtaCodage.nom;
        },

        /**
         * Update the qte result of the declaration,
         * - add        ajout +1
         * - remove     remove -1
         * @param {Object} declaration 
         */
        updateQte(action, declaration) {
            if(action === "add") {
                declaration.qte_retenue ? declaration.qte_retenue++ : declaration.qte++;
            } else {
                declaration.qte_retenue ? declaration.qte_retenue-- : declaration.qte--;
            }
        },

        /***
         * Retourn toute la liste des gta codage
         * 
         * @return {Array}
         */
        getGtaCodagelist() {
            let apiUrl = "gtaCodage/GET/list";

            this.$app.apiGet(apiUrl, {})
            .then((data) => {
                this.gtaCodagesList = data;
            }).catch(this.$app.catchError);
        }
    },
    
    mounted() {
        this.tmpDeclarations = this.gta_declarations;

        this.getGtaCodagelist();
    }
}
</script>