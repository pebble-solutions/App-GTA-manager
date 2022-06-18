<template>
    <AppModal title="Ajouter une information à déclarées">
        <div class="input-group" >
            <select class="form-control">
                <option>Selectionner</option>
                <option>Info1</option>
                <option>Info2</option>
                <option>Info3</option>
                <option>Info4</option>
            </select>
            <input type="text" class="form-control">

            <button type="button" class="btn btn-success ">
                <i class="bi bi-check"></i>
            </button>
        </div>

        <button type="button" class="btn btn-outline-primary">
            <i class="bi bi-plus-circle"></i>
            Autres déclarations
        </button>
    </AppModal>
</template>

<script>
import AppModal from './pebble-ui/AppModal.vue'

export default {
    component: {
        AppModal
    }
}
</script>