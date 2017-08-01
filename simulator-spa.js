$( document ).ready(function() {
  CRRTApp.run();
});

var CRRTApp = (function() {

  var _points = {
    bloodFlowRateInRange: [],
    sodiumInRange: [],
    potassiumInRange: [],
    pHInRange: [],
    calciumInRange: [],
    magnesiumInRange: [],
    phosphourousInRange: [],
    grossUltrafiltrationInRange: [],
    filterFractionInRange: [],
    doseInRange: []
  };

  var _numClottedFilters = 0;
  var _messages = [];

  var _caseStudies;
  var _currentOrders;
  var _currentCaseStudyId;
  var _currentCaseStudy;
  var _currentCaseStudySheet;
  var _currentTime;
  var _dynamicLabs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "pH"];
  var _staticLabs = ["lactate", "albumin", "WBC", "hemoglobin", "hematocrit", "plateletCount", "PC02", "granularCasts", "renalEpithelialCasts", "bloodCulture", "urineCulture"];

  var _allLabs = _dynamicLabs.concat(_staticLabs);

  var _labs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "calciumFinalPostFilter", "filtrationFraction", "PH"];
  var _vitals = ["bloodPressure", "respiratoryRate", "temperature", "heartRate", "weight"];
  var _physicalExam = ["general", "ENT", "heart", "lungs", "abdomen", "extremities", "psych"];

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
    creatinine: [],
    calcium: [],
    ionizedCalcium: [],
    magnesium: [],
    phosphorous: [],
    calciumFinalPostFilter: [],
    filtrationFraction: [],
    pH: [],
    lactate: [],
    albumin: [],
    WBC: [],
    hemoglobin: [],
    hematocrit: [],
    plateletCount: [],
    PC02: [],
    granularCasts: [],
    renalEpithelialCasts: [],
    bloodCulture: [],
    urineCulture: []
  }

  var _dynamicLabs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "pH"];
  var _dynamicComponents = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "phosphorous", "magnesium"];
  var _staticLabs = ["lactate", "albumin", "WBC", "hemoglobin", "hematocrit", "plateletCount", "PC02", "granularCasts", "renalEpithelialCasts", "bloodCulture", "urineCulture"];

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
    })
  }

  function initialize() {
    console.log("CRRTApp : initialize()");
    var d1 = $.Deferred();
    initializeSpreadsheet(d1);
    $.when(d1).done(function() {
      initializeCaseStudy();
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

    setOrderFormValidation();
  }

  function setOrderFormValidation() {
    $("form[name='orderForm']").validate({
      // Specify validation rules
      rules: {
        // The key name on the left side is the name attribute
        // of an input field. Validation rules are defined
        // on the right side
        "replacement-fluid-sodium-value": {
          min: 130,
          max: 150
        },
        "replacement-fluid-potassium-value": {
          max: 4
        },
        "replacement-fluid-chloride-value": {
          min: 95,
          max: 110
        },
        "replacement-fluid-bicarbonate-value": {
          min: 20,
          max: 40
        },
        "replacement-fluid-calcium-value": {
          min: 0,
          max: 3
        },
        "replacement-fluid-magnesium-value": {
          min: 0,
          max: 2
        },
        "replacement-fluid-phosphorous-value": {
          min: 0,
          max: 1
        },
        "fluidFlowRate": {
          min: 0,
          max: 8
        },
        "gross-hourly-fluid-removal": {
          min: 0,
          max: 1000
        }
      },
      messages: {
        "replacement-fluid-sodium-value": "The hospital pharmacy can only compound sodium between 130 and 150.  Use D5W or 3% normal saline if needed",
        "replacement-fluid-potassium-value": "The hospital pharmacy will not compound fluid with a potassium above 4 mg/dL",
        "replacement-fluid-chloride-value": "The hospital pharmacy can only compound chloride between 95 and 110",
        "replacement-fluid-bicarbonate-value": "The hospital pharmacy can only compound bicarbonate between 20 and 40",
        "replacement-fluid-calcium-value": "The hospital pharmacy can only compound calcium between 0 and 3 mEq/L",
        "replacement-fluid-magnesium-value": "The hospital pharmacy can only compound magnesium between 0 and 2 mgd/L",
        "replacement-fluid-phosphorous-value": "The hospital pharmacy cannot compound fluid with > 1mg/dL of phosphorous, due to precipitation of calcium phosphate.",
        "fluidFlowRate": "The CRRT machine cannot deliver fluid above 8 L/hr",
        "gross-hourly-fluid-removal": "The CRRT machine will not accept ultrafiltration rates above 1,000 mL/hour"
      },
      // Make sure the form is submitted to the destination defined
      // in the "action" attribute of the form when valid
      submitHandler: function(form) {
        debugger;
        runLabs();
      }
    });

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
    //setPageLabs();
    setPageVitals();
    setPageHistoryOfPresentIllness();
    setPageImaging();
    setPagePhysicalExam();
    setInputOutputTable();
    setVitalsTable();
    setLabsTable();
  }

  function setInputOutputTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".inputOutputTable")) {
      $(".inputOutputTable").remove();
    }

    var table = $('<table></table>').addClass('inputOutputTable table table-hover');
    var numFluidInputs = window._currentCaseStudySheet.inputOutput.elements[0]["numInputs"];
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
      var th = $('<th></th>').text(window._currentCaseStudySheet.inputOutput.elements[i+initialValuesOffset].time);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numFluidInputs; i++) {
      var row = $('<tr></tr>');
      var data = $('<td></td').text(window._currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]);
      row.append(data);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(window._currentCaseStudySheet.inputOutput.elements[j+initialValuesOffset][window._currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]]);
        row.append(data);
      }
      table.append(row);
    }
    $("#inputOutput").append(table);
  }

  function setPageLabs(){
    for(var i = 0; i < _allLabs.length; i++) {
      $("#previous"+_allLabs[i].capitalize()).text(_historicalLabs[_allLabs[i]][_historicalLabs[_allLabs[i]].length-2]);
      $("#current" +_allLabs[i].capitalize()).text(_historicalLabs[_allLabs[i]][_historicalLabs[_allLabs[i]].length-1]);
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

  function setLabsTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".labsTable")) {
      $(".labsTable").remove();
    }

    var table = $('<table></table>').addClass('labsTable table table-hover');
    // Note: This number reflects the number of rows of initial data.
    var initialValuesOffset = 2;
    var columnOffset = 0;
    var numLabs = _allLabs.length;
    var numColumns = 2;
    var currentLabSet;
    var previousLabSet;

    // Note:
    // Start here. Need to fix labs calculation when running orders -- dynamic labs are not
    // returning correct values to the table (showing N/A for most cells)

    if (_currentTime === 0) {
      currentLabSet = 1;
      previousLabSet = 0;
    } else {
      currentLabSet = (_currentTime/6) + 1;
      previousLabSet = currentLabSet - 1;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);

    row.append($("<th></th>"));
    for(i=currentLabSet-numColumns; i<currentLabSet; i++) {
      //var th = $('<th></th>').text(_currentCaseStudySheet.labs.elements[i+initialValuesOffset].time);
      var th = $('<th></th>').text(i-1);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numLabs; i++) {
      var row = $('<tr></tr>');
      var data = $('<td></td').text(_allLabs[i]);
      row.append(data);

      var previous = $('<td></td>').text(_historicalLabs[_allLabs[i]][previousLabSet]);
      var current = $('<td></td>').text(_historicalLabs[_allLabs[i]][currentLabSet]);
      row.append(previous);
      row.append(current);
      table.append(row);
    }
    $("#labs").append(table);
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

  function initializeCaseStudy() {
    console.log("CRRTApp : initializeCaseStudy()");
    _currentCaseStudyId = getParameterByName("caseId");
    _currentCaseStudy = _caseStudies[_currentCaseStudyId];
    _currentTime = 0;
    for(var i = 0; i < _allLabs.length; i++) {
      //_historicalLabs[_labs[i]].push(_currentCaseStudy.startingData[_labs[i]+"Starting"]);
      if (!_historicalLabs[_allLabs[i]]) {
        debugger;
      }
      _historicalLabs[_allLabs[i]].push(_currentCaseStudySheet.labs.elements[0][_allLabs[i]]);
      _historicalLabs[_allLabs[i]].push(_currentCaseStudySheet.labs.elements[1][_allLabs[i]]);
    }
    for(var i = 0; i < _vitals.length; i++) {
      //_historicalVitals[_vitals[i]].push(_currentCaseStudy.startingData.vitalSigns[_vitals[i]+"Starting"]);
      _historicalVitals[_vitals[i]].push(_currentCaseStudySheet.vitals.elements[0][_vitals[i]]);
    }
    // Set initial pH
    var pH = calculatePH(_historicalLabs["bicarbonate"][_historicalLabs["bicarbonate"].length-1]);
    _historicalLabs["pH"][0] = pH;

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
      window._currentCaseStudySheet = data;
      window._currentCaseStudySheet.inputOutput = _currentCaseStudySheet.inputOutputCase1;
      window._currentCaseStudySheet.vitals = _currentCaseStudySheet.vitalsCase1;
      window._currentCaseStudySheet.labs = _currentCaseStudySheet.labsCase1;
      window._currentCaseStudySheet.productionRates = _currentCaseStudySheet.productionRatesCase1;
      window._currentCaseStudySheet.accessPressures = _currentCaseStudySheet.accessPressuresCase1;
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
      fluidDialysateValues : {
        "sodium": parseInt($("#replacement-fluid-sodium-value").val()),
        "potassium": parseInt($("#replacement-fluid-potassium-value").val()),
        "chloride": parseInt($("#replacement-fluid-chloride-value").val()),
        "bicarbonate": parseInt($("#replacement-fluid-bicarbonate-value").val()),
        "calcium": parseInt($("#replacement-fluid-calcium-value").val()),
        "magnesium": parseInt($("#replacement-fluid-magnesium-value").val()),
        "phosphorous": parseInt($("#replacement-fluid-phosphorous-value").val()),
        "BUN": 0,
        "creatinine": 0
      },
      modality : $('input[name=modality]:checked').val(),
      anticoagulation : $('input[name=anticoagulation]:checked').val(),
      BFR : parseInt($('#bloodFlowRate').val()),
      Qr : parseInt($('#fluidFlowRate').val()),
      Qd : parseInt($('#fluidFlowRate').val()),
      grossUF : parseInt($('#grossHourlyFluidRemoval').val()),
      timeToNextLabs : calculateTimeToNextSetOfLabs()
    }

    // TODO: Remove occurences of orders and change to _currentOrders. This will eliminate the need
    // to ping-pong this variable around the program.
    _currentOrders = orders;

    var startingWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];

    var effluentFlowRate = calculateEffluentFlowRate(orders);
    var volumeOfDistribution = calculateVolumeOfDistribution(orders);


    //for(var i = 0; i < _labs.length; i++) {
    //  newLabs[_labs[i]] = calculateLab(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1], orders.fluidDialysateValues[_labs[i]], effluentFlowRate, orders["timeToNextLabs"], startingWeight, volumeOfDistribution, _currentCaseStudy.startingData[_labs[i]+"ProductionRate"]);
    //}
    
    //for(var i = 0; i < _dynamicComponents.length; i++) {
    var productionRates = window._currentCaseStudySheet.productionRates.elements;

    preLabChecks();
    // Note: Params for calculateLab(): initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate
    for(var i = 0; i < productionRates.length; i++) {

      console.log("calculateLab(): component: ", productionRates[i].component);
      console.log("calculateLab(): initialValue: ", _historicalLabs[productionRates[i].component][_historicalLabs[productionRates[i].component].length-1]);
      console.log("calculateLab(): dialysate: ", orders.fluidDialysateValues[productionRates[i].component]);
      console.log("calculateLab(): effluentFlowRate: ", effluentFlowRate);
      console.log("calculateLab(): time: ", orders["timeToNextLabs"]);
      console.log("calculateLab(): weight: ", startingWeight);
      console.log("calculateLab(): volumeOfDistribution: ", volumeOfDistribution);
      console.log("calculateLab(): productionRate: ", productionRates[i].productionRate);

      newLabs[productionRates[i].component] = calculateLab(
          parseFloat(_historicalLabs[productionRates[i].component][_historicalLabs[productionRates[i].component].length-1]),
          parseFloat(orders.fluidDialysateValues[productionRates[i].component]),
          parseFloat(effluentFlowRate),
          parseFloat(orders["timeToNextLabs"]),
          parseFloat(startingWeight),
          parseFloat(volumeOfDistribution),
          parseFloat(productionRates[i].productionRate));

      console.log("newLabs : ", newLabs);

      //newLabs[_dynamicComponents[i]] = calculateLab(_historicalLabs[_dynamicComponents[i]][_historicalLabs[_dynamicComponents[i]].length-1], orders.fluidDialysateValues[_labs[i]], effluentFlowRate, orders["timeToNextLabs"], startingWeight, volumeOfDistribution, _currentCaseStudySheet.productionRates[_dynamicLabs[i]+"ProductionRate"]);
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

      var ionizedCalciumFinal = calculateLab(ionizedCalciumInitial, ionizedCalciumTotal, effluentFlowRate, orders["timeToNextLabs"], startingWeight, startingWeight*0.6, 0);
      var bicarbonateWithCitrateDialysate = 25+(((citratFinalPostFilter+caCitFinalPostFilter)*3)*citrateMetabolismFactor);
      var bicarbonateWithCitrateFinal = calculateLab(bicarbonateWithCitrateInitial, bicarbonateWithCitrateDialysate, effluentFlowRate, orders["timeToNextLabs"], startingWeight, startingWeight*0.6, -10);
      var calciumTotal = ((caFinalPostFilter*(orders.BFR*60/1000)+calciumClInMmolPerL*calciumClFlowRateInLPerHr)/((orders.BFR*60/1000)+calciumClFlowRateInLPerHr))*8+caCitFinalPostFilter*4;
      newLabs["bicarbonate"] = bicarbonateWithCitrateFinal;
      newLabs["calcium"] = calciumTotal;
      newLabs["ionizedCalcium"] = ionizedCalciumFinal;
      newLabs["calciumFinalPostFilter"] = caFinalPostFilter;
    }
    newLabs["pH"] = calculatePH(newLabs["bicarbonate"]);

    for(var i=0;i<_dynamicLabs.length;i++) {
      _historicalLabs[_dynamicLabs[i]].push(newLabs[_dynamicLabs[i]]);
    }
    
    incrementTime(orders["timeToNextLabs"]);

    var newWeight = calculateNewWeight(orders);
    _historicalVitals["weight"].push(newWeight);

    setPageVariables();
    postLabChecks();
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
    var fluidInPastSixHoursInLiters = (parseFloat(window._currentCaseStudySheet.inputOutput.elements[_currentTime+1]["previousSixHourTotal"]))/1000;

    var totalHoursOfFiltration = 6;
    // Note: If BFR is <= 150, grossUF for two hours is 0, therefore, we only have 4 hours of filtration. (This *might* only be for case study #1)
    if (orders["BFR"] <= 150) {
      totalHoursOfFiltration = 4;
    }

    var grossFiltrationPastSixHoursInLiters = (orders["grossUF"]/1000)*totalHoursOfFiltration;
    var previousWeightInKilos = _historicalVitals['weight'][_historicalVitals['weight'].length-1];
    var currentWeightInKilos = previousWeightInKilos + (fluidInPastSixHoursInLiters - grossFiltrationPastSixHoursInLiters);
    return currentWeightInKilos;
  }

  function calculateFiltrationFraction(orders) {
    var ff;
    // TODO: Is hct hard-coded? No.
    // hct is a percent-value. Take this value from labs (divide by 100)
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

    // NOTE: this might only be for case study #1
    if (orders["BFR"] <= 150 ) {
      efr = efr/1.5;
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
    //$("#runLabs").click(function() {
    //  runLabs();
    //})
  }

  function preLabChecks() {
    checkBloodFlowRate();
  }

  function postLabChecks() {

  }

  function runCase1Checks() {
    // NOTE: Start here. Next steps:
    // * Determine when each of these checks needs to be run and run at the appropriate time.
    //   (Should probably have two functions: "preLabChecks()" and "postLabChecks()")
    // * Add scoring page
    // * Add results page
    // * Add Q&A section
    // * Add writtin material
    // * Add calculations for hypotonic saline
    // * Add calculater section
    // * Add Case #2
    // * Configure google sheets proxy
    checkSodium();
    checkPotassium();
    checkChloride();
    checkBicarbonate();
    checkCalcium();
    checkMagnesium();
    checkPhosphorous();
    checkGrossUltrafiltration();
    checkFilterClotting();
    checkDose();
  }

  function checkBloodFlowRate() {
    var totalPoints = 0;
    if (_currentOrders["BFR"] >= 200 && _currentOrders["BFR"] <= 300) {
      console.log("checkBloodFlowRate() : within bounds ", _currentOrders["BFR"]);
      totalPoints = totalPoints + 5;
      _points.bloodFlowRateInRange.push(5);
    }

    if (_currentOrders["BFR"] <= 150) {
      var msg = "The patient's nurse called.  She's been having many \"Low Return Pressure Alarms\" over the past 4 hours, and the machine is not running well.";
      _messages.push(msg);
      showMessage(msg);
      totalPoints = totalPoints - 100;
    }

    if (_currentOrders["BFR"] > 350 ) {
      var msg = "The patient's nurse called to inform you of frequent \"Access Pressure Extremely Low\" alarms, and had to decrease BFR to 300.";
      _messages.push(msg);
      showMessage(msg);
      _currentOrders["BFR"] = 300;
      totalPoints = totalPoints - 50;
    }
    _points.bloodFlowRateInRange.push(totalPoints);
    return;
  }

  function checkSodium() {

  }

  function checkPotassium() {

  }

  function checkChloride() {

  }

  function checkBicarbonate() {

  }

  function checkCalcium() {

  }

  function checkMagnesium() {

  }
  
  function checkPhosphorous() {

  }

  function checkGrossUltrafiltration() {

  }

  function checkFilterClotting() {

  }

  function checkGrossUltrafiltration() {

  }

  function checkDose() {

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

  function showMessage(msg) {
    var messageContainer = $('<p></p>').addClass('card-text');
    var message = $('<samp></samp>').text(msg);
    messageContainer.append(message);
    $("#message-box").prepend("<hr>");
    $("#message-box").prepend(messageContainer);
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
