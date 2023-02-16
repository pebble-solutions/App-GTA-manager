<template>

    <div class="d-flex align-items-start" >
        <UserImage :name="note.login_pseudo" className="me-3" />
        
        <EditNote 
            :commentValue="note.note"
            :confidentielleValue="note.confidentielle"
            :id-note="note.id"
            :periode="periode"

            @cancel="modifiable = null"
            @sent="modifiable = null"

            v-if="modifiable == note.id"
        />

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
import EditNote from './NoteForm.vue';

export default {
        props: {
            note: Object,
            periode:Object,
        },

        data() {
            return {
                modifiable: null
            };
        },

        methods: {

            /**
             * Retourne la date lisible pour l'affichage
             * 
             * @param {Date} currentDate  Sql Date
             */
            getDate(currentDate) {

                if (!currentDate) return 'Sans date';
                
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
            }
        },
        
        components: {UserImage, EditNote}
}

</script>