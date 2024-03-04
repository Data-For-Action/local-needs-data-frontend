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
        subtitle: "Number of requests for support received from new clients	18-64 202/23		"
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
  <div class ="tc">
    <h3 class="tc"> Welcome to the Local Needs Dashboard. </h3>
      <p>Here you will find curated data for you to explore and you will also find tools to create your own charts and maps

      </p>
  </div>
  <div class="kpi-container">
    <div class="kpi-card" v-for="(kpi, index) in kpiData" :key="index">
      <div class="kpi-title">{{ kpi.title }}</div>
      <div class="kpi-value">{{ kpi.value }}</div>
      <div class="kpi-subtitle">{{ kpi.subtitle }}</div>
      
    </div>
   
  </div>
  <div class="save-container">
  <button class="save-button" @click="saveAsSvg(index)">Save as SVG</button>
</div>
<iframe src='https://flo.uri.sh/visualisation/17020685/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17020685/?utm_source=embed&utm_campaign=visualisation/17020685' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
<iframe src='https://flo.uri.sh/visualisation/17023723/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17023723/?utm_source=embed&utm_campaign=visualisation/17023723' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
<iframe src='https://flo.uri.sh/visualisation/17023803/embed' title='Interactive or visual content' class='flourish-embed-iframe' frameborder='0' scrolling='no' style='width:100%;height:600px;' sandbox='allow-same-origin allow-forms allow-scripts allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation'></iframe><div style='width:100%!;margin-top:4px!important;text-align:right!important;'><a class='flourish-credit' href='https://public.flourish.studio/visualisation/17023803/?utm_source=embed&utm_campaign=visualisation/17023803' target='_top' style='text-decoration:none!important'><img alt='Made with Flourish' src='https://public.flourish.studio/resources/made_with_flourish.svg' style='width:105px!important;height:16px!important;border:none!important;margin:0!important;'> </a></div>
<div class="twoCharts"></div>

<div>
<h1 class="property-text"> Below you can explore other data within the Databank</h1>
<h5> To create your own charts</h5>
<ol><li>Choose a chart type</li>
  <li>Select the dataset you would like to explore using the drop down</li>
  <li>Select either areas or times to explore using the further drop downs</li>


</ol>

</div>
  
  <div class="pa5 pt2 tc property-text">
  <h3> 
        Create your own charts and maps below
      </h3>
    </div>
  <div class="dashboard">
    
    <div class="pt1">
      <div class="property-text">
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
      <div class="mb3 pt4" v-if="chart_type">
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
    
    <div class="pa3">
      <div v-if="!data">
        <h3 class="standard-purple-text">&larr; Select chart type and dataset to display a chart</h3>
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
  min-height: 80vh;
}

@media (max-width:740px) {
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
  min-width: 1200px;
  width: 100%;
}

.kpi-card{
  flex-basis: calc(33.333% - 20px);
  margin: 10px;
  
  flex: 1; 
  margin: 10px; 
  background-color: var(--primary-color); 
  color: white;
  padding: 20px;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); 
  
}



@media (max-width: 740px) {
  .kpi-card {
    flex-basis: 100%;
  }
}

.twoCharts {
  display: flex;
  justify-content: space-around; 
  align-items: center; 
}

.flourish-embed-iframe {
  flex-basis: 48%; 
  height: 600px; 
}

@media (max-width: 768px) {
  .twoCharts {
    flex-direction: column; /* Stacks the charts vertically on smaller screens */
  }
}

</style>
