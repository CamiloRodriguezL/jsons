
const express = require('express')
const app = express()
const cors = require('cors')

app.use( cors() )
app.use( express.json() )

const types = {
    bone: {
        "1": ["low grade and intracompartmental chondrosarcoma"], 
        "2": ["high grade", "grade ii", "clear cell", "extracompartmental chondrosarcoma", "grade 2"], 
        "3": ["oligometastatic disease", "metastatic chondrosarcoma"], 
        "4": ["widespread disease"], 
        "5": ["sacrococcygeal and mobile spine chordoma"], 
        "6": ["skull base", "clival chordoma"], 
        "7": ["ewing sarcoma"], 
        "8": ["ewing sarcoma stable", "improved disease following primary treatment"], 
        "9": ["metastatic ewing sarcoma"], 
        "10": ["giant cell tumor of bone localized disease"], 
        "11": ["giant cell tumor of bone metastatic disease"], 
        "12": ["low grade osteosarcoma: intramedullary + surface"], 
        "13": ["periosteal osteosarcoma"], 
        "14": ["high-grade osteosarcoma: intramedullary + surface"]
    }, 
    squamous: {
        "1": ["squamous cell skin cancer local low risk"], 
        "2": ["squamous cell skin cancer local high risk"], 
        "3": ["squamous cell skin cancer local very high risk"], 
        "4": ["squamous cell skin cancer squamous cell cancer in situ"], 
        "5": ["squamous cell skin cancer clinically", "radiographically concerning regional lymph nodes"]
    }, 
    mesothelioma: {
        "1": ["diffuse epitheloid peritoneal mesothelioma"],
        "2": ["diffuse biphasic peritoneal mesothelioma"], 
        "3": ["diffuse sarcomatoid peritoneal mesothelioma"], 
        "4": ["benign multicystic peritoneal mesothelioma"], 
        "5": ["well differenciated papillary peritoneal mesothelioma"]
    }, 
    kidney: {
        "1": ["renal cell carcinoma stage i t1a", "stage 1", "stage 1 t1a", "stage i", "stage i t1a"], 
        "2": ["renal cell carcinoma stage ib", "stage ib", "stage 1b"], 
        "3": ["renal cell carsinoma stage ii", "stage ii", "stage 2"], 
        "4": ["renal cell carsinoma stage v", "stage v", "stage 5"], 
        "5": ["hereditary renal cell carcinoma", "hereditary"]
    },
    basal: {
        "1": ["local low-risk basal cell skin cancer", "low-risk"],
        "2": ["local high-risk basal cell skin cancer", "high-risk"],
        "3": ["basal skin cancer locally advanced (labcc) or metastatic", "metastatic", "locally advance"]
    }, 
    dermatofibrosarcoma: {
        "1": ["dermatofibrosarcoma protuberants (dfsp)", "dermatofibrosarcoma", "protuberants", "dfsp"]
    }, 
    adenocarcinoma: {
        "1": ["duodenum cancer resectable t1-2, n0, m0"], 
        "2": ["duodenum cancer resectable t1-2, n0, m0 mss or pmmr and no high-risk features"], 
        "3": ["duodenum cancer resectable t3, n0, m0 with high-risk features", "duodenum cancer resectable t4, n0, m0 (mss or pmmr)"], 
        "4": ["duodenum cancer resectable any, n1-2 (stage iii)"], 
        "5": ["duodenum cancer unresectable or medically inoperable"], 
        "6": ["jejunum/ileum cancer resectable t1-2, n0 m0"], 
        "7": ["jejunum/ileum cancer resectable t1-2, n0 m0 mss or pmmr and no high-risk features"],
        "8": ["jejunum/ileum cancer resectable t3 n0 m0 with high-risk features", "jejunum/ileum cancer resectable t4 n0 m0 (mss or pmmr)"],
        "9": ["jejunum/ileum cancer resectable any n1-2 (stage iii)"],
        "10": ["jejunum/ileum cancer unresectable", "jejunum/ileum cancer medically inoperable"],
        "11": ["metastatic adenocarcinoma"]
    }, 
    waldestrom: {
        "1": ["Waldenström Macroglobulinemia", "waldestrom macroglobulinemia"],
        "2": ["Bing Neel Syndrome"]
    },
    soft: {
        "1": ["Extremity/Chest wall/Head & neck Stage IA/IB"],
        "2": ["Extremity/Chest wall/Head & neck Stage II"],
        "3": ["Extremity/Chest wall/Head & neck Stage III or select Stage IV (Any T, N1, M0)"],
        "4": ["Synchronous Stage IV disease Oligometastases with limited tumor bulk that is amenable to local therapy"],
        "5": ["Synchronous Stage IV disease Disseminated metastases"],
        "6": ["Metastatic Disease Isolated regional disease or nodes"],
        "7": ["Retroperitoneal/intra-abdominal Resectable disease"],
        "8": ["Retroperitoneal/intra-abdominal Unresectable or stage IV disease"],
        "9": ["Retroperitoneal/intra-abdominal Resectable recurrent disease"],
        "10": ["Desmoid Tumors (Aggressive Fibromatosis) Anatomic location where progression would not be morbid"],
        "11": ["Desmoid Tumors (Aggressive Fibromatosis) Intra-abdominal/retroperitoneal"],
        "12": ["Desmoid Tumors (Aggressive Fibromatosis) Abdominal wall, pelvic, trunk/ extremity, head/neck/ intrathoracic"]
    }
}

app.get('/nccn', async(req, res)=>{

    const cancer = req.body.cancer.toLowerCase()
    const type = req.body.type.toLowerCase()

    console.log(cancer, type)

    try {

        const nccn = require(`./${ cancer }.json`)
        
        if(!nccn){
            throw Error(`We don't have ${ cancer } guideline yet`)
        }

        //console.group(nccn['1'])
        //console.log(types[cancer])

        let piece = "";

        for(let number in types[cancer]){
            if(types[cancer][number].includes(type)){
                piece = number
            }
        }

        if(!nccn[piece]){
            throw Error(`There is not ${ type } for ${ cancer }`)
        }

        const result = nccn[piece];

        res.json({
            ok: true,
            number: piece, 
            result
        })        
        
    } catch (error) {
        res.json({
            ok: false, 
            error: error.message
        })
    }



})

app.listen(3000, ()=> console.log("working"))



