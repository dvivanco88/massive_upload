<template>
  <h2 class="mb-4">USERS</h2>
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
      <table  class="table table-sm caption-top" id="users_table">
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
            <th class="border-end border-light">Company Email</th>
            <th class="border-end border-light">LAN ID</th>
            <th class="border-end border-light">First Name</th>
            <th class="border-end border-light">Middle Name</th>
            <th class="border-end border-light">Last Name</th>
            <th class="border-end border-light">EmployeeId</th>
            <th class="border-end border-light">Work Location</th>
            <th class="border-end border-light">Division</th>
            <th class="border-end border-light">Department</th>
            <th class="border-end border-light">Business Job Title</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(user,index) in jsonData" :key="index" :class="`${index}ROW`">
            <td class="border-start border-end border-secondary">{{ user["Company Email"] }}</td>
            <td class="border-end border-secondary">{{ user["LAN ID"] }}</td>
            <td class="border-end border-secondary">{{ user["First Name"] }}</td>
            <td class="border-end border-secondary">{{ user["Middle Name"] }}</td>
            <td class="border-end border-secondary">{{ user["Last Name"] }}</td>
            <td class="border-end border-secondary">{{ user["EmployeeId"] }}</td>
            <td class="border-end border-secondary">{{ user["Work Location"] }}</td>
            <td class="border-end border-secondary">{{ user["Division"] }}</td>
            <td class="border-end border-secondary">{{ user["Department"] }}</td>
            <td class="border-end border-secondary">{{ user["Business Job Title"] }}</td>
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
      name: 'UserUpload',
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
                          "email": item["Company Email"]?.trim() || '',
                          "lanAccountName": item["LAN ID"]?.trim() || '',
                          "firstName": (item["First Name"]?.trim() || '' + " " + item["Middle Name"]?.trim() || '')?.trim() || '',
                          "lastName": item["Last Name"]?.trim() || '',
                          "displayName": item["First Name"]?.trim() || '',
                          "employeeNumber": item["EmployeeId"] ? item["EmployeeId"].toString() : '',
                          "primaryLanguage": "English",
                          "primaryLanguageSearcher": "English",
                          "defaultOrganizationByPlantId": 2,
                          "defaultOrganizationByPlantIdSearcher": "CHIP",
                          "roleId": 153,
                          "roleIdSearcher": "DefaultRole",
                          "location": item["Work Location"]?.trim() || '',
                          "division": item["Division"]?.trim() || '',
                          "department": item["Department"]?.trim() || '',
                          "title": item["Business Job Title"]?.trim() || '',
                      }
                      let result = await RequestOnlyInfo("Users", "AddUsers", inputData,this.$root.orgByPlant,this.$root.email)   
                      count += 1 
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
                const data = document.getElementById(`users_table`).cloneNode(true)                
                const wb = XLSX.utils.table_to_book(data, { sheet: `template` })
                XLSX.writeFile(wb, ((`users_table.xlsx`)))
          },
      }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  

</style>