$( document ).ready(function() {
  CRRTApp.run();
});

var CRRTApp = (function() {

  var _caseStudies;
  var _currentCaseStudyId;
  var _currentCaseStudy;
  var _currentCaseStudySheet;
  var _currentTime;
  var _labs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatine", "calcium", "ionizedCalcium", "calciumFinalPostFilter", "filtrationFraction", "PH"];
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
    calcium: [],
    ionizedCalcium: [],
    calciumFinalPostFilter: [],
    filtrationFraction: [],
    PH: []
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
      "intakeOutputPrior": {
        "normalSalineBolus": 8000
      },
      "labValues": {
          "sodium": [145,145],
          "potassium": [3.6,3.4],
          "chloride": [123,116],
          "bicarbonate": [14,13],
          "BUN": [44,48],
          "creatine": [2.27,3.12],
          "calcium": [7.7,7.6],
          "ionizedCalcium": [0.95,0.97],
          "magnesium": [1.7,1.9],
          "phosphorous": [4.4,6.3],
          "lactate": [3.3,6.1],
          "albumin": [3.1],
          "WBC": [
            29.3, // initial 1
            29.3, // initial 2
            34.5, // 1
            37.1, // 2
            29.2, // 3
            29.4, // 4
            30.4, // 5
            25.2, // 6
            22.8, // 7
            20.3, // 8
            17,   // 9
            14.5, // 10
            22.8, // 11
            20.3, // 12
            17,   // 13
            14.5  // 14
          ],
          "hemoglobin": [
            9.4,  // initial 1
            9.4,  // initial 2
            10.7, // 1
            10.7, // 2
            9,    // 3
            8.3,  // 4
            8.4,  // 5
            8.7,  // 6
            8.5,  // 7
            8.9,  // 8
            8.9,  // 9
            8.8,  // 10
            8.5,  // 11
            8.9,  // 12
            8.9,  // 13
            8.8   // 14
          ],
          "hematocrit": [
            28.5, // initial 1
            28.5, // initial 2
            32.9, // 1
            32.3, // 2
            26.7, // 3
            24.8, // 4
            25.8, // 5
            27,   // 6
            25.7, // 7
            27.1, // 8
            26.9, // 9
            27,   // 10
            25.7, // 11
            27.1, // 12
            26.9, // 13
            27    // 14
          ],
          "plateletCount": [
            48, // initial 1
            48, // initial 2
            41, // 1
            36, // 2
            26, // 3
            21, // 4
            19, // 5
            19, // 6
            24, // 7
            30, // 8
            45, // 9
            55, // 10
            24, // 11
            30, // 12
            45, // 13
            55  // 14
          ],
          "pH":[
            7.07,  // initial 1
            7.2183 // initial 2
          ],
          "PCO2": [
            46, // initial 1
            33, // initial 2
            34, // 1
            33, // 2
            35, // 3
            33, // 4
            32, // 5
            34, // 6
            35, // 7
            40, // 8
            38, // 9
            40, // 10
            35, // 11 NOTE: value was not given, used 4 previous values
            40, // 12 NOTE: value was not given, used 4 previous values
            38, // 13 NOTE: value was not given, used 4 previous values
            40  // 14 NOTE: value was not given, used 4 previous values
          ],
          "urineMicroscopy":[
            "", // initial 1
            "", // initial 2
            "", // 1
            "", // 2
            "", // 3
            "", // 4
            "", // 5
            "", // 6
            "", // 7
            "", // 8
            "", // 9
            "", // 10
            "", // 11
            "", // 12
            "", // 13
            ""  // 14
          ],
          "granularCasts": [
            "10-20/LPF", // initial 1
            "", // initial 2
            "", // 1
            "", // 2
            "", // 3
            "", // 4
            "", // 5
            "", // 6
            "", // 7
            "", // 8
            "", // 9
            "", // 10
            "", // 11
            "", // 12
            "", // 13
            ""  // 14
          ],
          "renalEpithelialCasts": [
            "5-10/HPF", // initial 1
            "", // initial 2
            "", // 1
            "", // 2
            "", // 3
            "", // 4
            "", // 5
            "", // 6
            "", // 7
            "", // 8
            "", // 9
            "", // 10
            "", // 11
            "", // 12
            "", // 13
            ""  // 14
          ],
          "bloodCulture": [
            "No Growth", // initial 1
            "",          // initial 2
            "No Growth", // 1
            "",          // 2
            "No Growth", // 3
            "",          // 4
            "",          // 5
            "",          // 6
            "",          // 7
            "",          // 8
            "",          // 9
            "",          // 10
            "",          // 11
            "",          // 12
            "",          // 13
            "Positive for S. Pneumonia"  // 14
          ],
          "urineCulture":[
            "No Growth", // initial 1
            "",          // initial 2
            "",          // 1
            "No Growth", // 2
            "",          // 3
            "",          // 4
            "",          // 5
            "",          // 6
            "",          // 7
            "",          // 8
            "",          // 9
            "",          // 10
            "",          // 11
            "",          // 12
            "",          // 13
            ""           // 14
          ]
        },
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
        "ionizedCalciumStarting": 1.2,
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
      })
  }

  function initialize() {
    console.log("CRRTApp : initialize()");
    var d1 = $.Deferred();
    initializeCaseStudy(d1);
    $.when(d1).done(function() {
      setPageVariables();
      handleClicks();
      initializeOrderForm();
      preventOrderFormDefault();
    })
  }

  function initializeOrderForm() {
    handleOrderFormChanges();
    var startingAnticoagulationValue = $('input[name=anticoagulation]:checked').val();
    setAnticoagulationFormElements(startingAnticoagulationValue);

    if ($("#other-fluids-saline").is(":checked") === false && $("#other-fluids-D5W").is(":checked") === false) {
      $("#other-fluids-values").hide();
    }
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
    setPageTime();
    setPageCaseStudyId();
    setPageLabs();
    setPageVitals();
    setPageHistoryOfPresentIllness();
    setPageImaging();
    setPagePhysicalExam();
    setInputOutputTable();
    setVitalsTable();
  }

  function setInputOutputTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".inputOutputTable")) {
      $(".inputOutputTable").remove();
    }

    var table = $('<table></table>').addClass('inputOutputTable table table-hover');
    var numFluidInputs = _currentCaseStudySheet.inputOutput.elements[0]["numInputs"];
    // Note: This number reflects the number of rows of initial data.
    var initialValuesOffset = 2;
    // Note: These data are being pulled from a Google spreadsheet. This number represents the number of 
    // "extra" columns (notes, ID, etc.) before we get to the "real" data. Keep in mind, this number could change
    // if the spreadsheet is modified and additional columns are added before the columns storing our data.
    var columnOffset = 3;
    var numColumns;
    if (_currentTime === 0) {
      numColumns = 2;
    } else {
      numColumns = 6;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);

    row.append($("<th></th>"));
    for(i=_currentTime-numColumns; i<_currentTime; i++) {
      var th = $('<th></th>').text(_currentCaseStudySheet.inputOutput.elements[i+initialValuesOffset].time);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numFluidInputs; i++) {
      var row = $('<tr></tr>');
      var data = $('<td></td').text(_currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]);
      row.append(data);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[j+initialValuesOffset][_currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]]);
        row.append(data);
      }
      table.append(row);
    }
    $("#inputOutput").append(table);
  }

  function setPageLabs(){
    for(var i = 0; i < _labs.length; i++) {
      $("#previous"+_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-2]);
      $("#current" +_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1]);
    }
  }

  function setVitalsTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".vitalsTable")) {
      $(".vitalsTable").remove();
    }

    var initialValuesOffset = 1;
    var table = $('<table></table>').addClass('vitalsTable table table-hover');
    // Note: This number reflects the number of rows of initial data.
    var initialValuesOffset = 1;
    // Note: These data are being pulled from a Google spreadsheet. This number represents the number of 
    // "extra" columns (notes, ID, etc.) before we get to the "real" data. Keep in mind, this number could change
    // if the spreadsheet is modified and additional columns are added before the columns storing our data.
    var columnOffset = 3;
    var numVitals = _currentCaseStudySheet.vitals.elements[0]["numInputs"];
    var numColumns;
    if (_currentTime === 0) {
      numColumns = 1;
    } else {
      numColumns = 6;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);

    row.append($("<th></th>"));
    for(i=_currentTime-numColumns; i<_currentTime; i++) {
      var th = $('<th></th>').text(_currentCaseStudySheet.vitals.elements[i+initialValuesOffset].time);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numVitals; i++) {
      var row = $('<tr></tr>');
      var data = $('<td></td').text(_currentCaseStudySheet.vitals.columnNames[i+columnOffset]);
      row.append(data);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_currentCaseStudySheet.vitals.elements[j+initialValuesOffset][_currentCaseStudySheet.vitals.columnNames[i+columnOffset]]);
        row.append(data);
      }
      table.append(row);
    }
    $("#vitals").append(table);
  }

  function setPageTime() {
    $("#currentTime").text(_currentTime);
  }

  function setPageCaseStudyId() {
    $("#currentCaseStudyId").text(_currentCaseStudyId);
  }

  function setPageVitals() {
    for(var i = 0; i < _vitals.length; i++) {
      $("#previous"+_vitals[i].capitalize()).text(_historicalVitals[_vitals[i]][_historicalVitals[_vitals[i]].length-2]);
      $("#current" +_vitals[i].capitalize()).text(_historicalVitals[_vitals[i]][_historicalVitals[_vitals[i]].length-1]);
    }
  }

  function setPageHistoryOfPresentIllness() {
    $("#historyOfPresentIllness #overview").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["overview"]));
    $("#historyOfPresentIllness #pastMedicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastMedicalHistory"]));
    $("#historyOfPresentIllness #pastSurgicalHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["pastSurgicalHistory"]));
    $("#historyOfPresentIllness #socialHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["socialHistory"]));
    $("#historyOfPresentIllness #familyHistory").html(arrayToHTMLList(_currentCaseStudy.startingData["historyOfPresentIllness"]["familyHistory"]));
  }

  function setPageImaging() {
    $("#imaging").html(arrayToHTMLList(_currentCaseStudy.startingData["imaging"]));
  }

  function setPagePhysicalExam() {
    for(var i = 0; i < _physicalExam.length; i++) {
      $("#physicalExam #" + _physicalExam[i]).html(_currentCaseStudy.startingData["physicalExam"][_physicalExam[i]]);
    }
  }

  function initializeCaseStudy(promise) {
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
    // Set initial pH
    var pH = calculatePH(_historicalLabs["bicarbonate"][_historicalLabs["bicarbonate"].length-1]);
    _historicalLabs["PH"][0] = pH;

    initializeSpreadsheet(promise);

    console.log("_currentCaseStudyId : ", _currentCaseStudyId);
    console.log("_currentCaseStudy : ", _currentCaseStudy);
  }

  function initializeSpreadsheet(promise) {
    var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KAn-DDLp-R1Msdju4w8fqhgPSd9n5ShfCIzJ7DFtkJQ/pubhtml';

    // Check and see if case study is in local storage. If it is, no need to hit the Google API
   // if (localStorage.getItem(publicSpreadsheetUrl)) {
   //   _currentCaseStudySheet = localStorage.getItem(publicSpreadsheetUrl);
   //   promise.resolve();
   //   return;
   // }

    Tabletop.init( { key: publicSpreadsheetUrl, callback: showInfo, simpleSheet: false } );
    function showInfo(data, tabletop) {
      _currentCaseStudySheet = data;
      promise.resolve();
      console.log(data);
    }
  }

  function calculatePH(bicarbonate) {
    // TODO: >>>
    // Use pCO2 values from lab tab
    var pCO2 = 30.5;
    var pH = 6.1 + Math.log(bicarbonate/(0.03*pCO2)) / Math.log(10);
    return pH;
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
      //fluidDialysateValues : _dialysateValues[$('input[name=fluid]:checked').val()],
      fluidDialysateValues : {
        "sodium": parseInt($("#replacement-fluid-sodium-value").val()),
        "potassium": parseInt($("#replacement-fluid-potassium-value").val()),
        "chloride": parseInt($("#replacement-fluid-chloride-value").val()),
        "bicarbonate": parseInt($("#replacement-fluid-bicarbonate-value").val()),
        "calcium": parseInt($("#replacement-fluid-calcium-value").val()),
        "magnesium": parseInt($("#replacement-fluid-magnesium-value").val()),
        "phosphorous": parseInt($("#replacement-fluid-phosphorous-value").val()),
        "BUN": 0,
        "creatine": 0
      },
      modality : $('input[name=modality]:checked').val(),
      anticoagulation : $('input[name=anticoagulation]:checked').val(),
      BFR : parseInt($('#bloodFlowRate').val()),
      Qr : parseInt($('#fluidFlowRate').val()),
      Qd : parseInt($('#fluidFlowRate').val()),
      grossUF : parseInt($('#grossHourlyFluidRemoval').val()),
      timeToNextLabs : calculateTimeToNextSetOfLabs()
    }

    var startingWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];

    var effluentFlowRate = calculateEffluentFlowRate(orders);
    var volumeOfDistribution = calculateVolumeOfDistribution(orders);

    // Note: Params for calculateLab(): initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate
    var sodiumInitial = _historicalLabs["sodium"][_historicalLabs["sodium"].length-1];
    var sodiumDialysate = orders.fluidDialysateValues["sodium"];
    var sodiumProductionRate = _currentCaseStudy.startingData["sodium"+"ProductionRate"];

    for(var i = 0; i < _labs.length; i++) {
      newLabs[_labs[i]] = calculateLab(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1], orders.fluidDialysateValues[_labs[i]], effluentFlowRate, orders["timeToNextLabs"], startingWeight, volumeOfDistribution, _currentCaseStudy.startingData[_labs[i]+"ProductionRate"]);
    }

    newLabs["ionizedCalcium"] = _historicalLabs['calcium'][_historicalLabs['calcium'].length-1]/8;
    newLabs["filtrationFraction"] = calculateFiltrationFraction(orders);

    // If using citrate, re-calculate bicarbonate and calcium values. Also, add ionized calcium and final post filter calcium to results
    if(orders.anticoagulation === 'citrate') {
      var citrateFlowRateInMlPerHr = $('#citrateFlowRate').val();
      var citrateFlowRateInLPerHr = citrateFlowRateInMlPerHr/1000;
      var citrateBloodConcentrationConstant = 112.9;
      var citrateBloodConcentration = citrateFlowRateInLPerHr*citrateBloodConcentrationConstant/((orders["BFR"]*60/1000)+citrateFlowRateInLPerHr);
      var dialysateCalcium = orders["fluidDialysateValues"]["calcium"];
      var ionizedCalciumInitial = newLabs["ionizedCalcium"];
      var previousIonizedCalcium = _historicalLabs['ionizedCalcium'][_historicalLabs['ionizedCalcium'].length-1];
      var citrateInitial = citrateBloodConcentration;
      // Note: For now,  caCitInitial will be hard-coded.
      var caCitInitial = 0;
      var kForCaCit = 1;
      var caCitFinalPreFilter = (-1*(-ionizedCalciumInitial-citrateInitial-kForCaCit)-Math.sqrt(Math.pow(-ionizedCalciumInitial-citrateInitial-kForCaCit, 2)-4*(1)*(ionizedCalciumInitial*citrateInitial)))/(2*(1))
      var caFinalPreFilter = ionizedCalciumInitial - caCitFinalPreFilter;
      var citratFinalPreFilter = citrateInitial - caCitFinalPreFilter;
      var bicarbonateWithCitrateInitial = 24;
      var caFinalPostFilter = caFinalPreFilter*(1-(effluentFlowRate/(orders.BFR*60/1000))*((caFinalPreFilter-(dialysateCalcium/2))/caFinalPreFilter));
      var citratFinalPostFilter = citratFinalPreFilter*(1-(effluentFlowRate/(orders.BFR*60/1000)));
      var caCitFinalPostFilter = caCitFinalPreFilter*(1-(effluentFlowRate/(orders.BFR*60/1000)));

      // Note: In case 2 This number will change based on the case time
      // TODO: Add ability to change this number with time
      var citrateMetabolismFactor = 1;
      var calciumClInMmolPerL = 54;
      var calciumClFlowRateInMlPerHr = $('#caclInfusionRate').val();
      var calciumClFlowRateInLPerHr = calciumClFlowRateInMlPerHr/1000;
      var ionizedCalciumTotal = (caFinalPostFilter*(orders.BFR*60/1000)+calciumClInMmolPerL*calciumClFlowRateInLPerHr)/((orders.BFR*60/1000)+calciumClFlowRateInLPerHr)+caCitFinalPostFilter/2*citrateMetabolismFactor;
      // Note: Params for calculateLab(): initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate

      // NOTE: Pick up here. Next step is to make sure we're calculating everything we need, saving the data, and displaying it on our labs screen. After that, need to calculate filtration fraction and pH. Then, calculate hyptonic saline. After that, test to make sure we're running all the necessary calculations. After that (not necessarily in order):
      // 1) Add tables of (relatively) static lab data
      // 2) Add logic to conditionally display correct lab data based on certain conditions (weight/time/etc)
      // 3) Add messaging sub-system
      // 4) Start working on IF/THEN statements to implement the actual case
      // 5) Make sure all the data we are pulling is dynamic
      var ionizedCalciumFinal = calculateLab(ionizedCalciumInitial, ionizedCalciumTotal, effluentFlowRate, orders["timeToNextLabs"], startingWeight, startingWeight*0.6, 0);
      var bicarbonateWithCitrateDialysate = 25+(((citratFinalPostFilter+caCitFinalPostFilter)*3)*citrateMetabolismFactor);
      var bicarbonateWithCitrateFinal = calculateLab(bicarbonateWithCitrateInitial, bicarbonateWithCitrateDialysate, effluentFlowRate, orders["timeToNextLabs"], startingWeight, startingWeight*0.6, -10);
      var calciumTotal = ((caFinalPostFilter*(orders.BFR*60/1000)+calciumClInMmolPerL*calciumClFlowRateInLPerHr)/((orders.BFR*60/1000)+calciumClFlowRateInLPerHr))*8+caCitFinalPostFilter*4;
      newLabs["bicarbonate"] = bicarbonateWithCitrateFinal;
      newLabs["calcium"] = calciumTotal;
      newLabs["ionizedCalcium"] = ionizedCalciumFinal;
      newLabs["calciumFinalPostFilter"] = caFinalPostFilter;
    }
    newLabs["PH"] = calculatePH(newLabs["bicarbonate"]);

    for(var i=0;i<_labs.length;i++) {
      _historicalLabs[_labs[i]].push(newLabs[_labs[i]]);
    }
    
    incrementTime(orders["timeToNextLabs"]);

    var newWeight = calculateNewWeight(orders);
    _historicalVitals["weight"].push(newWeight);

    setPageVariables();
  }

  function incrementTime(time) {
    _currentTime = _currentTime + time;
  }

  function calculateNewWeight(orders) {
    // Note:
    // new weight = old weight + difference between input and output
    // 1L = 1Kg
    // output = ultrafiltration rate = Gross fluid removal = Gross ultrafiltration 
    // TODO: Not currently factoring in citrate, D5W, or 3%NS
    var fluidInPastSixHoursInLiters = (parseFloat(_currentCaseStudySheet.inputOutput.elements[_currentTime+1]["previousSixHourTotal"]))/1000;
    var grossFiltrationPastSixHoursInLiters = (orders["grossUF"]/1000)*6;
    var previousWeightInKilos = _historicalVitals['weight'][_historicalVitals['weight'].length-1];
    var currentWeightInKilos = previousWeightInKilos + (fluidInPastSixHoursInLiters - grossFiltrationPastSixHoursInLiters);
    return currentWeightInKilos;
  }

  function calculateFiltrationFraction(orders) {
    var ff;
    // TODO: Is hct hard-coded?
    var hct = 0.3;

    switch(orders["modality"]) {
      case "pre-filter-cvvh":
        ff = (orders["Qr"] + (orders["grossUF"]/1000)) / ((orders["BFR"]*60/1000) * (1-hct) + orders["Qr"])*100;
        break;
      case "post-filter-cvvh":
        ff = (orders["Qr"] + (orders["grossUF"]/1000)) / ((orders["BFR"]*60/1000) * (1-hct))*100;
        break;
      case "cvvhd":
        ff = (orders["grossUF"]/1000) / ((orders["BFR"]*60/1000) * (1-hct))*100;
        break;
    }
    return ff;
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
    handleOtherFluidsChanges();
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

  function handleOtherFluidsChanges() {
    $("#other-fluids-saline").change(function() {
      if (this.checked === true) {
        $("#other-fluids-values").show();
        $("#other-fluids-bolus-text").text("Sodium Bolus (mL)");
        $("#other-fluids-infusion-text").text("Sodium Continuous Infusion Rate (ml/Hr)");
        $("#other-fluids-D5W").prop("checked", false);
      }
    })

    $("#other-fluids-D5W").change(function() {
      if (this.checked === true) {
        $("#other-fluids-values").show();
        $("#other-fluids-bolus-text").text("D5W Bolus (mL)");
        $("#other-fluids-infusion-text").text("D5W Continuous Infusion Rate (ml/Hr)");
        $("#other-fluids-saline").prop("checked", false);
      }
    })

    $("#other-fluids-sodium-phosphate").change(function() {
      if (this.checked === true) { }
    })

    $(".other-fluids").change(function() {
      if ($("#other-fluids-saline").is(":checked") === false && $("#other-fluids-D5W").is(":checked") === false) {
        $("#other-fluids-values").hide();
      }
    })
   
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
