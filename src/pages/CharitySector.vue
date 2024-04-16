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
  kpiData: Kpi[];

}

interface Kpi {
  title: string;
  value: string;
  subtitle: string;
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
        title: "Number of Charities ",
        value: "163,959",
        subtitle: "In the UK in 20/21"
      },
      {
        title: "Number of employees",
        value: "961,855",
        subtitle: "In the UK charity sector 20/21"
      },
      {
        title: "Number of months",
        value: "6.9",
        subtitle: "An average UK charity can operate on their reserves"
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
 
  <div class="ba bw0 " >
    
  
  <nav class="flex flex-wrap justify-between items-start bg-white mb0 w-100">
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/health">Health & Social</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/support">Support</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/context">Context</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/charity">Charity</router-link>
  <router-link class="f4 link dim ph3 pv2 mb2 dib white dark-purple-npc flex-auto w-100 w-auto-ns ba b--white" to="/explore">Explore</router-link>
</nav>
  
  <div id="card-container" class="flex flex-wrap justify-between items-stetch bg-white mb0 w-100">
    <div class="kpi-card" v-for="(kpi, index) in kpiData" :key="index">
      <div class="kpi-title">{{ kpi.title }}</div>
      <div class="f1 fw7 white">{{ kpi.value }}</div>
      <div class="kpi-subtitle">{{ kpi.subtitle }}</div>
      
    </div>
   
  </div>
  
  <iframe src='https://flo.uri.sh/visualisation/17325320/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17325320/?utm_source=embed&utm_campaign=visualisation/17325320' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
  <iframe src='https://flo.uri.sh/visualisation/17325536/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17325536/?utm_source=embed&utm_campaign=visualisation/17325536' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
  <iframe src='https://flo.uri.sh/visualisation/17325079/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17325079/?utm_source=embed&utm_campaign=visualisation/17325079' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
</div>


</template>

<style scoped>

.dashboard {
  display: grid;  
  grid-template-columns: 2fr;
  min-height: 80vh;
}

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

.twoCharts {
  display: flex;
  justify-content: space-around; 
  align-items: center; 
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