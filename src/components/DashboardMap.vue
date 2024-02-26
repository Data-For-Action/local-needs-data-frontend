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
    <l-geo-json
      :geojson="geoJsonWithData"
      :options="options"
      :options-style="styleFunction"
    ></l-geo-json>
    <l-control position="bottomleft" class="legend">
      <ul>
        <li v-for="(value, index) in legendValues" :style="{ backgroundColor: value }" :key="index">
          <span class="legend-value" v-if="index == 0">{{ minValue }}</span>
          <span class="legend-value" v-else-if="index == legendValues.length - 1">{{
            maxValue
          }}</span>
          <span class="legend-value" v-else></span>
        </li>
      </ul>
    </l-control>
  </l-map>
</template>
<script lang="ts">
import { LGeoJson, LMap, LControl } from '@vue-leaflet/vue-leaflet'
import type { StyleFunction } from '@vue-leaflet/vue-leaflet/components/geojson'
import type { Feature, FeatureCollection } from 'geojson'
import la_boundary from '../assets/data/uk_la_2023_buc.json'
import 'leaflet/dist/leaflet.css'
import { geoJson, LatLng } from 'leaflet/dist/leaflet-src.esm'
import { scaleLinear } from 'd3-scale'
import { interpolateViridis } from 'd3-scale-chromatic'
import { quantize } from 'd3-interpolate'

const BOUNDS = geoJson(la_boundary).getBounds()

interface BaseComponentData {
  zoom: number
  center: LatLng
  geojson: FeatureCollection
  bounds: LatLng[]
  maxBounds: LatLng[]
  url: string
  attribution: string
  fillColor: string
}

export default {
  components: {
    LMap,
    LGeoJson,
    LControl
  },
  props: {
    data: Object
  },
  data() {
    return {
      zoom: 5,
      center: LatLng(0, 0),
      geojson: la_boundary,
      bounds: BOUNDS,
      maxBounds: BOUNDS,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      fillColor: 'red'
    } as BaseComponentData
  },
  computed: {
    options() {
      return {
        onEachFeature: this.onEachFeatureFunction
      }
    },
    styleFunction(): StyleFunction {
      // https://leafletjs.com/examples/choropleth/
      return (item: Feature) => {
        var color = 'grey'
        if (item.properties && item.properties.value) {
          color = this.colorRamp(item.properties.value)
        }
        return {
          color: color,
          stroke: true,
          weight: 1,
          fillColor: color,
          fillOpacity: 1
        }
      }
    },
    featureData() {
      const dataUsed = this.data
      if (!dataUsed) return {}
      return Object.fromEntries(
        dataUsed.labels.map((label: string, index: number) => {
          return [label, dataUsed.datasets[0].data[index]]
        })
      )
    },
    onEachFeatureFunction() {
      return (feature: Feature, layer) => {
        if (!feature.properties) return
        var tooltip =
          '<div>Code:' +
          feature.properties.LAD23CD +
          '</div><div>Name: ' +
          feature.properties.LAD23NM +
          '</div>'
        if (feature.properties.value) {
          tooltip += '<div>Value: ' + feature.properties.value + '</div>'
        }
        layer.bindTooltip(tooltip, { permanent: false, sticky: true })
      }
    },
    geoJsonWithData() {
      var featureData = this.featureData
      var newGeojson: FeatureCollection = { ...this.geojson }
      newGeojson.features = newGeojson.features.map((feature) => {
        const newFeature = { ...feature }
        if (!feature.properties) return newFeature
        var name = feature.properties.LAD23NM
        var code = feature.properties.LAD23CD
        if (newFeature.properties && featureData[code]) {
          newFeature.properties['value'] = featureData[code]
        } else if (newFeature.properties && featureData[name]) {
          newFeature.properties['value'] = featureData[name]
        } else if (newFeature.properties) {
          newFeature.properties['value'] = NaN
        } else {
          newFeature.properties = { value: NaN }
        }
        return newFeature
      })
      return newGeojson
    },
    values() {
      return this.geoJsonWithData.features
        .filter(
          (feature) =>
            feature.properties &&
            typeof feature.properties.value === 'number' &&
            !isNaN(feature.properties.value)
        )
        .map((feature) => (feature.properties ? feature.properties.value : NaN))
    },
    minValue() {
      return Math.min(...this.values)
    },
    maxValue() {
      return Math.max(...this.values)
    },
    legendValues() {
      return quantize(interpolateViridis, 8).reverse()
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
    },
    colorRamp(value: number) {
      var func = scaleLinear().domain([this.maxValue, this.minValue])
      return interpolateViridis(func(value))
    }
  }
}
</script>

<style scoped>
.local-needs-leaflet-container {
  background: transparent;
  font-family: 'Roboto', sans-serif;
}

.legend {
  background: white;
  padding: 0px;
  margin: 20px;
  border-radius: 5px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
}
.legend ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: space-between;
}
.legend li {
  width: 20px;
  height: 20px;
  margin: 0;
  text-align: center;
}
.legend span {
  position: absolute;
  margin-top: -20px;
  text-align: center;
  transform: translate(-50%, -50%);
}
</style>
