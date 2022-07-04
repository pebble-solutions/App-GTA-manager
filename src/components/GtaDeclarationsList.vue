<template>
    <div :class="{'card border border-2': card}" v-if="getGtaDeclarationsNotEmpty.length > 0 || card">
        <div class="card-body" :class="{'py-1 pt-2': card}">
            <div class="fw-bold cursor-pointer" @click.stop="displayMoreInfosReport = !displayMoreInfosReport" >
                <div class="d-flex justify-content-between align-items-start border-top border-secondary">
                    <h3 class="fs-7 fw-bold" :class="{'mb-0': card}">
                        {{getGtaDeclarationsNotEmpty.length}} infos
                    </h3>
    
                    <i class="bi" :class="{'bi-chevron-double-up': displayMoreInfosReport, 'bi-chevron-double-down': !displayMoreInfosReport}" v-if="getGtaDeclarationsNotEmpty.length > 0"></i>  
                </div>
            </div>
    
            <transition name="slide">
                <ul class="px-0" v-if="displayMoreInfosReport && getGtaDeclarationsNotEmpty.length > 0">
                    <li class="d-flex justify-content-between align-items-start px-0 pb-0 border-dashed pt-2" v-for="declaration in getGtaDeclarationsNotEmpty" :key="'declaration-'+declaration.id">
                            <span class="text-start text-truncate" :title="getCodageNom(declaration.gta__codage_id)">{{getCodageNom(declaration.gta__codage_id)}}</span>
                            <span>{{declaration.qte}}</span>
                    </li>
                </ul>
            </transition>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        gta_declarations: Object,
        gta_codages: Object,
        card: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            displayMoreInfosReport : false
        }
    },

    computed: {
        /**
         * Filtre gta_declarations pour n'avoir que ce avec un qte superieur a 0
         * 
         * @return {Object}
         */
        getGtaDeclarationsNotEmpty() {
            let notEmpty = this.gta_declarations.filter((e) => e.qte > 0);
            return notEmpty
        },
    },

    methods: {
        /**
         * Récupère le gta_codages voulu et renvoi le nom 
         * 
         * @param {Number} id 
         * 
         * @return {String}
         */
        getCodageNom(id) {
            let gtaCodage = this.gta_codages.find((e) => e.id === id);

            return gtaCodage.nom;
        }
    },
}
</script>