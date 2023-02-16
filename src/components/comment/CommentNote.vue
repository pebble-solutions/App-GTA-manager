<template>

    <div class="d-flex align-items-start text-muted comment-note">
        <!--<UserImage :name="note.login_pseudo" className="me-2" />-->

        <span class="comment-note-icon">
            <i class="bi bi-card-text me-4 ms-2"></i>
        </span>

        <div class="w-100  fs-7">
            <div>
                Le {{ getDate(note.date) }} par <strong>{{ note.login_pseudo }}</strong> 
            </div>
            <div v-html="note.note__md" class="note-content"></div>
        </div>
    </div>

</template>

<style lang="scss">
.note-content {
    p:last-child {
        margin-bottom: 0px;
    }
}

.comment-note {
    position:relative;
}

.comment-note::before {
    z-index: 1;
    position:absolute;
    content: '';
    top: 0px;
    bottom: 0px;
    left: 15px;
    border-right: 1px dashed rgb(200,200,200);
}

.comment-note-icon {
    z-index:5;
    background-color: white;
}
</style>

<script>

//import UserImage from '../pebble-ui/UserImage.vue'

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
            getDate(currentDate) {
                if (!currentDate) return "Sans date";
                let dd = currentDate.slice(8,10);
                let mm = currentDate.slice(5,7);
                let yyyy = currentDate.slice(0,4);
                return dd + '/' + mm + '/' + yyyy
            },
        },
        
        //components: {UserImage}
}

</script>