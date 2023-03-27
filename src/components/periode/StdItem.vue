<template>
    <div>
        <!-- 
            Cette partie du code semble être un test de Jules.
            Je me suis permis de commenter afin que ça ne s'affiche pas en prod.
            Guillaume.
        <div class="alert alert-primary text-center" v-if="StdDiff">
            {{ StdDiff.true }}
        </div> -->
        <div class="timeline">

            <timeline-item
                :date_origin="StructureTempsDeclaration.dd"
                :date_finale="StructureTempsDeclaration.dd_finale"
                :date_record="StructureTempsDeclaration.dd_record"
            />

            <div class="pb-3"></div>

            <div v-if="pause_start" class="timeline-item">
                <span class="timeline-icon text-secondary fs-6"><i class="bi bi-pause-fill"></i></span>
                <span class="timeline-label">{{pause_start}} <i class="bi bi-chevron-right"></i> {{pause_end}}</span>
            </div>

            <div v-if="pause_start" class="timeline-item mb-3">
                <span class="timeline-icon bg-transparent text-secondary"></span>
                <span class="timeline-label">{{pause_duration}}</span>
            </div>

            <timeline-item
                :date_origin="StructureTempsDeclaration.df"
                :date_finale="StructureTempsDeclaration.df_finale"
                :date_record="StructureTempsDeclaration.df_record"
                :ref_origin="StructureTempsDeclaration.dd"
                :ref_finale="StructureTempsDeclaration.dd_finale"
                :ref_record="StructureTempsDeclaration.dd_record"
                :clock_status="StructureTempsDeclaration.clock_status"
            />
        </div>
    </div>
</template>

<style lang="scss">

.timeline {
    position:relative;
    text-align: left;
    z-index: 4;
}

.timeline:before {
    content: "";
    position:absolute;
    left:8px;
    top:6px;
    bottom:6px;
    border-left:1px dashed lightgray;
}

.timeline-item {
    display: flex;
    align-items: center ;
    position:relative;
    z-index: 5;
}

.timeline-icon {
    width:18px;
    height:18px;
    line-height: 18px;
    text-align: center;
    background-color:white;
    margin-right:8px;
}

</style>

<script>

import { calculateDiffDate, dateToTime } from '../../js/date'
import TimelineItem from './TimelineItem.vue';

export default {

    components: { TimelineItem },

    data() {
        return {
            MODULE_PAIE_DATE_DELTA_WARNING: 15
        };
    },

    props: {
        StructureTempsDeclaration: Object
    },

    computed: {

        /**
         * Retourne l'heure de début de pause H:MM
         * @return {string|null}
         */
        pause_start() {
            let dd = this.StructureTempsDeclaration.dpd_finale;
            return dd ? this.dateToTime(dd, this.StructureTempsDeclaration.dd_finale) : null;
        },

        /**
         * Retourne l'heure de fin de pause H:MM
         * @return {string|null}
         */
        pause_end() {
            let df = this.StructureTempsDeclaration.dfp_finale;
            return df ? this.dateToTime(df, this.StructureTempsDeclaration.dpd_finale) : "En cours";
        },

        /**
         * Retourne la durée de la pause H:MM
         * @return {string}
         */
        pause_duration() {
            let diff = calculateDiffDate(this.StructureTempsDeclaration.dpd_finale, this.StructureTempsDeclaration.dfp_finale);
            return diff;
        }, 

        StdDiff() {
            let dd = new Date(this.StructureTempsDeclaration.dd)
            let dd_finale = new Date(this.StructureTempsDeclaration.dd_finale)
            let df = new Date(this.StructureTempsDeclaration.df)
            let df_finale = new Date(this.StructureTempsDeclaration.df_finale)

            if ((dd_finale.valueOf() - dd.valueOf()) > (this.MODULE_PAIE_DATE_DELTA_WARNING * 60000)) {
                return {true : this.StructureTempsDeclaration.dd_finale.slice(10)}
            } else if ((df_finale.valueOf() - df.valueOf()) > (this.MODULE_PAIE_DATE_DELTA_WARNING * 60000)) {
                return {true : this.StructureTempsDeclaration.df_finale.slice(10)}
            } else {
                return false
            }
        }
    },
    methods: {
        
        /**
         * Retourne la date SQL au format H:MM ou J+1 H:MM.
         *
         * @param {string} val La date à convertir
         * @param {string} refVal La valeur précédente (pour avoir le J+1 sur la date de fin)
         *
         * @return {string}
         */
        dateToTime(val, refVal) {
            return dateToTime(val, refVal);
        }
    },
}
</script>