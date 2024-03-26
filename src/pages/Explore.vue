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
      kpiData: [
      {
        title: "Spend on Health and Social Care ",
        value: "£28.3m",
        subtitle: "Total Spend on Adult Social Care in England 2022-23 "
      },
      {
        title: "Grants to Voluntary Organisations",
        value: "£200k",
        subtitle: "Grants to Voluntary Organisations via LA for Health and Social Care"
      },
      {
        title: "Requests for Support ",
        value: "611k",
        subtitle: "Number of requests for support received from new clients	18-64 2022/23		"
      }
    ],
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
    }, 
   

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
  
    const primaryColorBg = '#C7215D';
    const secondaryColorBg = '#881866';
    const primaryColor = '#881866';
    const secondaryColor = '#dd35a5';
    

    return {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            drawBorder: true,
            color: '#808080', 
            lineWidth: 1
          },
          ticks: {
            color: primaryColor, 
            font: {
              size: 14,
            }
          }
        },
        x: {
          grid: {
            drawBorder: true,
            color: secondaryColorBg, 
            lineWidth: 1
          },
          ticks: {
            color: primaryColor, 
            font: {
              size: 14,
            }
          }
        }
      },
      plugins: {
        
        legend: {
          labels: {
            color: primaryColor, 
            font: {
              
              size: 12
            }
          }
        }
      },
      elements: {
        line: {
          borderColor: primaryColorBg, 
          borderWidth: 2,
          backgroundColor: secondaryColor, 
          fill: true, 
        },
        point: {
          backgroundColor: primaryColorBg, 
          borderColor: '#fff',
          borderWidth: 2,
          radius: 5
        },
        bar: {
          hoverBackgroundColor: secondaryColorBg, 
          borderColor: primaryColorBg, 
          borderWidth: 1,
        }
      }
    };
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
  
  <div class="tc ">
  
    <!-- Welcome Section -->
    <h3 class="tc f2"> Welcome to the Local Needs Insight tool </h3>
    <p>
      Here you will find curated data for you to explore and you will also find tools to create your own charts and maps
    </p>
  </div>

  <div class="ba bw1">
    <!-- Navigation Bar with Tachyons -->
    <nav class="flex flex-wrap justify-between items-start bg-white mb0 w-100">
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/health">Health & Social</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/support">Support</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="">Advice</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="">Link 4</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="">Explore</router-link>
</nav>



    <!-- Additional Information Section -->
    <article class="cf mt0">
    <div>
      <h1 class="f2 tc mt0 mb1 standard-purple-text "> Below you can explore other data within the Databank</h1>             
        <div class="">
      
    </div>
  </div>
  
</article>

  

    <!-- Dashboard Section -->
    
      <div class="mt0">
        <div class="tc">
          <!-- Chart Type Selection -->
          <h3 class = "f3 tc standard-purple-text">1. Select your Chart type</h3>
          <label class="db mb1 tc">
            <input type="radio" id="line" name="chart_type" value="measure_over_time" v-model="chart_type" />
            Compare measures over time
          </label>
          <label class="db mb1 tc">
            <input type="radio" id="line" name="chart_type" value="area_over_time" v-model="chart_type" />
            Compare areas over time
          </label>
          <label class="db mb1">
            <input type="radio" id="line" name="chart_type" value="measure_over_area" v-model="chart_type" />
            Compare measures by area (bar chart)
          </label>
          <label class="db mb1">
            <input type="radio" id="line" name="chart_type" value="measure_over_area_map" v-model="chart_type" />
            Compare measures by area (map)
          </label>
        </div>
        

        <!-- Multiselect Components for Chart Configuration -->
        <div class="mb3 pt4" v-if="chart_type">
          <h3 class = "f3 tc standard-purple-text">2. Select the data and filters for you chart</h3>
          <Multiselect v-model="selected_columns" placeholder="Select columns" label="name" track-by="id" :options="possible_columns" :multiple="true" group-values="columns" group-label="dataset" :group-select="false" />
        </div>
        <div class="mb3" v-if="possible_areas && possible_areas.length">
          <Multiselect v-model="selected_areas" placeholder="Select areas" label="name" track-by="id" :options="possible_areas" :multiple="true" />
        </div>
        <div class="mb3 property-text-heading" v-if="possible_times && possible_times.length">
          <Multiselect v-model="selected_times" placeholder="Select times" label="name" track-by="id" :options="possible_times" :multiple="true" />
        </div>
      </div>
      

      <!-- Chart Display Section -->
      
      <div class="pa3">
        <h3 class = "f3 tc standard-purple-text">3. Your chart is displayed here</h3>
        <div v-if="!data">
         
        </div>
        <dashboard-map v-else-if="chart_type == 'measure_over_area_map'" :data="data"></dashboard-map>
        <bar-chart v-else-if="chart_type == 'measure_over_area'" :data="data" :options="chartOptions" />
        <line-chart v-else :data="data" :options="chartOptions" />
      </div>
     
  </div> 
</template>


<style scoped>



@media (min-width: 641px) {
  .dashboard {
    grid-template-columns: 450px 1fr;
    
  }}

@media (max-width:640px) {
  .dashboard{
  display: flex;
  flex-direction: column;

  }
}

.kpi-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 auto;
  overflow: visible;
  width: 80%;
}

.kpi-card{
  flex-basis: 100%;
  margin: 10px;
  background-color: #662583 ; 
  color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  
}

@media (min-width: 641px) {
  .kpi-card {
    flex-basis: calc(33.333% - 20px); 
  }
}

@media (max-width: 640px) {
  .kpi-card {
    flex-basis: 100%;
    width: 60%;
  }
}



.flourish-embed-iframe {
  display: block; 
  width: 100%; 
  height: auto; 
}

@media (min-width: 641px) {
  .twoCharts {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .flourish-embed-iframe {
    flex-basis: 48%;
    height: 600px; /* Fixed height for larger screens */
  }
}

@media (max-width: 640px) {
  .twoCharts {
    flex-direction: column; 
  }
}

</style>
