<template>
    <div class="mb-3">
        <label for="FCT-Comm" class="form-label">Votre commentaire</label>
        <textarea class="form-control" id="FCT-Comm" rows="3" placeholder="Ecrivez ici ..." :value="commentValue" @change="changeVal('commentValue', $event)" required></textarea>
    </div>

    <div class="form-check form-switch mb-3">
        <input class="form-check-input" type="checkbox" id="checkbox" role="switch" v-model="ConfidentialValue" @change="$emit('update:confValue',ConfidentialValue)"/>
        <label class="form-check-label" for="checkbox">Commentaire interne
            <br>
            <small class="text-muted">
                Seul les utilisateurs accédant à l’application manager et les responsables d’équipes pourront consulter ce commentaire.
            </small>
        </label>
    </div>
    <div class="d-flex">
        <button class="btn btn-light me-2" type="button" @click.prevent="$emit('cancel')">
            Annuler
        </button>
        <button class="btn btn-primary" type="submit" :disabled="pending">
            <span class="spinner-border spinner-border-sm" v-if="pending"></span>
            <i class="bi bi-check" v-else></i>
            Valider
        </button>
    </div>

</template>


<script>

export default {
    props: {
        commentValue : String,
        confValue: Boolean,
        pending: Boolean,
    },
    data(){
        return{
            ConfidentialValue: false,
        }
    },
    
    emits: ['update:commentValue', 'update:confValue', 'cancel'],

    methods: {

         /**
         * Met à jour une valeur du formulaire
         * 
         * @param {string} key Nom de la propriéter à muter
         * @param {object} event Événement déclencheur contenant target.value
         */
         changeVal(key, event) {
            this.$emit('update:'+key, event.target.value);
        },

    },

    mounted(){
        this.ConfidentialValue = this.confValue
    }
}

</script>