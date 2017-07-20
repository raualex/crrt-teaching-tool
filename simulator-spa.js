$( document  ).ready(function() {
  CRRTApp.run();
});


var CRRTApp = (function() {

  var _caseStudies;
  var _currentCaseStudyId;
  var _currentCaseStudy;
  var _currentTime;
  var _labs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatine", "calcium"];
  // We are storing each of our lab values in an array. This allows
  // us to keep track of historical values. Since new values will
  // always be pushed onto the front of the array, current value will 
  // be indexed at array.length - 1
  var _historicalLabs = {
    sodium: [],
    potassium: [],
    chloride: [],
    bicarbonate: [],
    BUN: [],
    creatine: [],
    calcium: []
  }

  function _caseStudyOld(
      sodiumStarting,
      potassiumStarting,
      chlorideStarting,
      bicarbonateStarting,
      BUNStarting,
      creatineStarting,
      calciumStarting,
      historyPresentIllnessOverview,
      historyPresentIllnessPastMedicalHistory,
      historyPresentIllnessPastSurgicalHistory,
      historyPresentIllnessSocialHistory,
      historyPresentIllnessFamilyHistory,
      vitalSigns,
      medications,
      imaging,
      physicalExamGeneral,
      physicalExamENT,
      physicalExamHeart,
      physicalExamLungs,
      physicalExamAbdomen,
      physicalExamExtremities,
      physicalExamPsych) {
    this.sodiumStarting = sodiumStarting;
    this.potassiumStarting = potassiumStarting;
    this.chlorideStarting = chlorideStarting;
    this.bicarbonateStarting = bicarbonateStarting;
    this.BUNStarting = BUNStarting;
    this.creatineStarting = creatineStarting;
    this.calciumStarting = calciumStarting;
    this.historyPresentIllnessOverview = historyPresentIllnessOverview;
    this.historyPresentIllnessPastMedicalHistory = historyPresentIllnessPastMedicalHistory;
    historyPresentIllnessPastSurgicalHistory = historyPresentIllnessPastSurgicalHistory;
    historyPresentIllnessSocialHistory = historyPresentIllnessSocialHistory;
    historyPresentIllnessFamilyHistory = historyPresentIllnessFamilyHistory;
    vitalSigns = vitalSigns;
    medications = medications;
    imaging = imaging;
  }

  function _caseStudy(startingData) {
    this.startingData = startingData;
  }

  _caseStudies = {
    1: new _caseStudy({
        "sodiumStarting": 130,
        "potassiumStarting" : 4.3,
        "chlorideStarting" : 85,
        "bicarbonateStarting" : 10,
        "BUNStarting" : 120,
        "creatineStarting" : 5,
        "calciumStarting" : 8.5,
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
          "weightStarting": 65
        },
        "medications": [],
        "imaging" : [
          "1500: Chest X-ray",
          "The chest x-ray shows a left lower lobe consolidation consistent with infection. The remainder of the lungs are clear."
        ],
        "physicalExam": {
          "general": "Appears acutely ill",
          "ENT": "Intubated",
          "Heart": "Tachycardic, no murmurs, rubs, or gallops",
          "Lungs": "Decreased breath sounds in the left lower lobe",
          "Abdomen": "Non-distended",
          "Extremities": "No edema",
          "Psych": "Intubated and sedated"
        }
      })
  }

  function initialize() {
    console.log("CRRTApp : initialize()");
    initializeCaseStudy();
    setPageVariables();
    handleClicks();
    preventOrderFormDefault();
  }

  function setPageVariables() {
    $("#currentTime").text(_currentTime);
    $("#currentCaseStudyId").text(_currentCaseStudyId);
    for(var i = 0; i < _labs.length; i++) {
      $("#previous"+_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-2]);
      $("#current" +_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1]);
    }
    $("#historyOfPresentIllness #overview").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["overview"]));
    debugger;
    $("#historyOfPresentIllness #pastMedicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastMedicalHistory"]));
    debugger;
    $("#historyOfPresentIllness #pastSurgicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastSurgicalHistory"]));
    debugger;
    $("#historyOfPresentIllness #socialHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["socialHistory"]));
    debugger;
    $("#historyOfPresentIllness #familyHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["familyHistory"]));
    debugger;
  }

  function initializeCaseStudy() {
    console.log("CRRTApp : initializeCaseStudy()");
    _currentCaseStudyId = getParameterByName("caseId");
    _currentCaseStudy = _caseStudies[_currentCaseStudyId];
    _currentTime = 0;
    for(var i = 0; i < _labs.length; i++) {
      _historicalLabs[_labs[i]].push(_currentCaseStudy.startingData[_labs[i]+"Starting"]);
    }
    console.log("_currentCaseStudyId : ", _currentCaseStudyId);
    console.log("_currentCaseStudy : ", _currentCaseStudy);
  }

  function runLabs() {
    console.log("runLabs()");
    var newLabs = {};
    newLabs["sodium"] = calculateLab(_historicalLabs["sodium"][_historicalLabs["sodium"].length-1], 140, 2, 24, 70, 42, 0);
    newLabs["potassium"] = calculateLab(_historicalLabs["potassium"][_historicalLabs["potassium"].length-1], 4, 2, 24, 70, 42, 0);
    newLabs["chloride"] = calculateLab(_historicalLabs["chloride"][_historicalLabs["chloride"].length-1], 100, 2, 24, 70, 42, 0);
    newLabs["bicarbonate "] = calculateLab(_historicalLabs["bicarbonate"][_historicalLabs["bicarbonate"].length-1], 35, 2, 24, 70, 42, -20);
    newLabs["BUN"] = calculateLab(_historicalLabs["BUN"][_historicalLabs["BUN"].length-1], 0, 2, 24, 70, 42, 40);
    newLabs["creatine"] = calculateLab(_historicalLabs["creatine"][_historicalLabs["creatine"].length-1], 0, 2, 24, 70, 42, 3);
    newLabs["calcium"] = calculateLab(_historicalLabs["calcium"][_historicalLabs["calcium"].length-1], 10, 2, 24, 70, 42, 0);

    for(var i=0;i<_labs.length;i++) {
      _historicalLabs[_labs[i]].push(newLabs[_labs[i]]);
    }

    setPageVariables();
  }

  function arrayToHTMLList(array){
    var html = "";
    html += "<ul>";
    for(var i=0; i<array.length;i++){
      html += "<li>" + array[i] + "</li>";
    }
    html += "</ul>";
    return html;
  }

  function calculateLab(initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate) {
    var newValue = initialValue + (dialysate - initialValue) * (1 - Math.exp(-effluentFlowRate*time/volumeOfDistribution)) + (productionRate/effluentFlowRate)*(1 - Math.exp(-effluentFlowRate*time/volumeOfDistribution));
    newValue = excelRound(newValue, 6);
    return newValue

  }

  function handleClicks() {
    $("#runLabs").click(function() {
      runLabs();
    })
  }

  function preventOrderFormDefault() {
    $("#orderForm").submit(function(e){
      return false;
    });
  }


  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function excelRound(val, num) {
    var coef = Math.pow(10, num);
    return (Math.round(val * coef))/coef

  }

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);

  }

  return {
    run: function() {
      initialize();
    }
  }

})();
