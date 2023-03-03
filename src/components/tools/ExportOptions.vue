<template>
    
    <div class="row gx-3 mb-3 bg-light py-2 rounded" v-if="this.$route.path == '/export'">
        <div class="col">
            <label for="export_dd" class="form-label">Date de début</label>
            <input type="date" class="form-control" id="export_dd" v-model="query.dd" required>
        </div>

        <div class="col"> 
            <label for="export_df" class="form-label">Date de fin</label>
            <input type="date" class="form-control" id="export_df" v-model="query.df" required>
        </div>
    </div>

    <div class="mb-3">
        <label for="export_type" class="form-label">Type d'export</label>
        <select name="type" id="export_type" class="form-select" v-model="query.type">
            <option value="group">Export groupé des compteurs</option>
            <option value="list">Export des déclarations en liste</option>
        </select>
    </div>

    <div class="mb-3">
        <label for="export_structure__personnel_id" class="form-label">Personnel</label>
        <input name="structure__personnel_id" type="text" id="export_structure__personnel_id" class="form-control" :value="personnelName" v-if="preSelected.includes('structure__personnel_id')" readonly>

        <select name="structure__personnel_id" id="export_structure__personnel_id" class="form-select" v-model="query.structure__personnel_id" v-else>
            <option :value="0">Tous</option>
            <option :value="personnel.id" v-for="personnel in personnels" :key="personnel.id">{{ personnel.cache_nom }}</option>
        </select>
    </div>

    <div class="accordion accordion-flush" id="exportOptions_ConfigPanel">
        <div class="accordion-item">
            <h3 class="accordion-header" id="exportOptions_ConfigPanel-headingOne">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#exportOptions_ConfigPanel-collapseOne" aria-expanded="true" aria-controls="exportOptions_ConfigPanel-collapseOne">
                    Options d'export
                </button>
            </h3>
            <div id="exportOptions_ConfigPanel-collapseOne" class="accordion-collapse collapse" aria-labelledby="exportOptions_ConfigPanel-headingOne">
                <div class="accordion-body">

                    <div class="row mb-3 py-2 bg-light rounded">
                        <div class="col">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" :value="1" id="generate_undefined_code" name="generate_undefined_code" v-model="query.generate_undefined_code">
                                <label class="form-check-label" for="generate_undefined_code">Auto-générer les codes sans libellé
                                    <br><span class="fs-7 text-secondary">Matrice : {{ query.undefined_prefix }}[ID]</span>
                                </label>
                            </div>
                        </div>
                
                        <div class="col" v-if="query.generate_undefined_code">
                            <label for="undefined_prefix" class="form-label">Préfix des codes auto</label>
                            <input type="text" class="form-control" id="undefined_prefix" v-model="query.undefined_prefix">
                        </div>
                    </div>
                
                    <div class="form-check mb-3" v-if="query.type == 'list'">
                        <input class="form-check-input" type="checkbox" :value="1" id="zero_val" name="zero_val" v-model="query.zero_val">
                        <label class="form-check-label" for="zero_val">
                            Inclure les valeurs à 0<br>
                            <span class="text-secondary fs-7">Les déclarations dont la quantité est à 0 ou vide sont affichés dans l'extraction.</span>
                        </label>
                    </div>
                
                    <div class="mb-3">
                        <label class="form-label">Séparateur de décimale</label>
                        <div class="d-flex">
                            <input type="radio" class="btn-check" name="decimal_separator" id="decimal_separator-dot" value="." v-model="query.decimal_separator">
                            <label class="btn btn-outline-primary rounded-start rounded-0 w-50" for="decimal_separator-dot">Point (ex : 1.50)</label>
                            <input type="radio" class="btn-check" name="decimal_separator" id="decimal_separator-com" value="," v-model="query.decimal_separator">
                            <label class="btn btn-outline-primary rounded-end rounded-0 w-50" for="decimal_separator-com">Virgule (ex : 1,50)</label>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>

</template>

<script>
import { mapState } from 'vuex';

export default {
    data(){
        return{ 
            query: { },
            preSelected: []
        }
    },
    props: {
        dd: String,
        df: String,
        type: String,
        structure__personnel_id: Number,
        zero_val: Boolean,
        generate_undefined_code: Boolean,
        undefined_prefix: String,
        decimal_separator: String
    },

    emits: ['update:dd', 'update:df', 'update:type', 'update:structure__personnel_id', 'update:zero_val', 
        'update:generate_undefined_code', 'update:undefined_prefix', 'update:decimal_separator'],

    computed: {
        ...mapState(['personnels']),

        /** 
         * Récupère le nom du personnel pré-sélectionné au niveau du store.
         */
         personnelName() {
            let personnel = this.personnels.find(e => e.id == this.query.structure__personnel_id);
            return personnel ? personnel.cache_nom : "";
        },
    },

    watch: {
        /**
         * À chaque modification des valeurs du formulaire, les informations sont envoyées
         * par événement à l'élément parent.
         */
        query: {
            handler(newVal) {
                for (const key in newVal) {
                    this.changeVal(key, newVal[key]);
                }
            },
            deep: true
        }
    },

    methods: {
        /**
         * Met à jour une valeur du formulaire
         * 
         * @param {string} key Nom de la propriéter à muter
         * @param {mixed} val Valeur à appliquer
         */
        changeVal(key, val) {
            this.$emit('update:'+key, val);
        },

        /**
         * Intialise les valeurs du formulaire
         */
        initValues() {

            const watchPresel = ['structure__personnel_id'];

            watchPresel.forEach((key) => {
                if (this[key]) {
                    this.preSelected.push(key);
                }
            });

            this.query = {
                dd: this.dd,
                df: this.df,
                type: this.type,
                structure__personnel_id: this.structure__personnel_id,
                zero_val: this.zero_val,
                generate_undefined_code: this.generate_undefined_code,
                undefined_prefix: this.undefined_prefix,
                decimal_separator: this.decimal_separator
            };
        }
    },
    
    mounted() {
        this.initValues();
    }
}

</script>