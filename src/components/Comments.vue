<template>

    <div>
        <Comment from="Déclarant" v-for="note in ressource.notes" :key="'note-'+note.id"><div v-html="note.note__md" class="note-content"></div></Comment>
<!-- 
        <Comment form="N+1" v-if="StructureTempsDeclaration.commentaire_n1">{{StructureTempsDeclaration.commentaire_n1}}</Comment>

        <Comment form="RH" v-if="StructureTempsDeclaration.commentaire_rh">{{StructureTempsDeclaration.commentaire_rh}}</Comment> -->
    </div>

</template>

<style lang="scss">

.note-content {
    ul {
        list-style: none;
        margin:0px;
        padding:0px;
        font-size:0.8rem
    }
}


</style>


<script>
import Comment from './Comment.vue'

export default {
    props: {
        ressource: Object
    },

    components: {Comment}

    

}

</script>