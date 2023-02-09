<template>
    <div class="d-grid my-2">
        <router-link :to="'/week/'+$route.params.id+'/periode/'+periode.id+'/comments'" v-slot="{href, navigate}" custom>
            <a :href="href" @click="navigate" class="btn btn-sm btn-light">
                <span v-if="hasComment" class="text-primary">
                    <i class="bi bi-chat-fill"></i> {{ nbComm }}
                    <template v-if="nbComm > 1"> Commentaires </template>
                    <template v-else> Commentaire</template>
            </span>
            <template v-else> <i class="bi bi-chat me-1"></i> Commentaire</template> 
            </a>
        </router-link>
    </div>

</template>

<script>

export default {
    props:{
        periode: Object,
    },

    data() {
        return {
            hasComment: null,
            nbComm: null,
        };
    },

    methods: {

        /**
         * Recupere de l'API un tableau de commentaire
         *
         */
         getCommentaire() {
            if(this.periode.notes.length){
                this.hasComment = true;
                this.nbComm = this.periode.notes.length;
            }else{
                this.hasComment = false;
            }
        },
        
    },

    updated() {
        this.getCommentaire();
    },

    mounted() {
        this.getCommentaire();
    }
}

</script>