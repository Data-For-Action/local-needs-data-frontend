<template>
  <l-map
    ref="map"
    v-model:zoom="zoom"
    :center="center"
    :use-global-leaflet="false"
    :bounds="bounds"
    :max-bounds="maxBounds"
    @ready="onMapReady"
    style="height: 100%; width: 100%"
    class="local-needs-leaflet-container"
  >
    <l-geo-json :geojson="geojson" :options="options" :options-style="styleFunction"></l-geo-json>
  </l-map>
</template>
<script lang="ts">
import { LGeoJson, LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import la_boundary from '../assets/data/uk_la_2023_buc.json'
import 'leaflet/dist/leaflet.css'
import { geoJson } from 'leaflet/dist/leaflet-src.esm'

const BOUNDS = geoJson(la_boundary).getBounds()

export default {
  components: {
    LMap,
    LGeoJson
  },
  props: {
    data: Object
  },
  data() {
    return {
      zoom: 5,
      center: [0, 0],
      geojson: la_boundary,
      bounds: BOUNDS,
      maxBounds: BOUNDS,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      fillColor: 'red'
    }
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      }
    },
    styleFunction() {
      const fillColor = this.fillColor // important! need touch fillColor in computed for re-calculate when change fillColor
      // https://leafletjs.com/examples/choropleth/
      return () => {
        return {
          color: 'red',
          stroke: true,
          weight: 1,
          fillColor: fillColor,
          fillOpacity: 1
        }
      }
    },
    onEachFeatureFunction() {
      console.log(this.data)
      return (feature, layer) => {
        layer.bindTooltip(
          '<div>Code:' +
            feature.properties.LAD23CD +
            '</div><div>Name: ' +
            feature.properties.LAD23NM +
            '</div>',
          { permanent: false, sticky: true }
        )
      }
    }
  },
  watch: {
    geojson() {
      this.$refs.map.leafletObject.fitBounds(this.bounds)
    }
  },
  methods: {
    onMapReady() {
      this.$refs.map.leafletObject.fitBounds(this.bounds)
    }
  }
}
</script>

<style scoped>
.local-needs-leaflet-container {
  background: transparent;
}
</style>
