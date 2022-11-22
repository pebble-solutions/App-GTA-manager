<template>

    <div class="row">
        <div class="col-3">
            <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'gta'}" @click.prevent="tab = 'gta'"><i class="bi bi-clock"></i> Gestion des temps</a>
                <!-- <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'break'}" @click.prevent="tab = 'break'"><i class="bi bi-pause-fill"></i> Pauses</a>
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'solidarite'}" @click.prevent="tab = 'solidarite'"><i class="bi bi-calendar-heart"></i> Journée solidarité</a> -->
            </div>
        </div>
        <div class="col border-left">
            <config-gta v-if="tab == 'gta'"></config-gta>
        </div>
    </div>
    
    
</template>

<script>
import ConfigGta from './ConfigGta.vue'

export default {
    data() {
        return {
            tab: 'gta'
        }
    },

    components: { ConfigGta },
}
</script>
