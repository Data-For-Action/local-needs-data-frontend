<script lang="ts">
import Multiselect from 'vue-multiselect'
import api from '../components/client'
import { defineComponent } from 'vue'
import type { Components, Paths } from '../types/localneedsapi'
import { Line, Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import DashboardMap from '../components/DashboardMap.vue'

interface PossibleColumn {
  dataset: string
  columns: Components.Schemas.PotentialColumn[]
}

interface BaseComponentData {
  possible_columns: PossibleColumn[] | undefined
  possible_areas: Components.Schemas.PotentialFilter[] | undefined
  possible_times: Components.Schemas.PotentialFilter[] | undefined
  selected_columns: Components.Schemas.PotentialColumn[]
  selected_areas: Components.Schemas.PotentialFilter[]
  selected_times: Components.Schemas.PotentialFilter[]
  data: Components.Schemas.ChartData | null
  chart_type: Components.Schemas.DashboardType | null | 'measure_over_area_map'
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default defineComponent({
  name: 'DashboardView',
  components: {
    Multiselect,
    DashboardMap,
    LineChart: Line,
    BarChart: Bar
  },
  data() {
    return {
      possible_columns: [],
      possible_areas: [],
      possible_times: [],
      selected_columns: [],
      selected_areas: [],
      selected_times: [],
      data: null,
      chart_type: null
    } as BaseComponentData
  },
  methods: {
    fetchData() {
      api
        .then((client) => client.localneeds_api_dashboard_dashboard_prepare(this.queryParameters))
        .then((response) => {
          if (!response) {
            throw new Error('No response')
          }
          const data = response.data
          if (data.possible_areas) {
            this.possible_areas = data.possible_areas
          }
          if (data.possible_times) {
            this.possible_times = data.possible_times
          }
          if (data.possible_columns) {
            var possible_columns = new Map<number, PossibleColumn>()
            data.possible_columns.forEach((item) => {
              if (!possible_columns.has(item.dataset_id)) {
                possible_columns.set(item.dataset_id, {
                  dataset: item.dataset_name,
                  columns: []
                })
              }
              possible_columns.get(item.dataset_id)?.columns.push(item)
            })
            this.possible_columns = Array.from(possible_columns.values())
          }
          if (data.data) {
            this.data = data.data
          }
        })
    }
  },
  computed: {
    queryParameters() {
      var params = {
        areas: this.selected_areas.map((item) => item.id),
        times: this.selected_times.map((item) => item.id),
        columns: this.selected_columns.map((item) => item.id.toString())
      } as Paths.LocalneedsApiDashboardDashboardPrepare.QueryParameters
      if (this.chart_type) {
        if (this.chart_type == 'measure_over_area_map') {
          params.dashboard_type = 'measure_over_area'
        } else {
          params.dashboard_type = this.chart_type
        }
      }
      return params
    },
    chartOptions() {
      return {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    }
  },
  watch: {
    selected_columns: function () {
      this.fetchData()
    },
    selected_areas: function () {
      this.fetchData()
    },
    selected_times: function () {
      this.fetchData()
    },
    chart_type: function () {
      this.fetchData()
    }
  },
  mounted() {
    this.fetchData()
  }
})
</script>

<template>
  <div class="dashboard">
    <div class="">
      <div class="mb3">
        <h3>Chart type</h3>
        <label class="db mb1"
          ><input
            type="radio"
            id="line"
            name="chart_type"
            value="measure_over_time"
            v-model="chart_type"
          />
          Compare measures over time</label
        >
        <label class="db mb1"
          ><input
            type="radio"
            id="line"
            name="chart_type"
            value="area_over_time"
            v-model="chart_type"
          />
          Compare areas over time</label
        >
        <label class="db mb1"
          ><input
            type="radio"
            id="line"
            name="chart_type"
            value="measure_over_area"
            v-model="chart_type"
          />
          Compare measures by area (bar chart)</label
        >
        <label class="db mb1"
          ><input
            type="radio"
            id="line"
            name="chart_type"
            value="measure_over_area_map"
            v-model="chart_type"
          />
          Compare measures by area (map)</label
        >
      </div>
      <div class="mb3" v-if="chart_type">
        <Multiselect
          v-model="selected_columns"
          placeholder="Select columns"
          label="name"
          track-by="id"
          :options="possible_columns"
          :multiple="true"
          group-values="columns"
          group-label="dataset"
          :group-select="false"
        >
        </Multiselect>
      </div>
      <div class="mb3" v-if="possible_areas && possible_areas.length">
        <Multiselect
          v-model="selected_areas"
          placeholder="Select areas"
          label="name"
          track-by="id"
          :options="possible_areas"
          :multiple="true"
        >
        </Multiselect>
      </div>
      <div class="mb3" v-if="possible_times && possible_times.length">
        <Multiselect
          v-model="selected_times"
          placeholder="Select times"
          label="name"
          track-by="id"
          :options="possible_times"
          :multiple="true"
        >
        </Multiselect>
      </div>
    </div>
    <div class="">
      <div v-if="!data">
        <p>Select data values to display a chart</p>
      </div>
      <dashboard-map v-else-if="chart_type == 'measure_over_area_map'" :data="data"></dashboard-map>
      <bar-chart
        v-else-if="chart_type == 'measure_over_area'"
        :data="data"
        :options="chartOptions"
      />
      <line-chart v-else :data="data" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: 450px 1fr;
  min-height: 60vh;
}
</style>
