<template>

    <div class="d-flex align-items-start" >
        <UserImage :name="note.login_pseudo" size="user-image-lg" className="me-2" />

        <form class="w-100" v-if="modifiable == note.id && !showDetails" @submit.prevent="modifierCommentaire(note.id)" >
        
            <EditNote 
                v-model:commentValue="commentValue"
                v-model:confValue="confValue"
                :pending="pending.comm"
                @cancel="modifiable = null"
            />

        </form>

        <div class="w-100 d-flex justify-content-between" v-else>
            <div>
                <div :class="{'text-primary': note.isMine, 'text-muted' : !note.isMine }">
                    <i class="bi bi-eye-slash-fill mx-2" title="Commentaire confidentiel" v-if="note.confidentielle == 'OUI'"></i>
                    Le {{ getDate(note.date) }} par <strong>{{ note.login_pseudo }}</strong> 
                </div>
                <div class="text-muted font-italic fs-7 fw-light" v-if="note.dm != note.dc" > 
                    <i> Modifié le {{ getDate(note.dm) }} </i>
                </div>
                <div v-html="note.note__md" class="note-content"></div>
            </div>
            <button class="btn btn-sm" @click.prevent="modifAction(note)" title="Modifier le commentaire" v-if="note.isMine"> <i class="bi bi-pen-fill"></i></button>
       </div>
    </div>

 </template>

<script>

import UserImage from '../pebble-ui/UserImage.vue'
import { mapActions } from 'vuex';
import EditNote from './NoteForm.vue';

export default {
        props: {
            note: Object,
            periode_id:Number,
        },

        data() {
            return {
                modifiable: null,
                showDetails: false,
                commentValue: null,
                confValue: false,
                pending: {
                    comm: false
                }
            };
        },

        watch: {
            showDetails(newVal) {
                if (newVal == false) {
                    this.commentValue = null;
                }
            }
        },

        methods: {

            ...mapActions(['updatePeriodeNotes']),

            /**
             * Modifie un commentaire a partir de la requette d'API
             * 
             * @param {number} id
             */
            modifierCommentaire(id) {
                let confidentiel = "NON";
                if (this.confValue == true) {
                    confidentiel = "OUI";
                }
                this.pending.comm = true;
                this.$app.apiPost("gtaPeriode/POST/" + this.periode_id + "/note/" + id, {
                    note: this.commentValue,
                    confidentielle: confidentiel,
                }).then((note) => {
                    this.updatePeriodeNotes([note]);
                }).catch(this.$app.catchError)
                .finally(() => {
                    this.pending.comm = false;
                    this.modifiable = null;
                });
            },

            /**
             * Retourne la date lisible pour l'affichage
             * 
             * @param {Date} currentDate  Sql Date
             */
            getDate(currentDate){
                let dd = currentDate.slice(8,10);
                let mm = currentDate.slice(5,7);
                let yyyy = currentDate.slice(0,4);
                return dd + '/' + mm + '/' + yyyy
            },

            /**
             * Change les valeurs pour la modification 
             * 
             * @param {Object} note 
             */
            modifAction(note){
                this.modifiable = note.id;
                this.commentValue = note.note;
                this.confidentielle = note.confidentielle;

                if (note.confidentielle == "OUI") {
                    this.confValue = true;
                }else {
                    this.confValue = false;
                }
            }
        },
        
        components: {UserImage, EditNote}
}

</script>