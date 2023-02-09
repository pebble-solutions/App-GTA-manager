<template>

    <div>
        <form v-if="createForm" @submit.prevent="createCommentaire()">
            <EditNote 
                v-model:commentValue="commentValue"
                v-model:confValue="confValue"
                :pending="pending.comm"
                @cancel="createForm = !createForm"
            />

        </form>

        <div class="d-grid gap-2 col-6 mx-auto" v-else>
            <button class="btn btn-primary" type="button" @click.prevent="createForm = !createForm" > + Nouveau</button>
        </div>

    </div>

    <hr v-if="notes.length"/>

    <div class=" list-group list-group-flush container">
        <div v-for="note in notes" :key="'note-'+note.id" class="list-group-item" :class="getNoteClass(note)">
            <Comment :note="note" :periode_id="this.periode.id"/>
        </div> 
    </div>

</template>


<script>

import { mapActions } from 'vuex';
import Comment from './Comment.vue';
import EditNote from './NoteForm.vue';

export default {
    props: {
        periode: Object
    },

    data() {
        return {
            createForm: false,
            commentValue: null,
            confValue:false,
            pending: {
                comm: false
            }
        };
    },

    computed: {
        /**
         * Retourne la liste des notes de la période passée en props
         * @return {Array}
         */
        notes() {
            return this.periode.notes;
        }
    },

    watch: {
        createForm(newVal) {
            if (newVal == false) {
                this.commentValue = null;
            }
        },
        confValue(newVal) {
            if(newVal === false){
                this.confValue="NON";
            }
        }
    },

    methods: {

        ...mapActions(['updatePeriodeNotes']),

        /**
         * Créer un nouveau commentaire a partir de la requette d'API
         *
         */
         createCommentaire() {
            let confidentiel = "NON";
            if (this.confValue == true) {
                confidentiel = "OUI";
            }
            this.pending.comm = true;
            this.$app.apiPost("gtaPeriode/POST/" + this.periode.id + "/note", {
                note: this.commentValue,
                confidentielle: confidentiel,
            }).then((note) => {
                this.updatePeriodeNotes([note]);
            }).catch(this.$app.catchError)
            .finally(() => {
                this.pending.comm = false;
                this.createForm = !this.createForm;
            });
        },

        /**
         * Retourne la liste des classe cssen fonction de l'etat de la note
         * 
         * @param {object} note 
         * 
         * @return {string}
         */
        getNoteClass(note) {
            let className = '';
            if (note.isMine) {
                className += 'bg-primary text-dark bg-opacity-10';
            }
            return className
        }

    },
    components: {Comment, EditNote}
}

</script>