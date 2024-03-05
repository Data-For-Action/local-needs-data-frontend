<template>
  <section class="mw100 mw100-ns center pl3 pa2 ph5-ns">
        <div class="image">
      <div class="w100 mw100 mw100-ns center pa3 ph5-ns">
        <h3 class="h3m- font-awesome near-black">
          Welcome to the NPC local Needs Databank metadata tool
        </h3>
        <p class="">
          Here you will be able to check and add metadata to your csv in line with the Local Needs
          Database data standard. We hope this tool will allow you to easily upload your data easily
          and tell us what your data refers to. <br />
        </p>
        <h4>
          <span style="color: red">Important</span> - The dataset itself MUST be published in a
          tabular data format, such as an Excel spreadsheet or CSV file.
        </h4>
        <ol>
          <li>
            Drag a csv onto the purple section below, or click the purple box to select the csv you
            wish to upload
          </li>
          <li>Add a description of your data describing what this data relates to</li>
          <li>
            Tell us who the publisher of this data is - this would likely be your organisation
          </li>
          <li>
            You will then asked to tag columns as “Property” or “Value” (columns can also be ignored
            at this stage if they are not to be included).
          </li>
          <li>
            You wil then be asked to provide metadata about the columns or the whole sheet - for
            example "Foodbank users"
          </li>
        </ol>
      </div>
      <div class="tc">
    <h3>For an example of what your data might look like please use the buttons below to download a sample csv with data</h3>    
    <div class="button-container">
    <a href="/data1.csv" download="DataFile1.csv" class="download-button">Download Simple Time based example</a>

    
    <a href="/data2.csv" download="DataFile2.csv" class="download-button">Download Location based example</a>
  </div>
  </div>

    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'DownloadCsv'};
</script>

<style scoped>
.download-button {
  display: inline-block;
  padding: 10px 20px;
  margin: 5px;
  background-color: #881866; /* Green */
  color: white;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 30px;
}

.download-button:hover {
  background-color: #C7215D;
}
</style>