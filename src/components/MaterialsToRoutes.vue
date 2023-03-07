<template>
  <h2 class="mb-4">MATERIALS TO ROUTES</h2>
  <div class="col-4">
    <div class="mb-3">
      <input v-if="!hideButton" class="form-control" type="file" id="formFile" @input="getFile">
    </div>
  </div>
  <div class="col-4 text-end my-auto">
    <button v-if="!loadingBtn && !hideButton" type="button" class="btn btn-outline-primary" @click="clickUpload" :disabled="disableUpload">Upload <i class="bi bi-upload"></i></button>
    <div v-if="loadingBtn" class="spinner-border text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
  <div class="col-4 my-auto">
      <div class="progress">
        <div class="progress-bar" role="progressbar" :style="`width: ${percent}%`" :aria-valuenow="percent" aria-valuemin="0" aria-valuemax="100"></div>
      </div>
      <span class="small">{{ this.percent }}%</span>
  </div>
  <div class="col-12">
    <div v-if="loadTable" class="spinner-border text-secondary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div v-if="!loadTable" class="table-responsive">
      <table  class="table table-sm caption-top" id="materialsToRoutes_table">
        <caption>
          <div class="row">
            <div class="col">
              Total Records: {{ jsonData.length }}
            </div>
            <div class="col text-end">
              <button v-if="!loadingBtn && !hideButton" type="button" class="btn btn-sm btn-outline-success" @click="exportExcelOnlyHTML">Template <i class="bi bi-file-earmark-excel"></i></button>
            </div>
          </div>
        </caption>
        <thead class="table-dark">
          <tr>
            <th class="border-end border-light">MaterialId</th>
            <th class="border-end border-light">RouteChainId</th>
            <th class="border-end border-light">OrganizationByPlantID</th>            
            <th class="border-end border-light">UserId</th>          
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user,index) in jsonData" :key="index" :class="`${index}ROW`">
            <td class="border-start border-end border-secondary">{{ user["MaterialId"] }}</td>
            <td class="border-end border-secondary">{{ user["RouteChainId"] }}</td>
            <td class="border-end border-secondary">{{ user["OrganizationByPlantID"] }}</td>            
            <td class="border-end border-secondary">{{ user["UserId"] }}</td>
          </tr>
        </tbody>
      </table>  
    </div>        
  </div>



</template>

<script>
import * as XLSX from 'xlsx/xlsx.mjs'
import { RequestOnlyInfo } from '@/assets/js/tools'

export default {
  name: 'MaterialToRoutesUpload',
  components: {
      
  },
  props: {},
  data() {
      return {
          fileAttached: '',
          jsonData: [],
          loadTable: false,
          percent: 0,
          loadingBtn: false,
          hideButton: false,
      }
  },
  computed: {
        disableUpload(){
          let result = true
          if(this.jsonData.length > 0)
            result = false
          
            if(!result && this.$root.email && this.$root.email != 'your_email_here' && this.$root.orgByPlant)
          result = false
          else 
            result = true 
            
          return result 
        }     
      },
  async mounted() {  
     
  },
  methods: {
      async getFile(event) {
          this.fileAttached = event.target.files[0]
          await this.excelFileToJSON(this.fileAttached);
          this.percent = 0
      },
      async excelFileToJSON(file) {
          try {
              let app = this
              this.loadTable = true
              var reader = new FileReader();
              reader.readAsBinaryString(file);
              this.jsonData = await new Promise((resolve, reject) => {
                reader.onload = function (e) {                        
                    var data = e.target.result;
                    var workbook = XLSX.read(data, {
                        type: 'binary'
                    });
                    
                    var firstSheetName = workbook.SheetNames[0];
                    resolve(XLSX.utils.sheet_to_json(workbook.Sheets[firstSheetName]));
                    app.loadTable = false
                }
                reader.onerror = (e) => {
                    reject(e)
                    app.loadTable = false
                }
              })
              
          } catch (e) {
              console.error(e);
          }
      },
      async clickUpload() {
          try {
              this.hideButton = true
              this.loadingBtn = true
              let count = 0;
              await this.jsonData.forEach(async (item, index) => {
                 
                  let inputData = {
                      "UserId": item["UserId"]?.trim() || '',
                      "RouteChainId":   parseFloat(item["RouteChainId"] ? item["RouteChainId"] : 0),
                      "MaterialId":  parseFloat(item["MaterialId"] ? item["MaterialId"] : 0),
                      
                  }
                  let result = await RequestOnlyInfo("RouteMaterial", "AddRouteMaterials", inputData,this.$root.orgByPlant,this.$root.email)   
                  if (result) {
                      this.percent = ((count / this.jsonData.length) * 100).toFixed(2)
                      let rowHTML = document.getElementsByClassName(`${index}ROW`)[0];
                      let classRow = result.actionResponse == 30 ? "#FFFFC2" : result.actionResponse == 40 ? "#FFC2C2" : '#DEFFD1'
                      let rowTD = rowHTML.getElementsByTagName('td') 
                      for (let x = 0; x <= rowTD.length - 1; x++) {
                          rowTD[x].style.backgroundColor = classRow;
                      }
                  }
                  if (this.percent >= 100) {
                      this.percent = 100
                      this.loadingBtn = false
                  }
              })
          } catch (error) {
              console.log(error)
              return false
          }         
      },
      exportExcelOnlyHTML() {
            const data = document.getElementById(`materialsToRoutes_table`).cloneNode(true)                
            const wb = XLSX.utils.table_to_book(data, { sheet: `template` })
            XLSX.writeFile(wb, ((`materialsToRoutes_table.xlsx`)))
      },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>


</style>