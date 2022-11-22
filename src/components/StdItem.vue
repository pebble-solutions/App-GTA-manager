<template>
    <div>

        <div class="timeline">
            <div class="timeline-item fs-6"   v-if="StructureTempsDeclaration.dd != StructureTempsDeclaration.dd_finale">
                <span class="timeline-icon text-secondary"><i class="bi bi-exclamation-diamond"></i></span>
                <span class="timeline-label text-black-50" style="text-decoration : line-through">
                    {{dateToTime(StructureTempsDeclaration.dd)}}
                </span>
            </div>
            <div class="timeline-item fs-6">
                <span class="timeline-icon text-secondary"><i class="bi bi-stopwatch"></i></span>
                <span class="timeline-label">
                    {{time_start}}
                </span>
            </div>

            <div class="pb-3"></div>

            <div v-if="pause_start" class="timeline-item">
                <span class="timeline-icon text-secondary fs-6"><i class="bi bi-pause-fill"></i></span>
                <span class="timeline-label">{{pause_start}} <i class="bi bi-chevron-right"></i> {{pause_end}}</span>
            </div>

            <div v-if="pause_start" class="timeline-item mb-3">
                <span class="timeline-icon bg-transparent text-secondary"></span>
                <span class="timeline-label">{{pause_duration}}</span>
            </div>

            <div class="timeline-item fs-6"   v-if="StructureTempsDeclaration.df != StructureTempsDeclaration.df_finale">
                <span class="timeline-icon text-secondary"><i class="bi bi-exclamation-diamond"></i></span>
                <span class="timeline-label text-black-50" style="text-decoration : line-through">
                    {{dateToTime(StructureTempsDeclaration.df)}}
                </span>
            </div>
            <div class="timeline-item fs-6" :class="{'text-warning' : StructureTempsDeclaration.clock_status !=='over'}" >
                <span class="timeline-icon"><i class="bi bi-check2-circle"></i></span>
                <span class="timeline-label">{{time_end}}</span>
            </div>
        </div>

        <div class="my-3" v-if="hasComment">
            <Comment from="Déclarant" v-if="StructureTempsDeclaration.commentaire">{{StructureTempsDeclaration.commentaire}}</Comment>
    
            <Comment form="N+1" v-if="StructureTempsDeclaration.commentaire_n1">{{StructureTempsDeclaration.commentaire_n1}}</Comment>
    
            <Comment form="RH" v-if="StructureTempsDeclaration.commentaire_rh">{{StructureTempsDeclaration.commentaire_rh}}</Comment>
        </div>
    </div>
</template>

<style lang="scss" scoped>

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

import { sqlDateToIso, padTime, calculateDiffDate } from '../js/date'
import Comment from './Comment.vue';

export default {
    props: {
        StructureTempsDeclaration: Object
    },
    computed: {
        /**
         * Retourne l'heure de début de pointage H:MM
         * @return {string}
         */
        time_start() {
            return this.dateToTime(this.StructureTempsDeclaration.dd_finale);
        },

        /**
         * Retourne l'heure de fin de pointage H:MM
         * @return {string}
         */
        time_end() {
            let df = this.StructureTempsDeclaration.df_finale;
            return df ? this.dateToTime(df, this.StructureTempsDeclaration.dd_finale) : "En cours";
        },

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
            return df ? this.dateToTime(df, this.StructureTempsDeclaration.dd_finale) : "En cours";
        },

        /**
         * Retourne la durée de la pause H:MM
         * @return {string}
         */
        pause_duration() {
            let diff = calculateDiffDate(this.StructureTempsDeclaration.dpd_finale, this.StructureTempsDeclaration.dfp_finale);
            return diff;
        },

        /**
         * Contrôle si la déclaration a au minimum un commentaire.
         * 
         * @returns {boolean}
         */
        hasComment() {
            let std = this.StructureTempsDeclaration;
            return (std.commentaire && std.commentaire_n1 && std.commentaire_rh);
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
            let date = new Date(sqlDateToIso(val));
            let str = date.getHours() + ":" + padTime(date.getMinutes());
            if (refVal) {
                let refDate = new Date(sqlDateToIso(refVal));
                if (refDate.getDate() != date.getDate()) {
                    str = "J+1 " + str;
                }
            }
            return str;
        }
    },
    components: { Comment }
}
</script>