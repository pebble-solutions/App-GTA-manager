<template>
    <AppModal title="Modifier le pointage" :close-btn="true" :submit-btn="true" @modal-hide="routeToBack()">
        <div>
            <!-- <div>
                <div class="input-group">
                    <label>Misson :</label>
                    <select>
                        <option>Mission1</option>
                        <option>Mission2</option>
                        <option>Mission3</option>
                        <option>Mission4</option>
                    </select>
                </div>

                <div class="input-group">
                    <label>Projet :</label>
                    <select>
                        <option>Projet1</option>
                        <option>Projet2</option>
                        <option>Projet3</option>
                        <option>Projet4</option>
                    </select>
                </div>
            </div> -->

            <div>
                <div class="input-group mb-2">
                    <label>Date de début</label>
                    <div class="d-flex align-items-content">
                        <Datepicker class="pe-2" :enableTimePicker="false" position="left" readonly></Datepicker>
                        <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" required>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>

                <div class="input-group">
                    <label>Date de fin</label>
                    <div class="d-flex align-items-content">
                        <Datepicker class="pe-2" :enableTimePicker="false" position="left" :format="format" required></Datepicker>
                        <Datepicker class="ps-2" timePicker modeHeight="120" postion="right" required>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <h4>Pause</h4>
                    
                    <div>
                        <button class="btn btn-outline-primary btn-sm">
                            <i class="bi bi-plus-circle"></i>
                            Ajouter           
                        </button>
    
                        <button class="btn btn-outline-danger btn-sm">
                            <i class="bi bi-trash"></i>
                            Supprimer
                        </button>
                    </div>
                </div>

                <div class="py-2 d-flex justify-content-between align-items-center">
                    <div class="input-group justify-content-between align-items-center pe-2">
                        <label>Début de pause :</label>
                        <Datepicker :enableTimePicker="false" position="right" :format="format" required></Datepicker>
                    </div>

                    <div class="input-group justify-content-between align-items-center ps-2">
                        <label>Durée :</label>
                        <Datepicker timePicker modeHeight="120" postion="right" required>
                            <template #input-icon>
                                <i class="bi bi-clock px-2"></i>
                            </template>
                        </Datepicker>
                    </div>
                </div>
            </div>

            <hr>
            <div class="mt-2 d-flex justify-content-between align-items-center">
                <h4>Infos déclarées</h4>
                <!-- <router-link :to="{name: 'AddInfos'}" custom v-slot="{navigate, href}">
                    <a :href="href" @click="navigate" class="btn btn-outline-primary">
                        <i class="bi bi-plus-circle"></i>
                        Ajouter
                    </a>
                </router-link> -->
                <button v-if="!addInfos" type="button" class="btn btn-outline-primary btn-sm" @click="addInfos = !addInfos">
                    <i class="bi bi-plus-circle"></i>
                    Ajouter
                </button>
                <button v-else type="button" class="btn btn-outline-secondary btn-sm" @click="addInfos = !addInfos">
                    <i class="bi bi-x-circle"></i>
                    Annuler
                </button>
            </div>


            <div v-show="addInfos" class="py-2" >
                <div class="input-group" >
                    <select class="form-select" id="inputGroupSelect04" aria-label="Example select with button addon">
                        <option selected>Sélectionner...</option>
                        <option value="1">infos1</option>
                        <option value="2">infos2</option>
                        <option value="3">infos3</option>
                    </select>

                    <input type="number" class="form-control">

                    <button type="button" class="btn btn-success">
                        <i class="bi bi-check"></i>
                    </button>

                    <!-- AFFICHE LE BOUTON QUE SIL Y  A PLUS DE 1 ELEMENT DANS LE TABLEAU-->
                    <button type="button" class="btn btn-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>


            <!-- CREATION DUNE BOUCLE POUR CHAQUE ELEMENT-->
            <!-- CREER UNE FUNCTION POUR LES BUTTON + - , SI LA QTE = 0 ALORS LA LIGNE DISPARAIT -->
            <div class="py-2">
                <div class="border-dashed d-flex justify-content-between align-items-center my-2">
                    <label for="qt-row-1">Repas</label>

                    <div class="w-25">
                        <div class="input-group input-group-sm ms-auto">
                            <button type="button" class="btn btn-outline-secondary input-group-text">
                                <i class="bi bi-plus-lg"></i>
                            </button>

                            <input type="number" class="form-control" value="1" id="qt-row-1" >
    
                            <button type="button" class="btn btn-outline-secondary input-group-text">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="border-dashed d-flex justify-content-between align-items-center">
                    <label for="qt-row-1">Pime</label>

                    <div class="w-25">
                        <div class="input-group input-group-sm ms-auto">
                            <button type="button" class="btn btn-outline-secondary input-group-text">
                                <i class="bi bi-plus-lg"></i>
                            </button>
                            
                            <input type="number" class="form-control" value="1" id="qt-row-1" >
    
                            <button type="button" class="btn btn-outline-secondary input-group-text">
                                <i class="bi bi-dash-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </AppModal>
</template>

<style lang="scss">
    .infosValue {
        width:50px;
    }
</style>

<script>
import AppModal from '@/components/pebble-ui/AppModal.vue'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {
    setup() {
        const format = (date) => {
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `Selected date is ${day}/${month}/${year}`;
        }

        return {
            format
        }
    },

    data() {
        return {
            addInfos: false,
        }
    },

    components: {
        AppModal,
        Datepicker
    },

    methods: {
        routeToBack() {
            this.$router.push({name:'Validation'})
        }
    },
}
</script>