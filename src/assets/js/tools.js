const axios = require('axios')
const pathMaster = `https://blcore-development.apps.yitce1pw.eastus.aroapp.io/api/v1/BLC`

export const callToBackend = async (DATA) => {
    try {

        const options = {
            url: pathMaster,
            method: 'POST',
            data: DATA,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
            },
            timeout: 180000,
        };

        const response = await axios(options);
        return response.data;
    }
    catch (err) {
        console.log("API failed: " + err)
        return null
    }
}

export const RequestOnlyInfo = async (processName, processEvent, inputData = {}, orgByPlant, user) => {
    let input = {
        OrganizationByPlantId: parseFloat(orgByPlant),
        userId: user,
        processName: processName,
        processEvent: processEvent,
        inputData
    }

    return await OnlyInfo(input)
}

const OnlyInfo = async (dataInput) => {
    let data = null
    try {            
        data = await callToBackend(dataInput)
        
        if (data && !data.outputData)
            data.outputData = ''

        if(data && data.actionResponse > 20){
            console.log(`Something is wrong: ${data.message}`)
            console.log(`input: `, dataInput)
            console.log(`response: `, data)
        }
        return data

    } catch (error) {
        console.log(error)
        console.log('Request Data:', dataInput)
        console.log('Response Data:', data)
        if (this.$root && this.$root.showMessage)                 
            this.$root.showMessage(data && data.message ? data.message : error.message, 3)

        return { actionResponse: 40, outputData: '', message: data && data.message ? data.message : `Bad Request/Response UI: ${error.message}`, status: false }            
        //return []
    }
}