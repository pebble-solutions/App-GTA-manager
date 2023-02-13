<template>

    <div class="d-flex align-items-start text-muted" >
        <UserImage :name="note.login_pseudo" size="user-image-lg" className="me-2" />

        <i class="bi bi-circle-fill align-self-center mx-2"></i>

        <div class="w-100 d-flex justify-content-between">
            <div>
                <div>
                    Le {{ getDate(note.date) }} par <strong>{{ note.login_pseudo }}</strong> 
                </div>
                <div v-html="note.note__md" class="note-content mt-2"></div>
            </div>
        </div>
    </div>

 </template>

<script>

import UserImage from '../pebble-ui/UserImage.vue'

export default {
        props: {
            note: Object
        },

        methods: {

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
        },
        
        components: {UserImage}
}

</script>