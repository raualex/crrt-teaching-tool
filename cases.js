function _caseStudy(startingData) {
  this.startingData = startingData;
}

var _caseStudies = {
  1: new _caseStudy({
    "sodiumProductionRate": 0,
    "potassiumProductionRate" : 4.3,
    "chlorideProductionRate" : 0,
    "bicarbonateProductionRate" : -20,
    "BUNProductionRate" : 40,
    "creatinineProductionRate" : 3,
    "calciumProductionRate" : 0,
    "filtrationFractionStarting": 0,
    "gender" : "female",
    "usualWeight" : 86.8,
    "historyOfPresentIllness" : {
      "overview" : [
        "A 72 year old lady with a history of HTN, COPD, and DM is brought to the Emergency Department by ambulance after being found unresponsive by family members.",
        "Upon arrival she is found to be in acute hypoxemic respiratory failure requiring emergent intubation.",
        "Initial vital signs are temperature 39.1 C, HR 128, BP 78/53, RR 30.",
        "A chest x-ray shows a left lower lobe infiltrate.",
        "The patient is started on norepinephrine.",
        "Creatinine is 2.7, up from 0.86 one month earlier.",
        "Her urine output in the first 4 hours is 44 cc’s of urine.",
        "The decision is made to start the patient on continuous renal replacement therapy. A 15 cm Mahurkar in the right internal jugular vein."
      ],
      "pastMedicalHistory" : [
        "Hypertension",
        "Insulin-dependent Diabetes Mellitus Type 2",
        "COPD",
        "CKD 3 (baseline creatinine 1.4 - 1.6)"
      ],
      "pastSurgicalHistory": [

        "Abdominal hernia repair"
      ],
      "socialHistory": [
        "Current smoker, 1/2 pack per day. Has been smoking since age 17.",
        "No alcohol or other drug use.",
        "Retired from work in retail."
      ],
      "familyHistory": [
        "No family history of renal disease."
      ]
    },
    "vitalSigns": {
      "bloodPressureStarting": "78/53",
      "respiratoryRateStarting": 30,
      "temperatureStarting": 39.1,
      "heartRateStarting": 128,
      "weightStarting": 102
    },
    "medications": [],
    "imaging" : [
      "1500: Chest X-ray",
      "The chest x-ray shows a left lower lobe consolidation consistent with infection. The remainder of the lungs are clear."
    ],
    "physicalExam": {
      "general": "Appears acutely ill",
      "ENT": "Intubated",
      "heart": "Tachycardic, no murmurs, rubs, or gallops",
      "lungs": "Decreased breath sounds in the left lower lobe",
      "abdomen": "Non-distended",
      "extremities": "No edema",
      "psych": "Intubated and sedated"
    }
  }),
  2: new _caseStudy({
    "sodiumProductionRate": 0,
    "potassiumProductionRate" : 4.3,
    "chlorideProductionRate" : 0,
    "bicarbonateProductionRate" : -20,
    "BUNProductionRate" : 40,
    "creatinineProductionRate" : 3,
    "calciumProductionRate" : 0,
    "filtrationFractionStarting": 0,
    "gender" : "female",
    "usualWeight" : 86.8,
    "historyOfPresentIllness" : {
      "overview" : [
        "Jackie Smith is a 51 year old lady with a history of alcohol abuse, chronic pancreatitis, major depressive disorder, and recurrent c. diff colitis who was brought to the Emergency Department by ambulance after being found unresponsive by family members.",
        "Empty bottles of Percocet and Tylenol were found nearby.  Initial labs reveal an AST of 12,000 and an INR of 4.1.",
        "Upon arrival she is unresponsive and not protecting her airway.  She undergoes emergent intubation.",
        "Initial vital signs are HR 130, BP 83/37, RR 28.  She is started on norepinephrine and vasopressin.",
        "She does not make any urine while in the emergency department, and intial creatinine is 3.1, up from 0.46 one month earlier.",
        "The decision is made to start the patient on continuous renal replacement therapy.  A 15 cm Mahurkar catheter is placed in the right internal jugular vein."
      ],
      "pastMedicalHistory" : [
        "Hypertension",
        "Alcohol abuse",
        "Chronic pancreatitis",
        "Pulmonary embolism",
        "Diffuse chronic pain",
        "Major Depressive Disorder"
      ],
      "pastSurgicalHistory": [
        "Back surgery",
        "Hysterectomy"
      ],
      "socialHistory": [
        "Never smoker",
        "Heavy alcohol use, ongoing"
      ],
      "familyHistory": [
        "No family history of renal disease on mom's side.",
        "Dad's history is unknown"
      ]
    },
    "vitalSigns": {
      "bloodPressureStarting": "78/53",
      "respiratoryRateStarting": 30,
      "temperatureStarting": 39.1,
      "heartRateStarting": 128,
      "weightStarting": 102
    },
    "medications": [
      "Diazepam 5 mg four times daily as needed",
      "Fluoxetine 40 mg Daily",
      "Gabapentin 300 mg TID",
      "Percocet 1-2 tablets q6hrs prn",
      "Zolpidem 10 mg qPM prn for insomnia"
    ],
    "imaging" : [
      "13:42 – CT Brain w/o contrast",
      "1) No acute intracranial abnormalities.",
      "2) Mild diffuse cerebral volume loss.  These findings do not totally exclude mild cerebral edema, as the baseline of the patient is not known.",
      "",
      "15:01 – XR Chest Single View",
      "1) Limited portable chest x-ray demonstrates no focal consolidation, pneumothorax or pleural effusion.",
      "2) Distal side-port of the esophagogastric tube is not clearly below the gastroesophageal junction.  Recommend advancing 5 cm.",
      "",
      "19:12 – US Abdomen Complete",
      "1) Hepatomegaly with increased parenchymal echogenicity and coarsened echotexture suggesting chronic liver disease.",
      "2) Patent hepatic vasculature in the appropriate direction of flow, without evidence of thrombus.",
      "3) Status post cholecystectomy, prominence of the extrahepatic biliary tree likely related to postcholecystectomy status in the absence of elevated bilirubin."
    ],
    "physicalExam": {
      "general": "Appears acutely ill",
      "ENT": "Intubated",
      "heart": "Tachycardic, no murmurs, rubs, or gallops",
      "lungs": "Clear to auscultation",
      "abdomen": "Distended, non-edematous",
      "extremities": "No edema",
      "psych": "Intubated and sedated"
    }
  })
}

module.exports = _caseStudies