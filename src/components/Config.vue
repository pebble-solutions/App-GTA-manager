<template>

    <div class="row">
        <div class="col-3">
            <div class="list-group list-group-flush">
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'gta'}" @click.prevent="tab = 'gta'"><i class="bi bi-clock"></i> Gestion des temps</a>
                <a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'gta_time_control'}" @click.prevent="tab = 'gta_time_control'"><i class="bi bi-stopwatch"></i> Pointages</a>
                <!--<a href="#" class="list-group-item list-group-item-action" :class="{'active': tab == 'solidarite'}" @click.prevent="tab = 'solidarite'"><i class="bi bi-calendar-heart"></i> Journée solidarité</a> -->
            </div>
        </div>
        <div class="col border-left">
            <config-gta v-if="tab == 'gta'"></config-gta>
            <config-gta-time-control v-else-if="tab == 'gta_time_control'"></config-gta-time-control>
        </div>
    </div>
    
    
</template>

<script>
import ConfigGta from './ConfigGta.vue'
import ConfigGtaTimeControl from './ConfigGtaTimeControl.vue'

export default {
    data() {
        return {
            tab: 'gta'
        }
    },

    components: { ConfigGta, ConfigGtaTimeControl },
}
</script>
