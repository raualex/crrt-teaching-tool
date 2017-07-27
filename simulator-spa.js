$( document  ).ready(function() {
  CRRTApp.run();
});


var CRRTApp = (function() {

  var _caseStudies;
  var _currentCaseStudyId;
  var _currentCaseStudy;
  var _currentTime;
  var _labs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatine", "calcium"];
  var _vitals = ["bloodPressure", "respiratoryRate", "temperature", "heartRate", "weight"];
  var _physicalExam = ["general", "ENT", "heart", "lungs", "abdomen", "extremities", "psych"];
  var _dialysateValues = {
    "0K/3Ca": {
      "lactate": 0,
      "bicarbonate": 35,
      "potassium": 0,
      "sodium": 140,
      "calcium": 3,
      "magnesium": 1,
      "chloride": 109,
      // TODO: Joel added values of zero for creatine and BUN - need to ensure with Ben that this is correct
      "BUN": 0,
      "creatine": 0

    },
    "2K/0Ca": {
      "lactate": 0,
      "bicarbonate": 35,
      "potassium": 2,
      "sodium": 140,
      "calcium": 0,
      "magnesium": 1.5,
      "chloride": 108.5,
      "BUN": 0,
      "creatine": 0
    },
    "4K/2.5Ca": {
      "lactate": 0,
      "bicarbonate": 35,
      "potassium": 4,
      "sodium": 140,
      "calcium": 2.5,
      "magnesium": 1.5,
      "chloride": 113,
      "BUN": 0,
      "creatine": 0
    },
    "2K/0Ca/lb": {
      "lactate": 0,
      "bicarbonate": 25,
      "potassium": 2,
      "sodium": 130,
      "calcium": 0,
      "magnesium": 1.5,
      "chloride": 108.5,
      "BUN": 0,
      "creatine": 0
    }
  }

  // Note:
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

  var _historicalVitals = {
    bloodPressure: [],
    respiratoryRate: [],
    temperature: [],
    heartRate: [],
    weight: []
  }

  function _caseStudy(startingData) {
    this.startingData = startingData;
  }

  _caseStudies = {
    1: new _caseStudy({
        "sodiumStarting": 130,
        "sodiumProductionRate": 0,
        "potassiumStarting" : 4.3,
        "potassiumProductionRate" : 4.3,
        "chlorideStarting" : 85,
        "chlorideProductionRate" : 0,
        "bicarbonateStarting" : 10,
        "bicarbonateProductionRate" : -20,
        "BUNStarting" : 120,
        "BUNProductionRate" : 40,
        "creatineStarting" : 5,
        "creatineProductionRate" : 3,
        "calciumStarting" : 8.5,
        "calciumProductionRate" : 0,
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
      })
  }

  function initialize() {
    console.log("CRRTApp : initialize()");
    initializeCaseStudy();
    setPageVariables();
    handleClicks();
    initializeOrderForm();
    preventOrderFormDefault();
  }

  function initializeOrderForm() {
    handleOrderFormChanges();
    var startingAnticoagulationValue = $('input[name=anticoagulation]:checked').val();
    setAnticoagulationFormElements(startingAnticoagulationValue);
  }

  function setAnticoagulationFormElements(anticoagulationValue) {
    switch(anticoagulationValue) {
      case "citrate":
        showCitrateFormOptions();
        break;
      case "heparin":
        showHeparinFormOptions();
        break;
      case "none":
        showNoAnticoagulationFormOptions();
        break;
      default:
        showNoAnticoagulationFormOptions();
    }
  }

  function setPageVariables() {
    $("#currentTime").text(_currentTime);
    $("#currentCaseStudyId").text(_currentCaseStudyId);

    for(var i = 0; i < _labs.length; i++) {
      $("#previous"+_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-2]);
      $("#current" +_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1]);
    }

    for(var i = 0; i < _vitals.length; i++) {
      $("#previous"+_vitals[i].capitalize()).text(_historicalVitals[_vitals[i]][_historicalVitals[_vitals[i]].length-2]);
      $("#current" +_vitals[i].capitalize()).text(_historicalVitals[_vitals[i]][_historicalVitals[_vitals[i]].length-1]);
    }

    $("#historyOfPresentIllness #overview").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["overview"]));
    $("#historyOfPresentIllness #pastMedicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastMedicalHistory"]));
    $("#historyOfPresentIllness #pastSurgicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastSurgicalHistory"]));
    $("#historyOfPresentIllness #socialHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["socialHistory"]));
    $("#historyOfPresentIllness #familyHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["familyHistory"]));
    $("#imaging").html(arrayToHTMLList(_currentCaseStudy.startingData["imaging"]));
    for(var i = 0; i < _physicalExam.length; i++) {
      $("#physicalExam #" + _physicalExam[i]).html(_currentCaseStudy.startingData["physicalExam"][_physicalExam[i]]);
    }
  }

  function initializeCaseStudy() {
    console.log("CRRTApp : initializeCaseStudy()");
    _currentCaseStudyId = getParameterByName("caseId");
    _currentCaseStudy = _caseStudies[_currentCaseStudyId];
    _currentTime = 0;
    for(var i = 0; i < _labs.length; i++) {
      _historicalLabs[_labs[i]].push(_currentCaseStudy.startingData[_labs[i]+"Starting"]);
    }
    for(var i = 0; i < _vitals.length; i++) {
      _historicalVitals[_vitals[i]].push(_currentCaseStudy.startingData.vitalSigns[_vitals[i]+"Starting"]);
    }
    console.log("_currentCaseStudyId : ", _currentCaseStudyId);
    console.log("_currentCaseStudy : ", _currentCaseStudy);
  }

  function runLabs() {
    console.log("runLabs()");
    // Note: For some reason we need to reset the _currentCaseStudy -- not sure why this is. Apparently there
    // is a weird quirck of JavaScript I don't fully understand.
    _currentCaseStudyId = getParameterByName("caseId");
    _currentCaseStudy = _caseStudies[_currentCaseStudyId];
    var newLabs = {};
    var dialysate = {}; 
    var orders = {
      fluid : $('input[name=fluid]:checked').val(),
      fluidDialysateValues : _dialysateValues[$('input[name=fluid]:checked').val()],
      modality : $('input[name=modality]:checked').val(),
      BFR : $('#bloodFlowRate').val(),
      Qr : $('#fluidFlowRate').val(),
      Qd : $('#fluidFlowRate').val(),
      grossUF : $('#grossHourlyFluidRemoval').val(),
      timeToNextLabs : calculateTimeToNextSetOfLabs()
    }
    var currentWeight = calculateCurrentWeight(orders);
    _historicalVitals["weight"].push(currentWeight);
    var effluentFlowRate = calculateEffluentFlowRate(orders);
    var volumeOfDistribution = calculateVolumeOfDistribution(orders);

    // Note: Params for calculateLab(): initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate
    var sodiumInitial = _historicalLabs["sodium"][_historicalLabs["sodium"].length-1];
    var sodiumDialysate = orders.fluidDialysateValues["sodium"];
    var sodiumProductionRate = _currentCaseStudy.startingData["sodium"+"ProductionRate"];

    for(var i = 0; i < _labs.length; i++) {
      newLabs[_labs[i]] = calculateLab(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1], orders.fluidDialysateValues[_labs[i]], effluentFlowRate, orders["timeToNextLabs"], currentWeight, volumeOfDistribution, _currentCaseStudy.startingData[_labs[i]+"ProductionRate"]);
    }

    for(var i=0;i<_labs.length;i++) {
      _historicalLabs[_labs[i]].push(newLabs[_labs[i]]);
    }
    setPageVariables();
  }

  function calculateCurrentWeight(orders) {
    // TODO: We are currently ignoring fluid in for our calculations, need to ask ben how it should be calculated
    var fluidIn = 0;
    var previousWeight = _historicalVitals['weight'][_historicalVitals['weight'].length-1];
    var currentWeight = previousWeight + (fluidIn - orders["grossUF"]/1000);
    return currentWeight;
  }

  function calculateEffluentFlowRate(orders) {
    var efr;
    switch(orders["modality"]) {
      case "pre-filter-cvvh":
        efr = (orders["BFR"]*60/1000) / ((orders["BFR"]*60/1000)+orders["Qr"]) * (orders["Qr"] + orders["grossUF"]/1000);
        break;
      case "post-filter-cvvh":
        efr = orders["Qr"] + orders["grossUF"]/1000;
        break;
      case "cvvhd":
        efr = orders["Qd"] + orders["grossUF"]/1000;
        break;
    }
    return efr;
  }

  function calculateVolumeOfDistribution(orders) {
    return _currentCaseStudy.startingData["usualWeight"] * getVolumeOfDistributionGenderCoefficient() + calculateEdema(orders);
  }

  function calculateEdema(orders) {
    // Note: edema = current weight - usual weight
    return _historicalVitals["weight"][_historicalVitals["weight"].length-1] - _currentCaseStudy.startingData["usualWeight"];
  }

  function getVolumeOfDistributionGenderCoefficient() {
    if (_currentCaseStudy.startingData["gender"] == "male") {
      return 0.6;
    } else {
      return 0.5;
    }
  }

  function calculateTimeToNextSetOfLabs() {
    // Note: Certain things, like clotting, could alter
    // this value. For now, we're just setting it to 6 hours.
    return 6;
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

  function handleOrderFormChanges() {
    handleModalityChanges();
    handleAnticoagulationChanges();
  }

  function handleModalityChanges() {
    $(".modality-input").change(function() {
      if (this.value == "cvvhd") {
        showCVVHDFormOptions();
      } else {
        showCVVHFormOptions();
      }
    })
  }

  function handleAnticoagulationChanges() {
    $(".anticoagulation-input").change(function() {
      setAnticoagulationFormElements(this.value);
    });
  }

  function showCVVHDFormOptions() {
    $("#fluidLegend").text("Dialysate Fluid");
    $("#fluidFlowLegend").text("Dialysate Fluid Flow Rate (L/hr)");
  }

  function showCVVHFormOptions() {
    $("#fluidLegend").text("Replacement Fluid");
    $("#fluidFlowLegend").text("Replacement Fluid Flow Rate (L/hr)");

  }

  function preventOrderFormDefault() {
    $("#orderForm").submit(function(e){
      return false;
    });
  }

  function showCitrateFormOptions() {
    console.log("showCitrateFormOptions()");
    $(".citrate").show();
    $(".heparin").hide();
  }

  function showHeparinFormOptions() {
    $(".heparin").show();
    $(".citrate").hide();
  }

  function showNoAnticoagulationFormOptions() {
    $(".heparin").hide();
    $(".citrate").hide();
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
