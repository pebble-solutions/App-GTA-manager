<template>
    <form @submit.prevent="send()">
        <div class="mb-3">
            <label for="FCT-Comm" class="form-label">Votre commentaire</label>
            <textarea class="form-control" id="FCT-Comm" rows="3" placeholder="Ecrivez ici ..." v-model="commentaire" required></textarea>
        </div>

        <div class="form-check form-switch mb-3">
            <input class="form-check-input" type="checkbox" id="checkbox" role="switch" v-model="confidentielle" />
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
            <button class="btn btn-primary" type="submit" :disabled="pending.note">
                <span class="spinner-border spinner-border-sm" v-if="pending.note"></span>
                <i class="bi bi-check" v-else></i>
                Valider
            </button>
        </div>
    </form>
</template>


<script>
import { mapActions } from 'vuex';

export default {
    props: {
        commentValue : String,
        confidentielleValue: [Boolean, String],
        idNote: Number,
        periode: Object
    },
    data() {
        return{
            commentaire: null,
            confidentielle: 0,
            pending: {
                note: false
            }
        }
    },
    
    emits: ['update:commentValue', 'update:confValue', 'cancel', 'sent'],

    methods: {

        ...mapActions(['updatePeriodeNotes']),

         /**
         * Met à jour une valeur du formulaire
         * 
         * @param {string} key Nom de la propriéter à muter
         * @param {mixed} val Valeur à affecter à la variable
         */
        changeVal(key, val) {
            this.$emit('update:'+key, val);
        },

        /**
         * Modifie un commentaire a partir de la requette d'API
         */
        send() {
            this.pending.note = true;
            this.$app.apiPost("gtaPeriode/POST/" + this.periode.id + "/note/" + this.idNote, {
                note: this.commentaire,
                confidentielle: this.confidentielle ? 1 : 0
            }).then((note) => {
                this.updatePeriodeNotes([note]);
                this.$emit("sent", note);
            }).catch(this.$app.catchError)
            .finally(() => this.pending.note = false);
        },

    },

    mounted() {
        this.commentaire = this.commentValue;
        this.confidentielle = this.confidentielleValue === "OUI" || this.confidentielleValue === true || this.confidentielleValue === 1 ? true : false;
    }
}

</script>