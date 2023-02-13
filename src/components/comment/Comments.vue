<template>

    <div>
        <EditNote 
            :id-note="0"
            :periode="periode"

            @cancel="exitForm()"
            @sent="exitForm()"

            v-if="createForm"
        />

        <div class="d-grid gap-2 col-6 mx-auto" v-else>
            <button class="btn btn-primary" type="button" @click.prevent="createForm = !createForm" > + Nouveau</button>
        </div>

    </div>

    <hr v-if="notes.length"/>

    <div class=" list-group list-group-flush container">
        <div v-for="note in notes" :key="'note-'+note.id" class="list-group-item" :class="getNoteClass(note)">
            <CommentNote :note="note" v-if="note.type === 'note'"/>
            <Comment :note="note" :periode="periode" v-else/>
        </div> 
    </div>

</template>


<script>

import Comment from './Comment.vue';
import EditNote from './NoteForm.vue';
import CommentNote from './CommentNote.vue';

export default {
    props: {
        periode: Object
    },

    data() {
        return {
            createForm: false,
        }
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

    methods: {

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
                if (note.type !== 'note') {
                    className += 'bg-primary text-dark bg-opacity-10';
                }
            }
            return className
        },

        /**
         * Ferme le formulaire d'ajout de commentaire
         */
        exitForm() {
            this.createForm = false;
        }

    },
    components: {Comment, EditNote, CommentNote}
}

</script>