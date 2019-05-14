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
    phosphorousInRange: [],
    grossUltrafiltrationInRange: [],
    filtrationFractionInRange: [],
    doseInRange: [],
    maxPointsPerCycle: {
      bloodFlowRateInRange: 5,
      sodiumInRange: 5,
      potassiumInRange: 5,
      pHInRange: 10,
      calciumInRange: 5,
      magnesiumInRange: 5,
      phosphorousInRange: 10,
      grossUltrafiltrationInRange: 0,
      filtrationFractionInRange: 5,
      doseInRange: 20
    }
  };

  // NOTE:
  // _runTestMode and _runTestLabsNum can be used for testing
  // to autofill data, automatically run labs, etc.
  var _runTestMode = true;
  // NOTE: 16 labs is a full case for case #1
  var _runTestLabsNum = 0;

  var _numFiltersUsed = 1;
  var _currentCycleClotNumber = 0;
  var _messages = [];
  var _newMessages = [];
  var _caseStudies;
  var _currentOrders;
  var _currentCaseStudyId;
  var _currentCaseStudy;
  var _currentCaseStudySheet;
  var _currentDose;
  var _usedCitrate = false;
  var _usedCitrateFirst = false;
  var _historicalDose = [];
  var _historicalOverload = [];
  var _caseOver = false;
  var _dynamicLabs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "pH", "filtrationFraction", "calciumFinalPostFilter"];
  var _staticLabs = ["lactate", "albumin", "WBC", "hemoglobin", "hematocrit", "plateletCount", "PC02", "granularCasts", "renalEpithelialCasts", "bloodCulture", "urineCulture"];
  var _allLabs = _dynamicLabs.concat(_staticLabs);
  var _labs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "calciumFinalPostFilter", "filtrationFraction", "PH"];
  var _vitals = ["bloodPressure", "respiratoryRate", "temperature", "heartRate", "weight"];
  var _physicalExam = ["general", "ENT", "heart", "lungs", "abdomen", "extremities", "psych"];
  // NOTE: Our starting time will be 10am
  var _startingTime = moment(0, 'HH');
  var _headerTime = 10;

  // NOTE:
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

  var _historicalInputOutput = {
    totalInput: [],
    ultrafiltration: [],
    totalOutput: [],
    netInputOutput: [],
    cumulativeInputOutput: [],
    citrate: [],
    cacl: []
  }

  var _dynamicLabs = ["sodium", "potassium", "chloride", "bicarbonate", "BUN", "creatinine", "calcium", "ionizedCalcium", "magnesium", "phosphorous", "pH", "filtrationFraction"];
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

  function initialize() {
    console.log("CRRTApp : initialize()");
    initializeCaseStudyID();
    var d1 = $.Deferred();
    initializeSpreadsheet(d1);
    $.when(d1).done(function() {
      initializeCaseStudy();
      setPageVariables();
      initializeOrderForm();

      $body = $("body");
      $body.removeClass("loading");

      if (_runTestMode) {
        setTestFormInputs();
        if (_runTestLabsNum !== 0) {
          for (var i = 0; i < _runTestLabsNum; i++) {
            runLabs();
          }
        }
        setTestFormInputs();
      }
    })
  }

  function setTestFormInputs() {
    // $("#replacement-fluid-sodium-value").val("140");
    // $("#replacement-fluid-potassium-value").val("3.6");
    // $("#replacement-fluid-chloride-value").val("100");
    // $("#replacement-fluid-bicarbonate-value").val("24");
    // $("#replacement-fluid-calcium-value").val("2");
    // $("#replacement-fluid-magnesium-value").val("1.7");
    // $("#replacement-fluid-phosphorous-value").val(".5");
    // $("#grossHourlyFluidRemoval").val("500");
    // $("#bloodFlowRate").val("200");
    // $("#fluidFlowRate").val("2");
    // $("#citrateFlowRate").val("300");
    // $("caclInfusionRate").val("100");
  }

  function resetFormInputs() {
    $("#replacement-fluid-sodium-value").val("");
    $("#replacement-fluid-potassium-value").val("");
    $("#replacement-fluid-chloride-value").val("");
    $("#replacement-fluid-bicarbonate-value").val("");
    $("#replacement-fluid-calcium-value").val("");
    $("#replacement-fluid-magnesium-value").val("");
    $("#replacement-fluid-phosphorous-value").val("");

    $("#bloodFlowRate").val("");
    $("#fluidFlowRate").val("");
    $("#grossHourlyFluidRemoval").val("");

    $("#other-fluids-sodium-phosphate").prop('checked',false);
    $("#other-fluids-saline").prop('checked',false);
    $("#other-fluids-D5W").prop('checked',false);
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
    $("form[name='orderForm']").submit(function(e) {
      e.preventDefault();
    }).validate({
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
          max: 2000
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
        "gross-hourly-fluid-removal": "The CRRT machine will not accept ultrafiltration rates above 2,000 mL/hour"
      },
      submitHandler: function(form) {
        $('#ordersModal').modal('hide');
        runLabs();
        resetFormInputs();
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
    setPageHistoryOfPresentIllness();
    setPageImaging();
    setPagePhysicalExam();
    setCRRTDisplay();
    createInputOutputTable();
    createVitalsTable();
    createMedicationsTable();
    createLabsTable();
  }

  function setCRRTDisplay() {
    if (_currentTime !== 0) {
      $("#noOrders").hide();
      $("#CRRTDisplay").show();
      $(".therapyFluid").text(_currentOrders.Qr);
      $(".accessPressure").text(getCurrentAccessPressure("accessPressure"));
      $(".dose").text(_currentDose);
      $(".ultrafiltrationRate").text(_currentOrders.grossUF);
      $(".venousPressure").text(getCurrentAccessPressure("venousPressure"));
      $(".filtrationFraction").text(_currentOrders.filtrationFraction);
      $(".bloodFlowRate").text(_currentOrders.BFR);
      $(".effluentPressure").text(getCurrentAccessPressure("effluentPressure"));
    }
  }

  function createInputOutputTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".inputOutputTable")) {
      $(".inputOutputTable").remove();
    }

    var table = $('<table></table>').addClass('inputOutputTable table table-hover');
    var numFluidInputs = _currentCaseStudySheet.inputOutput.elements[0]["numInputs"];
    // NOTE: This number reflects the number of rows of initial data.
    var initialValuesOffset = 2;
    // NOTE: These data are being pulled from a Google spreadsheet. This number represents the number of 
    // "extra" columns (notes, ID, etc.) before we get to the "real" data. Keep in mind, this number could change
    // if the spreadsheet is modified and additional columns are added before the columns storing our data.
    var columnOffset = 3;
    var numColumns;
    if (_currentTime === 0) {
      numColumns = 2;
    } else {
      numColumns = _currentTime + 2;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);

    row.append($("<th class='blankTh'></th>"));
    for(i=_currentTime-numColumns; i<_currentTime; i++) {
      var th = $('<th></th>').text(_currentCaseStudySheet.inputOutput.elements[i+initialValuesOffset].time);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numFluidInputs; i++) {
      var row = $('<tr></tr>');
      var data = $('<th></th>').text(_currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]);
      row.append(data);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[j+initialValuesOffset][_currentCaseStudySheet.inputOutput.columnNames[i+columnOffset]]);
        row.append(data);
      }
      table.append(row);
    }

    var rowCitrate = $('<tr></tr>');
    var rowCacl = $('<tr></tr>');


    if (_currentTime !== 0) {
      var title = $('<th></th>').text("Citrate");
      rowCitrate.append(title);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["citrate"][j]);
        rowCitrate.append(data);
      }
    }


    if (_currentTime !== 0) {
      var title = $('<th></th>').text("Calcium Chloride");
      rowCacl.append(title);

      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["cacl"][j]);
        rowCacl.append(data);
      }
    }

    table.append(rowCitrate);
    table.append(rowCacl);

    var rowTotalInput = $('<tr></tr>');
    var rowUltrafiltration = $('<tr></tr>');
    var rowTotalOutput = $('<tr></tr>');
    var rowNetInputOutput = $('<tr></tr>');
    var rowCumulativeInputOutput = $('<tr></tr>');

    var title = $('<th></th>').addClass("emphasis").text("Total Input");
    rowTotalInput.append(title);


    // NOTE: We are pulling our intitial data from the spreadsheet. After that, we will be dynamically
    // calculating Input/Output based on user inputs AND spreadsheet values
    if (_currentTime === 0) {
      var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[0]["total"]);
      rowTotalInput.append(data);
      var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[1]["total"]);
      rowTotalInput.append(data);
    } else {
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["totalInput"][j]);
        rowTotalInput.append(data);
      }
    }



    if (_currentTime !== 0) {
      var title = $('<th></th>').text("Ultrafiltration");
      rowUltrafiltration.append(title);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["ultrafiltration"][j]);
        rowUltrafiltration.append(data);
      }
    }


    if (_currentTime !== 0) {
    var title = $('<th></th>').addClass("emphasis").text("Total Output");
    rowTotalOutput.append(title);

      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["totalOutput"][j]);
        rowTotalOutput.append(data);
      }
    }

    var title = $('<th></th>').addClass("emphasis").text("Net Input/Output");
    rowNetInputOutput.append(title);

    if (_currentTime !== 0) {
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["netInputOutput"][j]);
        rowNetInputOutput.append(data);
      }
    } else {
      var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[0]["total"]);
      rowNetInputOutput.append(data);
      var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[1]["total"]);
      rowNetInputOutput.append(data);
    }

    var title = $('<th></td>').addClass("emphasis").text("Cumulative Input/Output");
    rowCumulativeInputOutput.append(title);

    if (_currentTime !== 0) {
      for(j=_currentTime-numColumns; j<_currentTime; j++) {
        var data = $('<td></td>').text(_historicalInputOutput["cumulativeInputOutput"][j]);
        rowCumulativeInputOutput.append(data);
      }
    } else {
      var data = $('<td></td>').text(_currentCaseStudySheet.inputOutput.elements[0]["total"]);
      rowCumulativeInputOutput.append(data);
      var data = $('<td></td>').text(parseFloat(_currentCaseStudySheet.inputOutput.elements[0]["total"])+parseFloat(_currentCaseStudySheet.inputOutput.elements[1]["total"]));
      rowCumulativeInputOutput.append(data);
    }

    table.append(rowTotalInput);
    table.append(rowUltrafiltration);
    table.append(rowTotalOutput);
    table.append(rowNetInputOutput);
    table.append(rowCumulativeInputOutput);


    $("#inputOutput").append(table);

    // NOTE: In order to keep the table looking pretty, we need to make sure our empty cells
    // have at least *some* content (in our case, a dash)
    $("td:empty").html("-");
  }

  function createVitalsTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".vitalsTable")) {
      $(".vitalsTable").remove();
    }

    var initialValuesOffset = 1;
    var table = $('<table></table>').addClass('vitalsTable table table-hover');
    // NOTE: This number reflects the number of rows of initial data.
    var initialValuesOffset = 1;
    // NOTE: These data are being pulled from a Google spreadsheet. This number represents the number of 
    // "extra" columns (notes, ID, etc.) before we get to the "real" data. Keep in mind, this number could change
    // if the spreadsheet is modified and additional columns are added before the columns storing our data.
    var columnOffset = 3;
    var numVitals = _currentCaseStudySheet.vitals.elements[0]["numInputs"];
    var numColumns;
    if (_currentTime === 0) {
      numColumns = 1;
    } else {
      //numColumns = 6;
      numColumns = _currentTime + 1;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);

    row.append($("<th class='blankTh'></th>"));
    for(i=_currentTime-numColumns; i<_currentTime; i++) {
      var th = $('<th></th>').text(_currentCaseStudySheet.vitals.elements[i+initialValuesOffset].time);
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numVitals; i++) {
      var row = $('<tr></tr>');
      var data = $('<th></th>').text(_currentCaseStudySheet.vitals.columnNames[i+columnOffset]);
      row.append(data);
      for(j=_currentTime-numColumns; j<_currentTime; j++) {

        // NOTE: While most vitals are coming from the spreadsheet, we are dynamically calculating
        // the patient's weight. So, we're jumping in here and inserting that dynamic value (I know it's dirty)
        //if (_currentCaseStudySheet.vitals.columnNames[i+columnOffset] === "weight" && j === (_currentTime-1)) {
        if (_currentCaseStudySheet.vitals.columnNames[i+columnOffset] === "weight" && ((j+1)%6) === 0) {
          var currentWeight = _historicalVitals["weight"][(j+1)/6];
          var data = $('<td></td>').text(currentWeight);
        } else {
          var data = $('<td></td>').text(_currentCaseStudySheet.vitals.elements[j+initialValuesOffset][_currentCaseStudySheet.vitals.columnNames[i+columnOffset]]);
        }
        row.append(data);
      }
      table.append(row);
    }
    $("#vitals").append(table);
  }

  function createMedicationsTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".medicationsTable")) {
      $(".medicationsTable").remove();
    }

    $('.modal-body').addClass('medications-body');

    var table = $("<table></table>").addClass('medicationsTable table table-hover');
    var initialValuesOffset = 1;
    var numColumns;
    if (_currentTime === 0) {
      numColumns = 1;
    } else {
      numColumns = (_currentTime/6) + 1;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);
    row.append($("<th class='blankTh'></th>"));
    for(var i=0; i<numColumns; i++) {
      var th = $('<th></th>').text(_currentCaseStudySheet.medications.elements[i].time);
      row.append(th);
    }
    table.append(head);

    var rowScheduled = $("<tr></tr>");
    var rowInfusions = $("<tr></tr>");

    var title = $('<th></th>').text("Scheduled");
    rowScheduled.append(title);

    for(j=0;j<numColumns;j++){
      var medsArray = JSON.parse(_currentCaseStudySheet.medications.elements[j].scheduledMedications);
      var cell = $('<td></td>');
      var list = $('<ul></ul>');

      cell.append(list);

      for (var k=0;k<medsArray.length;k++){
        var item = $('<li></li>').text(medsArray[k]);
        list.append(item);
      }

      rowScheduled.append(cell);
    }

    var title = $('<th></th>').text("Infusions");
    rowInfusions.append(title);

    for(j=0;j<numColumns;j++){
      var infusionsArray = JSON.parse(_currentCaseStudySheet.medications.elements[j].infusions);
      var cell = $('<td></td>');
      var list = $('<ul></ul>');

      cell.append(list);

      for (var l=0;l<infusionsArray.length;l++){
        var item = $('<li></li>').text(infusionsArray[l]);
        list.append(item);
      }

      rowInfusions.append(cell);
    }

    table.append(rowScheduled);
    table.append(rowInfusions);
    $("#medications").append(table);

  }

  function createLabsTable() {
    // If table already exists, remove, so we can rebuid it.
    if ($(".labsTable")) {
      $(".labsTable").remove();
    }

    var table = $('<table></table>').addClass('labsTable table table-hover');
    // NOTE: This number reflects the number of rows of initial data.
    var initialValuesOffset = 2;
    var columnOffset = 0;
    var numLabs = _allLabs.length;
    var numColumns;
    var currentLabSet;
    var previousLabSet;


    if (_currentTime === 0) {
      numColumns = 2;
      currentLabSet = 1;
      previousLabSet = 0;
    } else {
      numColumns = (_currentTime/6)+2;
      currentLabSet = (_currentTime/6) + 1;
      previousLabSet = currentLabSet - 1;
    }

    var head = $('<thead></thead');
    var row = $('<tr></tr>');
    head.append(row);


    //currentLabSet = the number of lab results starting at the patients default settings (1)

    //i should start at the start time (whatever that is) and then increment up by 8 hours for each incrementation of currentLabSet (ex. currentLabSet = 1, 12:00noon, currentLabSet = 2, 8pm, currentLabSet = 3, 4am, etc.)

    row.append($("<th class='blankTh'></th>"));
    for(i=currentLabSet-numColumns; i<currentLabSet; i++) {
      var th = $('<th></th>').text(createLabsHeaders(i));
      row.append(th);
    }
    table.append(head);

    for(i=0; i<numLabs; i++) {
      var row = $('<tr></tr>');
      var data = $('<th></th>').text(_allLabs[i]);
      row.append(data);

      for(j=(_currentTime/6)-numColumns; j<(_currentTime/6); j++) {
        var data = $('<td></td>').text(_historicalLabs[_allLabs[i]][j+initialValuesOffset]);
        row.append(data);
      }
      table.append(row);
    }
    $("#labs").append(table);
  }

  function createLabsHeaders(i) {
    if(i === -1 || i === 0) {
      _headerTime = 10
      return _headerTime + ":00";
    } else {
      _headerTime = verifyHeaderTime()
      return _headerTime + ":00";
    }
  }

  function verifyHeaderTime() {
    if ((_headerTime + 8) > 12) {
      return (_headerTime + 8) - 12
    } else {
      return _headerTime + 8
    }
  }

  function setPageTime() {
    $(".currentTime").text(currentTimeToTimestamp(false));
    $(".currentTimeWithElapsed").text(currentTimeToTimestamp(true));
  }

  function setPageCaseStudyId() {
    $("#currentCaseStudyId").text(_currentCaseStudyId);
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

  function initializeCaseStudyID(){
    _currentCaseStudyId = getParameterByName("caseId");

    if (!_currentCaseStudyId) {
      _currentCaseStudyId = promptForID();
    }

    function promptForID() {
      var validIDs = [1,2];
      var id = parseInt(prompt("Enter case study ID (Valid cases: "+validIDs.toString()+")"));
      if (validIDs.includes(id)){
        console.log("valid IDs contains: ",id);
        return id;
      } else {
        console.log("valid IDs does not contain: ", id);
        promptForID();
      }
    }

  }

  function initializeCaseStudy() {
    console.log("CRRTApp : initializeCaseStudy()");
    _currentCaseStudy = _caseStudies[_currentCaseStudyId];
    _currentCaseStudy = _currentCaseStudy;
    _currentTime = 0;
    for(var i = 0; i < _allLabs.length; i++) {
      if(_currentCaseStudySheet.labs.elements[0][_allLabs[i]]) {
        _historicalLabs[_allLabs[i]].push(_currentCaseStudySheet.labs.elements[0][_allLabs[i]]);
      }
      if(_currentCaseStudySheet.labs.elements[1][_allLabs[i]]) {
        _historicalLabs[_allLabs[i]].push(_currentCaseStudySheet.labs.elements[1][_allLabs[i]]);
      }
    }
    for(var i = 0; i < _vitals.length; i++) {
      _historicalVitals[_vitals[i]].push(_currentCaseStudySheet.vitals.elements[0][_vitals[i]]);
    }
    // Set initial pH
    var pH = excelRound(calculatePH(_historicalLabs["bicarbonate"][_historicalLabs["bicarbonate"].length-1]), 2);
    _historicalLabs["pH"][0] = pH;

    // Set initial overload
    setVolumeOverload();

    console.log("_currentCaseStudyId : ", _currentCaseStudyId);
    console.log("_currentCaseStudy : ", _currentCaseStudy);
  }

  function initializeSpreadsheet(promise) {
    var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1KAn-DDLp-R1Msdju4w8fqhgPSd9n5ShfCIzJ7DFtkJQ/pubhtml';
    Tabletop.init( { key: publicSpreadsheetUrl, callback: showInfo, simpleSheet: false } );
    function showInfo(data, tabletop) {
      _currentCaseStudySheet = data;
      _currentCaseStudySheet.inputOutput = _currentCaseStudySheet["inputOutputCase"+_currentCaseStudyId];
      _currentCaseStudySheet.vitals = _currentCaseStudySheet["vitalsCase"+_currentCaseStudyId];
      _currentCaseStudySheet.labs = _currentCaseStudySheet["labsCase"+_currentCaseStudyId];
      _currentCaseStudySheet.productionRates = _currentCaseStudySheet["productionRatesCase"+_currentCaseStudyId];
      _currentCaseStudySheet.accessPressures = _currentCaseStudySheet["accessPressuresCase"+_currentCaseStudyId];
      _currentCaseStudySheet.medications = _currentCaseStudySheet["medicationsCase"+_currentCaseStudyId];

      //_currentCaseStudySheet.vitals = _currentCaseStudySheet.vitalsCase1;
      //_currentCaseStudySheet.labs = _currentCaseStudySheet.labsCase1;
      //_currentCaseStudySheet.productionRates = _currentCaseStudySheet.productionRatesCase1;
      //_currentCaseStudySheet.accessPressures = _currentCaseStudySheet.accessPressuresCase1;
      //_currentCaseStudySheet.medications = _currentCaseStudySheet.medicationsCase1;
      promise.resolve();
      console.log(data);
    }
  }

  function calculatePH(bicarbonate) {
    var PCO2 = getCurrentLab("PC02");
    var pH = 6.1 + Math.log(bicarbonate/(0.03*PCO2)) / Math.log(10);
    console.log("calculatePH : pH", pH);
    return excelRound(pH, 2);
  }

  function getCurrentLab(lab) {
    var currentLabSetIndex;

    if (_currentTime === 0) {
      currentLabSetIndex = 1;
    } else {
      currentLabSetIndex = (_currentTime/6) + 1;
    }

    return parseFloat(_currentCaseStudySheet.labs.elements[currentLabSetIndex][lab]);
  }

  function getCurrentAccessPressure(pressure) {
    currentLabSetIndex = _currentTime/6;
    return parseFloat(_currentCaseStudySheet.accessPressures.elements[currentLabSetIndex][pressure]);
  }

  function runLabs() {
    var newLabs = {};
    var dialysate = {}; 
    var orders = getOrders();
    var didClot = false;
    _currentOrders = orders;
    var startingWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];
    newLabs["ionizedCalcium"] = _historicalLabs['calcium'][_historicalLabs['calcium'].length-1]/8;
    newLabs["filtrationFraction"] = orders.filtrationFraction;

    var initialEffluentFlowRate = calculateEffluentFlowRate(orders);
    console.log("initialEffluentFlowRate :", initialEffluentFlowRate);

    switch (_currentCaseStudyId) {
      case 1:
        console.log("case 1 : checkFilterClottingCase1()")
        didClot = checkFilterClottingCase1();
        break;
      case 2:
        console.log("case 2 : checkFilterClottingCase2()")
        didClot = checkFilterClottingCase2(startingWeight, effluentFlowRate, newLabs["ionizedCalcium"]);
        break;
    }
    
    var adjustedEffluentFlowRate = calculateAdjustedEffluentFlowRate(initialEffluentFlowRate, newLabs["filtrationFraction"], startingWeight, newLabs["ionizedCalcium"], didClot);
    var totalHoursOfFiltration = calculateTotalHoursOfFiltration(initialEffluentFlowRate, newLabs["filtrationFraction"], startingWeight, newLabs["ionizedCalcium"], didClot);

    console.log("adjustedEffluentFlowRate :", adjustedEffluentFlowRate);
    var effluentFlowRate = adjustedEffluentFlowRate;

    var volumeOfDistribution = calculateVolumeOfDistribution(orders);
    var productionRates = _currentCaseStudySheet.productionRates.elements;

    preLabChecks(effluentFlowRate);
    for(var i = 0; i < productionRates.length; i++) {

      console.log("calculateLab(): component: ", productionRates[i].component);
      console.log("calculateLab(): initialValue: ", _historicalLabs[productionRates[i].component][_historicalLabs[productionRates[i].component].length-1]);
      console.log("calculateLab(): dialysate: ", orders.fluidDialysateValues[productionRates[i].component]);
      console.log("calculateLab(): effluentFlowRate: ", effluentFlowRate);
      console.log("calculateLab(): time: ", orders["timeToNextLabs"]);
      console.log("calculateLab(): weight: ", startingWeight);
      console.log("calculateLab(): volumeOfDistribution: ", volumeOfDistribution);
      console.log("calculateLab(): productionRate: ", productionRates[i].productionRate);

      // NOTE: Params for calculateLab(): initialValue, dialysate, effluentFlowRate, time, weight, volumeOfDistribution, productionRate
      newLabs[productionRates[i].component] = calculateLab(
          parseFloat(_historicalLabs[productionRates[i].component][_historicalLabs[productionRates[i].component].length-1]),
          parseFloat(orders.fluidDialysateValues[productionRates[i].component]),
          parseFloat(effluentFlowRate),
          parseFloat(orders["timeToNextLabs"]),
          parseFloat(startingWeight),
          parseFloat(volumeOfDistribution),
          parseFloat(productionRates[i].productionRate));
      console.log("newLabs : ", newLabs);
    }

    // NOTE: Because sodium calculations are a bit different than other lab values, we need to recalculate
    // sodium using the calculateSodium() function.
    newLabs["sodium"] = calculateSodium(volumeOfDistribution, effluentFlowRate);
    console.log('Nan Problemmmmmmm: ' + effluentFlowRate)
    // NOTE: If we're using sodium phosphate, we need to recalculate the phosphorous results
    if (orders.otherFluidsSodiumPhosphate) {
      console.log("runLabs : using sodium phosphate");
      newLabs["phosphorous"] = calculatePhosphourous(volumeOfDistribution, effluentFlowRate);
    }


    if(orders.anticoagulation === 'citrate') {
      var citrateResults = runCitrateCalculations(startingWeight, effluentFlowRate, newLabs["ionizedCalcium"])
      newLabs["bicarbonate"] = citrateResults["bicarbonate"];
      newLabs["calcium"] = citrateResults["calcium"];
      newLabs["ionizedCalcium"] = citrateResults["ionizedCalcium"];
      newLabs["calciumFinalPostFilter"] = citrateResults["calciumFinalPostFilter"];
    }
    newLabs["pH"] = calculatePH(newLabs["bicarbonate"]);

    newLabs = roundLabs(newLabs);
    saveLabValues(newLabs);
    incrementTime();
    copyStaticLabsToHistorical();
    setNewWeight(totalHoursOfFiltration);
    setVolumeOverload()
    setPageVariables();
    postLabChecks();
    processMessages();
  }

  function roundLabs(newLabs){
    newLabs["sodium"] = excelRound(newLabs["sodium"],0);
    newLabs["potassium"] = excelRound(newLabs["potassium"],1);
    newLabs["chloride"] = excelRound(newLabs["chloride"],0);
    newLabs["bicarbonate"] = excelRound(newLabs["bicarbonate"],0);
    newLabs["BUN"] = excelRound(newLabs["BUN"],0);
    newLabs["creatinine"] = excelRound(newLabs["creatinine"],2);
    newLabs["calcium"] = excelRound(newLabs["calcium"],1);
    newLabs["ionizedCalcium"] = excelRound(newLabs["ionizedCalcium"],2);
    newLabs["magnesium"] = excelRound(newLabs["magnesium"],1);
    newLabs["phosphorous"] = excelRound(newLabs["phosphorous"],1);
    return newLabs;
  }

  function copyStaticLabsToHistorical() {
    var currentLabSet = (_currentTime/6) + 1;

    for(var i = 0; i < _staticLabs.length; i++) {
      if(_currentCaseStudySheet.labs.elements[currentLabSet][_staticLabs[i]]) {
        _historicalLabs[_staticLabs[i]].push(_currentCaseStudySheet.labs.elements[currentLabSet][_staticLabs[i]]);
      }
    }
  }

  function setVolumeOverload() {
    var usualWeight = _currentCaseStudy.startingData["usualWeight"];
    var currentWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];
    var overload = excelRound(((currentWeight - usualWeight)/usualWeight)*100, 2);
    _historicalOverload.push(overload);
  }


  function calculateSodium(volumeOfDistribution, effluentFlowRate) {
    console.log('calculateSodium params: ' + volumeOfDistribution, effluentFlowRate)
    var finalSodium;
    // NOTE: This is where we are accounting for hypo/hypertonic solutions and recalculating our sodium values
    var bolusValue = _currentOrders["otherFluidsBolusValue"];
    var infusionValue = _currentOrders["otherFluidsInfusionValue"];
    var otherFluidsSaline = _currentOrders["otherFluidsSaline"];
    var otherFluidsD5W = _currentOrders["otherFluidsD5W"];
    var otherFluidsSodiumPhosphate = _currentOrders["otherFluidsSodiumPhosphate"];
    var userDialysateValue = _currentOrders.fluidDialysateValues["sodium"];

    // default initial sodium is the previous historical value.
    var initialSodium =  parseFloat(_historicalLabs["sodium"][_historicalLabs["sodium"].length-1]);

    var startingWeight = parseFloat(_historicalVitals["weight"][_historicalVitals["weight"].length-1]);
    var threePercentSalineConcentration;

    // default dialysate value is the user entered value
    var newDialysate = userDialysateValue;

    if (otherFluidsSaline) {
      threePercentSalineConcentration = 513;
      newDialysate = infusionValue/1000/effluentFlowRate*373+userDialysateValue;
    } 

    if (otherFluidsD5W) {
      threePercentSalineConcentration = 0;
      newDialysate = userDialysateValue-infusionValue/1000/effluentFlowRate*userDialysateValue;
    }

    if ((otherFluidsSaline || otherFluidsD5W) && (bolusValue)) {
      initialSodium = initialSodium + (((threePercentSalineConcentration - initialSodium)/(volumeOfDistribution+1))*(bolusValue/1000));
    }


    finalSodium = calculateLab(initialSodium, newDialysate, effluentFlowRate, _currentOrders["timeToNextLabs"], startingWeight, volumeOfDistribution, 0);

    return finalSodium;
  }

  function calculatePhosphourous(volumeOfDistribution, effluentFlowRate) {
    var finalPhosphorous;
    var initialPhosphorous =  parseFloat(_historicalLabs["phosphorous"][_historicalLabs["phosphorous"].length-1]);
    var startingWeight = parseFloat(_historicalVitals["weight"][_historicalVitals["weight"].length-1]);
    var initialDialysate= _currentOrders["fluidDialysateValues"]["phosphorous"];
    var newDialysate = initialDialysate+((465/_currentOrders["timeToNextLabs"])/(effluentFlowRate*10));
    finalPhosphorous = calculateLab(initialPhosphorous, newDialysate, effluentFlowRate, _currentOrders["timeToNextLabs"], startingWeight, volumeOfDistribution, 0);
    return finalPhosphorous;
  }

  function calculateTotalHoursOfFiltration(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot) {
    switch (_currentCaseStudyId) {
      case 1:
        return calculateTotalHoursOfFiltrationCase1(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium);
        break;
      case 2:
        return calculateTotalHoursOfFiltrationCase2(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot);
        break;
    }
  }

  function calculateTotalHoursOfFiltrationCase1(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium) {
    var initialEFR = effluentFlowRate;
    var defaultHoursOfFiltration = 6;
    var hoursOfFiltration = defaultHoursOfFiltration;

    if ((_currentOrders["BFR"] <= 150 ) || (currentFiltrationFraction > 25 && currentFiltrationFraction <= 30 && _currentOrders.anticoagulation === 'none')) {
      hoursOfFiltration = 4;
    }

    if (currentFiltrationFraction > 30 && _currentOrders.anticoagulation === 'none') {
      hoursOfFiltration = 2;
    }
    if (_currentOrders.anticoagulation === 'citrate') {
      var initialCitrateResults = runCitrateCalculations(startingWeight, effluentFlowRate, ionizedCalcium);
      var initialPostFilterIonizedCalcium = initialCitrateResults["calciumFinalPostFilter"];
      console.log("calculateAdjustedEffluentFlowRate() : initialPostFilterIonizedCalcium : ", initialPostFilterIonizedCalcium);
      if (initialPostFilterIonizedCalcium > 0.45) {
        hoursOfFiltration = 4;
      }
    }
    return hoursOfFiltration;
  }

  function calculateTotalHoursOfFiltrationCase2(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot) {
    var initialEFR = effluentFlowRate;
    var defaultHoursOfFiltration = 6;
    var hoursOfFiltration = defaultHoursOfFiltration;

    if (_currentOrders["BFR"] < 150) {
      hoursOfFiltration = 4;
    }

    if (didClot) {
      hoursOfFiltration = 4;
    }

    return hoursOfFiltration;
  }

  function calculateAdjustedEffluentFlowRate(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot) {
    console.log(_currentCaseStudyId, typeof _currentCaseStudyId)
    switch (_currentCaseStudyId) {
      case 1:
        console.log("case 1 : calculateAdjustedEffluentFlowRateCase1():", calculateAdjustedEffluentFlowRateCase1(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium))
        return calculateAdjustedEffluentFlowRateCase1(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium);
        break;
      case 2:
        console.log("case 2 : calculateAdjustedEffluentFlowRateCase2()")
        return calculateAdjustedEffluentFlowRateCase2(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot);
        break;
    }
  }

  function calculateAdjustedEffluentFlowRateCase1(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium) {
    var initialEFR = effluentFlowRate;
    var adjustedEFR;
    var efrAdjustment = 1;
    // NOTE: these adjustments to the effluent flow rate based on BFR and filtration fraction
    // might only be applicable to case #1
    if ((_currentOrders["BFR"] <= 150 ) || (currentFiltrationFraction > 25 && currentFiltrationFraction <= 30 && _currentOrders.anticoagulation === 'none')) {
      efrAdjustment = 1.5;
    }

    if (currentFiltrationFraction > 30 && _currentOrders.anticoagulation === 'none') {
      efrAdjustment = 3;
    }
    if (_currentOrders.anticoagulation === 'citrate') {
      var initialCitrateResults = runCitrateCalculations(startingWeight, effluentFlowRate, ionizedCalcium);
      var initialPostFilterIonizedCalcium = initialCitrateResults["calciumFinalPostFilter"];
      console.log("calculateAdjustedEffluentFlowRate() : initialPostFilterIonizedCalcium : ", initialPostFilterIonizedCalcium);
      if (initialPostFilterIonizedCalcium > 0.45) {
        efrAdjustment = 1.5;
      }
    }
    adjustedEFR = initialEFR/efrAdjustment;
    return adjustedEFR;
  }

  function calculateAdjustedEffluentFlowRateCase2(effluentFlowRate, currentFiltrationFraction, startingWeight, ionizedCalcium, didClot) {
    var initialEFR = effluentFlowRate;
    var adjustedEFR;
    var efrAdjustment = 1;

    if (didClot) {
      efrAdjustment = 1.5;
    }

    if (_currentOrders["BFR"] < 150) {
      efrAdjustment = 1.5;
    }

    adjustedEFR = initialEFR/efrAdjustment;
    return adjustedEFR;
  }

  function saveLabValues(newLabs) {
    for(var i=0;i<_dynamicLabs.length;i++) {
      _historicalLabs[_dynamicLabs[i]].push(newLabs[_dynamicLabs[i]]);
    }
  }

  function setNewWeight(totalHoursOfFiltration) {
    var newWeight = excelRound(calculateNewWeight(_currentOrders, totalHoursOfFiltration), 2);
    console.log("newWeight : ", newWeight);
    _historicalVitals["weight"].push(newWeight);
  }

  function runCitrateCalculations(startingWeight, effluentFlowRate, ionizedCalciumInitial) {
    var results = {}

    var citrateFlowRateInMlPerHr = $('#citrateFlowRate').val();
    var citrateFlowRateInLPerHr = citrateFlowRateInMlPerHr/1000;
    var citrateBloodConcentrationConstant = 112.9;
    var citrateBloodConcentration = citrateFlowRateInLPerHr*citrateBloodConcentrationConstant/((_currentOrders["BFR"]*60/1000)+citrateFlowRateInLPerHr);
    var dialysateCalcium = _currentOrders["fluidDialysateValues"]["calcium"];
    var previousIonizedCalcium = _historicalLabs['ionizedCalcium'][_historicalLabs['ionizedCalcium'].length-1];
    var citrateInitial = citrateBloodConcentration;
    // NOTE: For now,  caCitInitial will be hard-coded.
    var caCitInitial = 0;
    var kForCaCit = 1;
    var caCitFinalPreFilter = (-1*(-ionizedCalciumInitial-citrateInitial-kForCaCit)-Math.sqrt(Math.pow(-ionizedCalciumInitial-citrateInitial-kForCaCit, 2)-4*(1)*(ionizedCalciumInitial*citrateInitial)))/(2*(1))
    var caFinalPreFilter = ionizedCalciumInitial - caCitFinalPreFilter;
    var citratFinalPreFilter = citrateInitial - caCitFinalPreFilter;
    var bicarbonateWithCitrateInitial = 13;
    var caFinalPostFilter = caFinalPreFilter*(1-(effluentFlowRate/(_currentOrders.BFR*60/1000))*((caFinalPreFilter-(dialysateCalcium/2))/caFinalPreFilter));
    var citratFinalPostFilter = citratFinalPreFilter*(1-(effluentFlowRate/(_currentOrders.BFR*60/1000)));
    var caCitFinalPostFilter = caCitFinalPreFilter*(1-(effluentFlowRate/(_currentOrders.BFR*60/1000)));
    var citrateMetabolismFactor = getCitrateMetabolismFactor();

    var calciumClInMmolPerL = 54;
    var calciumClFlowRateInMlPerHr = $('#caclInfusionRate').val();
    var calciumClFlowRateInLPerHr = calciumClFlowRateInMlPerHr/1000;
    var ionizedCalciumTotal = (caFinalPostFilter*(_currentOrders.BFR*60/1000)+calciumClInMmolPerL*calciumClFlowRateInLPerHr)/((_currentOrders.BFR*60/1000)+calciumClFlowRateInLPerHr)+caCitFinalPostFilter/2*citrateMetabolismFactor;

    var ionizedCalciumFinal = calculateLab(ionizedCalciumInitial, ionizedCalciumTotal, effluentFlowRate, _currentOrders["timeToNextLabs"], startingWeight, startingWeight*0.6, 0);
    var bicarbonateWithCitrateDialysate = 25+(((citratFinalPostFilter+caCitFinalPostFilter)*3)*citrateMetabolismFactor);
    var bicarbonateWithCitrateFinal = calculateLab(bicarbonateWithCitrateInitial, bicarbonateWithCitrateDialysate, effluentFlowRate, _currentOrders["timeToNextLabs"], startingWeight, startingWeight*0.6, -10);
    var calciumTotal = ((caFinalPostFilter*(_currentOrders.BFR*60/1000)+calciumClInMmolPerL*calciumClFlowRateInLPerHr)/((_currentOrders.BFR*60/1000)+calciumClFlowRateInLPerHr))*8+caCitFinalPostFilter*4;

    results["bicarbonate"] = excelRound(bicarbonateWithCitrateFinal, 2);
    results["calcium"] = excelRound(calciumTotal, 2);
    results["ionizedCalcium"] = excelRound(ionizedCalciumFinal, 2);
    results["calciumFinalPostFilter"] = excelRound(caFinalPostFilter, 2);

    return results;
  }

  function getCitrateMetabolismFactor() {
    var factor;
    if (_currentCaseStudyId === "2") {

      if (_currentTime < 48) {
        factor = 0;
      } else if (_currentTime < 72) {
        factor = 0.5;
      } else {
        factor = 1;
      }
    } else {
      factor = 1;
    }

    console.log("getCitrateMetabolismFactor() : _currentTime :", _currentTime);
    console.log("getCitrateMetabolismFactor() : factor :", factor);

    return factor;

  }

  function getOrders() {
    var orders = {
      fluid : $('input[name=fluid]:checked').val(),
      fluidDialysateValues : {
        "sodium": parseFloat($("#replacement-fluid-sodium-value").val()),
        "potassium": parseFloat($("#replacement-fluid-potassium-value").val()),
        "chloride": parseFloat($("#replacement-fluid-chloride-value").val()),
        "bicarbonate": parseFloat($("#replacement-fluid-bicarbonate-value").val()),
        "calcium": parseFloat($("#replacement-fluid-calcium-value").val())*4,
        "magnesium": parseFloat($("#replacement-fluid-magnesium-value").val()),
        "phosphorous": parseFloat($("#replacement-fluid-phosphorous-value").val()),
        "BUN": 0,
        "creatinine": 0
      },
      modality : $('input[name=modality]:checked').val(),
      anticoagulation : $('input[name=anticoagulation]:checked').val(),
      BFR : parseInt($('#bloodFlowRate').val()),
      Qr : parseInt($('#fluidFlowRate').val()),
      Qd : parseInt($('#fluidFlowRate').val()),
      grossUF : parseInt($('#grossHourlyFluidRemoval').val()),
      timeToNextLabs : calculateTimeToNextSetOfLabs(),
      otherFluidsSaline : $('input[name=otherFluidsSaline]:checked').val(),
      otherFluidsD5W : $('input[name=otherFluidsD5W]:checked').val(),
      otherFluidsSodiumPhosphate : $('input[name=otherFluidsSodiumPhosphate]:checked').val(),
      otherFluidsBolusValue :  parseFloat($('input[name=otherFluidsBolusValue]').val()),
      otherFluidsInfusionValue : parseFloat($('input[name=otherFluidsInfusionValue]').val())
    }
    var ff = calculateFiltrationFraction(orders);
    orders.filtrationFraction = ff;
    return orders;
  }

  function incrementTime() {
    _currentTime = _currentTime + _currentOrders["timeToNextLabs"];
  }

  function calculateNewWeight(orders, totalHoursOfFiltration) {
    // NOTE:
    // new weight = old weight + difference between input and output
    // 1L = 1Kg
    // output = ultrafiltration rate = Gross fluid removal = Gross ultrafiltration 
    console.log("calculateNewWeight() : totalHoursOfFiltration : ", totalHoursOfFiltration);

    var data = {}

    var totalInputInL = 0;
    var bolusValue = _currentOrders["otherFluidsBolusValue"];
    var infusionValue = _currentOrders["otherFluidsInfusionValue"];
    var otherFluidsSaline = _currentOrders["otherFluidsSaline"];
    var otherFluidsD5W = _currentOrders["otherFluidsD5W"];
    var otherFluidsSodiumPhosphate = _currentOrders["otherFluidsSodiumPhosphate"];
    var labFluidsInPastSixHoursInLiters = (parseFloat(_currentCaseStudySheet.inputOutput.elements[_currentTime+1]["previousSixHourTotal"]))/1000;

    totalInputInL += labFluidsInPastSixHoursInLiters;
    console.log("labFluidsInPastSixHoursInLiters :", labFluidsInPastSixHoursInLiters);
    console.log("totalInputInL :", totalInputInL);

    if(orders.anticoagulation === 'citrate') {
      var citrateFlowRateInLPerHr = (parseFloat($('#citrateFlowRate').val())/1000);
      var citratePastSixHoursInLiters = citrateFlowRateInLPerHr*6;
      totalInputInL += citratePastSixHoursInLiters;

      console.log("citratePastSixHoursInLiters : ", citratePastSixHoursInLiters);
      console.log("totalInputInL :", totalInputInL);

      var calciumClFlowRateInLPerHr = (parseFloat($('#caclInfusionRate').val())/1000);
      var calciumClPastSixHoursInLiters = calciumClFlowRateInLPerHr*6;
      totalInputInL += calciumClPastSixHoursInLiters;

      console.log("calciumClPastSixHoursInLiters : ", calciumClPastSixHoursInLiters);
      console.log("totalInputInL :", totalInputInL);
    }


    if(orders.otherFluidsSodiumPhosphate) {
      var sodiumPhosphateInLiters = 0.1;
      totalInputInL += sodiumPhosphateInLiters;
      console.log("totalInputInL :", totalInputInL);
    }

    if(bolusValue) {
      var bolusInL = bolusValue/1000;
      totalInputInL += bolusInL;
      console.log("bolusInL : ", bolusInL);
      console.log("totalInputInL :", totalInputInL);
    }

    if (infusionValue) {
      var infusionInL = infusionValue/1000;
      var infusionPastSixHours = infusionInL*6;
      totalInputInL += infusionPastSixHours;
      console.log("infusionPastSixHours : ", infusionPastSixHours);
      console.log("totalInputInL :", totalInputInL);
    }

    var startingTime = _currentTime - 6;
    for(var i=0;i<6;i++) {
      var input = 0;
      input += parseFloat(_currentCaseStudySheet.inputOutput.elements[startingTime+i+2]["total"]);

      if (orders.anticoagulation === 'citrate') {
        var citFlowRate = parseFloat($('#citrateFlowRate').val());
        var caclFlowRate = parseFloat($('#caclInfusionRate').val());

        if (citFlowRate) {
          input += citFlowRate;
          _historicalInputOutput["citrate"].push(citFlowRate);
        }

        if (caclFlowRate) {
          input += caclFlowRate;
          _historicalInputOutput["cacl"].push(caclFlowRate);
        }

      }

      if (infusionValue) {
        input += infusionValue;
      }

      if (i === 0){
        if (bolusValue) {
          input += bolusValue;
        }
        if (orders.otherFluidsSodiumPhosphate) {
          input += 100;
        }
      }

      _historicalInputOutput["totalInput"].push(input);
    }

    var startingTime = _currentTime-6;
    var ultrafiltrationStartingTime = _currentTime - totalHoursOfFiltration;
    var differenceBetweenStartingTimeAndHoursOfFiltration = _currentTime - totalHoursOfFiltration;

    // NOTE: Make sure we set the ultrafiltration rate to 0 for the time that
    // the filter is clogged.
    for (var i=0;i<differenceBetweenStartingTimeAndHoursOfFiltration;i++){
      _historicalInputOutput["ultrafiltration"][startingTime+i] = 0;
      // NOTE: For now, totalOutput == ultrafiltration -- however this may not be the case in the future
      _historicalInputOutput["totalOutput"][startingTime+i] = 0;
    }

    for (var i=0;i<totalHoursOfFiltration;i++){
      _historicalInputOutput["ultrafiltration"][ultrafiltrationStartingTime+i] = orders["grossUF"];
      // NOTE: For now, totalOutput == ultrafiltration -- however this may not be the case in the future
      _historicalInputOutput["totalOutput"][ultrafiltrationStartingTime+i] = orders["grossUF"];
    }

    for (var i=0;i<6;i++) {
      var input = _historicalInputOutput["totalInput"][startingTime+i];
      var output= _historicalInputOutput["totalOutput"][startingTime+i];
      _historicalInputOutput["netInputOutput"][startingTime+i]=input-output;
      if (startingTime+i === 0) {
        _historicalInputOutput["cumulativeInputOutput"][startingTime+i] = _historicalInputOutput["netInputOutput"][startingTime+i];
      } else {
        _historicalInputOutput["cumulativeInputOutput"][startingTime+i] = _historicalInputOutput["netInputOutput"][startingTime+i] + _historicalInputOutput["cumulativeInputOutput"][startingTime+i-1];
      }
    }

    var grossFiltrationPastSixHoursInLiters = (orders["grossUF"]/1000)*totalHoursOfFiltration;
    var previousWeightInKilos = parseFloat(_historicalVitals['weight'][_historicalVitals['weight'].length-1]);

    var currentWeightInKilos = previousWeightInKilos + (totalInputInL - grossFiltrationPastSixHoursInLiters);
    return currentWeightInKilos;
  }

  function calculateFiltrationFraction(orders) {
    var ff;
    var hct = getCurrentLab("hematocrit")/100;
    console.log("calculateFiltrationFraction : hematocrit ", hct);

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
    return excelRound(ff,2);
  }

  function calculateEffluentFlowRate(orders) {
    var efr;
    var currentFiltrationFraction = orders.filtrationFraction;

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
    // NOTE: edema = current weight - usual weight
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
    // NOTE: Certain things, like clotting, could alter
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
    newValue = excelRound(newValue, 2);
    return newValue

  }


  function preLabChecks(effluentFlowRate) {
    console.log("preLabChecks()");
    checkIfUsedCitrate();
    checkBloodFlowRate();
    checkDose(effluentFlowRate);

  }

  function postLabChecks() {
    switch (_currentCaseStudyId) {
      case 1:
        checkSodium();
        checkPotassium();
        checkChloride();
        checkBicarbonate();
        checkCalcium();
        checkMagnesium();
        checkPhosphorous();
        checkGrossUltrafiltration();
        handleSimulationCompletion();
        break;
      case 2:
        checkSodiumCase2();
        checkPotassiumCase2();
        checkChloride();
        checkBicarbonateCase2();
        checkCalciumCase2();
        checkMagnesiumCase2();
        checkPhosphorous();
        checkGrossUltrafiltration();
        handleSimulationCompletion();
        break;
    }

  }

  function checkIfUsedCitrate() {
    if(orders.anticoagulation === 'citrate') {
      _usedCitrate = true;

      if(currentTime === 6) {
        _usedCitrateFirst = true;
      }
    }
  }

  function checkBloodFlowRate() {
    var totalPoints = 0;
    if (_currentOrders["BFR"] >= 200 && _currentOrders["BFR"] <= 300) {
      console.log("checkBloodFlowRate() : within bounds ", _currentOrders["BFR"]);
      totalPoints = totalPoints + 5;
    }

    if (_currentOrders["BFR"] <= 150) {
      var msg = "The patient's nurse called.  She's been having many \"Low Return Pressure Alarms\" over the past 4 hours, and the machine is not running well.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (_currentOrders["BFR"] > 350 ) {
      var msg = "The patient's nurse called to inform you of frequent \"Access Pressure Extremely Low\" alarms, and had to decrease BFR to 300.";
      _newMessages.push(msg);
      _currentOrders["BFR"] = 300;
      totalPoints = totalPoints - 50;
    }
    _points.bloodFlowRateInRange.push(totalPoints);
    return;
  }

  function checkSodium() {
    var totalPoints = 0;
    var currentSodium = _historicalLabs["sodium"][_historicalLabs["sodium"].length-1];
    if (currentSodium >= 135 && currentSodium <= 145) {
      console.log("checkSodium() : within bounds ", currentSodium);
      totalPoints = totalPoints + 5;
    }

    if (currentSodium < 135) {
      var msg = "The primary team is concerned about the patient's hyponatremia. Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentSodium > 145) {
      var msg = "The primary team is concerned about the patient's hypernatremia. Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    _points.sodiumInRange.push(totalPoints);
    return;
  }

  function checkSodiumCase2() {
    var totalPoints = 0;
    var currentSodium = _historicalLabs["sodium"][_historicalLabs["sodium"].length-1];

    // Bonus 150 points if sodium is 154-156 (inclusive) after the first order
    if ((_currentTime === 6) && (currentSodium >= 154 && currentSodium <= 156)){
      totalPoints = totalPoints + 150;
    }

    if (currentSodium >= 150 && currentSodium <= 160) {
      console.log("checkSodium() : within bounds ", currentSodium);
      totalPoints = totalPoints + 5;
    }

    if (currentSodium < 150) {
      var msg = "The primary team is concerned about the patient's hyponatremia. Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }

    if (currentSodium > 160) {
      var msg = "The primary team is concerned about the patient's hypernatremia. Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }

    if (currentSodium > 170) {
      var msg = "The patient developed a subarachnoid hemorrhage in the hospital, and was transitioned to comfort care by the family. The sodium concentration >170 mmol/L was thought to be the main culprit. Try the scenario again, with less 3% saline";
      _caseOver = true;
      _newMessages.push(msg);
      totalPoints = totalPoints - 1000;
    }

    if (currentSodium < 130) {
      var msg = "The patient developed cerebral edema leading to brain herniation, and passed away. The sodium concentration <130 mmol/L was thought to be the etiology. Try the scenario again, without using D5W.";
      _caseOver = true;
      _newMessages.push(msg);
      totalPoints = totalPoints - 1000;
    }

    _points.sodiumInRange.push(totalPoints);
    return;
  }

  function checkPotassium() {
    var totalPoints = 0;
    var currentPotassium = _historicalLabs["potassium"][_historicalLabs["potassium"].length-1];

    if (currentPotassium > 3.3) {
      console.log("checkPotassium() : within bounds ", currentPotassium);
      totalPoints = totalPoints + 5;
    }

    if (currentPotassium < 3.3) {
      var msg = "The primary team is concerned about the patient’s hypokalemia.  Please modify the CRRT prescription";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    _points.potassiumInRange.push(totalPoints);
    return;
  }

  function checkPotassiumCase2() {
    var totalPoints = 0;
    var currentPotassium = _historicalLabs["potassium"][_historicalLabs["potassium"].length-1];

    if (currentPotassium > 3.3) {
      console.log("checkPotassium() : within bounds ", currentPotassium);
      totalPoints = totalPoints + 5;
    }

    if (currentPotassium < 3.3) {
      var msg = "The primary team is concerned about the patient’s hypokalemia.  Please modify the CRRT prescription";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentPotassium < 2.5){
      var d = Math.Random();
      if (d < 0.50 ){
        _caseOver = true;
        var msg = "The patient developed ventricular fibrillation, and resuscitation efforts were ended after 30 minutes of CPR. The patient’s extreme hypokalemia was thought to be the inciting factor. Try the case again, and make sure there is enough potassium in the replacement or dialysate fluid to maintain normal values.";
        totalPoints = totalPoints - 1000;
      }

    }

    _points.potassiumInRange.push(totalPoints);
    return;
  }

  function checkChloride() {
    // No errors associated with Chloride in Case #1
  }

  function checkBicarbonate() {
    checkPH();
  }

  function checkBicarbonateCase2() {
    checkPHCase2();
  }

  function checkPH() {
    var totalPoints = 0;
    var currentPH = _historicalLabs["pH"][_historicalLabs["pH"].length-1];
      
    if (currentPH >= 7.2 && currentPH <= 7.45) {
      console.log("checkPH() : within bounds ", currentPH);
      totalPoints = totalPoints + 10;
    }

    if (currentPH < 7.0) {
      var msg = "The patient has died of overwhelming sepsis and acidosis.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 1000;
    }

    if (currentPH < 7.2 && currentPH > 7.0) {
      var msg = "The primary team called with concerns regarding the patient's ongoing acidosis.  Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentPH > 7.45 && currentPH < 7.5) {
      var msg = "The primary team called with concerns regarding the patient's new alkalosis.  Please modify the CRRT prescription.”";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }

    if (currentPH > 7.5) {
      var msg = "The ICU team is very concerned about the patient’s alkalosis.  They will be calling your attending if it is not addressed immediately.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    _points.pHInRange.push(totalPoints);
    return;
  }

  function checkPHCase2() {
    var totalPoints = 0;
    var currentPH = _historicalLabs["pH"][_historicalLabs["pH"].length-1];
      
    if (currentPH < 7.0) {
      var msg = "The patient has died of overwhelming acidosis.";
      _newMessages.push(msg);
      _caseOver = true;
      totalPoints = totalPoints - 1000;
    }

    if (currentPH < 7.2 && currentPH > 7.0) {
      var msg = "The primary team called with concerns regarding the patient's ongoing acidosis.  Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentPH > 7.45 && currentPH < 7.55) {
      var msg = "The primary team called with concerns regarding the patient's new alkalosis.  Please modify the CRRT prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }

    if (currentPH > 7.55 && currentPH < 7.65) {
      var msg = "The ICU team is very concerned about the patient’s alkalosis.  They will be calling your attending if it is not addressed immediately.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentPH > 7.65) {
      var msg = "The patient developed intractable seizures, and sustained severe brain damage eventually leading to withdrawal of care. The alkalosis to > 7.65 was thought to be the inciting factor.";
      _newMessages.push(msg);
      _caseOver = true;
      totalPoints = totalPoints - 1000;
    }

    _points.pHInRange.push(totalPoints);
    return;
  }

  function checkCalcium() {
    // TODO: Doc from Ben says "NOT when using citrate" -- do we not run these checks if we are using citrate?
    // if using citrate - divide by 8
    var totalPoints = 0;
    var currentCalcium = _historicalLabs["calcium"][_historicalLabs["calcium"].length-1];

    if (currentCalcium >= 7.5 && currentCalcium <= 10) {
      console.log("checkCalcium() : within bounds ", currentCalcium);
      totalPoints = totalPoints + 5;
    }

    if (currentCalcium < 7.5) {
      var msg = "The primary team is concerned about the patient's ongoing hypocalcemia. Please modify the prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 1000;
    }

    if (currentCalcium > 10 && currentCalcium <= 12) {
      var msg = "The primary team is concerned about the patient's new hypercalcemia. Please modify the prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentCalcium > 12) {
      var msg = "The ICU team is very concerned about the patient's hypercalcemia. They will be calling your attending if it is not addressed immediately.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 200;
    }

    _points.calciumInRange.push(totalPoints);
    return;
  }

  function checkCalciumCase2() {
    var totalPoints = 0;
    var currentCalcium = _historicalLabs["calcium"][_historicalLabs["calcium"].length-1];

    if(orders.anticoagulation === 'citrate') {
      var currentCalciumIonized = _historicalLabs["ionizedCalcium"][_historicalLabs["ionizedCalcium"].length-1];
    }

    if (currentCalcium >= 8 && currentCalcium <= 10) {
      console.log("checkCalciumCase2() : within bounds ", currentCalcium);
      totalPoints = totalPoints + 5;
    }

    if (currentCalciumIonized >= 1.0 && currentCalciumIonized <= 1.3) {
      console.log("checkCalciumCase2() : ionized calcium within bounds ", currentCalciumIonized);
      totalPoints = totalPoints + 5;
    }

    if (currentCalciumIonized >= 1.1 && currentCalciumIonized <= 1.2) {
      console.log("checkCalciumCase2() : ionized calcium within bounds bonus", currentCalciumIonized);
      totalPoints = totalPoints + 5;
    }

    if (currentCalcium < 6.5) {
      var msg = "The patient developed ventricular fibrillation, and resuscitation efforts were ended after 30 minutes of CPR. The patient’s extreme hypocalcemia was thought to be the inciting factor. Try the case again, and make sure there is enough calcium in the replacement or dialysate fluid to maintain normal values";
      _newMessages.push(msg);
      _caseOver = true;
      totalPoints = totalPoints - 1000;
    }

    if (currentCalcium >= 6.5 && currentCalcium < 7.5) {
      var msg = "The primary team is concerned about the patient's ongoing hypocalcemia.  Please modify the prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentCalcium > 10 && currentCalcium <= 12) {
      var msg = "The primary team is concerned about the patient's new hypercalcemia. Please modify the prescription.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    if (currentCalcium > 12 && currentCalcium <= 14) {
      var msg = "The ICU team is very concerned about the patient's hypercalcemia. They will be calling your attending if it is not addressed immediately.";
      _newMessages.push(msg);
      totalPoints = totalPoints - 200;
    }

    if (currentCalcium > 14) {
      var msg = "The patient developed ventricular fibrillation, and resuscitation efforts were ended after 30 minutes of CPR. The patient’s extreme hypercalcemia was thought to be the inciting factor. Try the case again. If using citrate and make sure there is enough calcium in the replacement or dialysate fluid to maintain normal values.";
      _newMessages.push(msg);
      _caseOver = true;
      totalPoints = totalPoints - 1000;
    }

    _points.calciumInRange.push(totalPoints);
    return;
  }

  function checkMagnesium() {
    var totalPoints = 0;
    var currentMagnesium = _historicalLabs["magnesium"][_historicalLabs["magnesium"].length-1];

    if (currentMagnesium > 1.4) {
      console.log("checkMagnesium() : within bounds ", currentMagnesium);
      totalPoints = totalPoints + 5;
    }

    if (currentMagnesium < 1.4) {
      var msg = "The primary team is concerned about the patient's hypomagnesemia, and would like you to address it";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }

    _points.magnesiumInRange.push(totalPoints);
    return;
  }

  function checkMagnesiumCase2() {
    var totalPoints = 0;
    var currentMagnesium = _historicalLabs["magnesium"][_historicalLabs["magnesium"].length-1];

    if (currentMagnesium >= 1.0 && currentMagnesium < 1.4) {
      var msg = "The primary team is concerned about the patient's hypomagnesemia, and would like you to address it";
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
    }
      
    if (currentMagnesium < 1.0){
      var d = Math.Random();
      if (d < 0.20 ){
        _caseOver = true;
        var msg = "The patient developed Torsades de Pointes, and resuscitation efforts were ended after 30 minutes of CPR. The patient’s extreme hypomagnesemia was thought to be the inciting factor. Try the case again, and make sure there is enough magnesium in the replacement or dialysate fluid to maintain normal values.";
        totalPoints = totalPoints - 1000;
      }

    }

    _points.magnesiumInRange.push(totalPoints);
    return;
  }

  function checkPhosphorous() {
    // TODO: There will be a scheduled sodium phosphorous replacement option for when the sodium goes low, TBD
    //  - Adding sodium phosphate (15 mmol/dL) will modify the phosphate “[X] Dialysate” as follows:
    //      - (465/t(which will equal 6)) (Effluent Flow Rate *10)
    //      - This should reset after each cycle, so it’s not automatically given every 6 hours
    var totalPoints = 0;
    var currentPhosphorous = _historicalLabs["phosphorous"][_historicalLabs["phosphorous"].length-1];

    if (currentPhosphorous > 2.0) {
      console.log("checkPhosphorous() : within bounds (> 2.0)", currentPhosphorous);
      totalPoints = totalPoints + 10;
    }

    if (currentPhosphorous < 1) {
      console.log("checkPhosphorous() : < 1 ", currentPhosphorous);
      var msg = "The primary team is concerned about the patient's hypophosphatemia, and would like you to address the problem";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    _points.phosphorousInRange.push(totalPoints);
    return;
  }

  function checkGrossUltrafiltration() {
    var totalPoints = 0;
    var fluidInPastSixHoursInLiters = (parseFloat(_currentCaseStudySheet.inputOutput.elements[_currentTime+1]["previousSixHourTotal"]))/1000;
    var totalHoursOfFiltration = 6;
    // NOTE: If BFR is <= 150, grossUF for two hours is 0, therefore, we only have 4 hours of filtration. (This *might* only be for case study #1)
    if (_currentOrders["BFR"] <= 150) {
      totalHoursOfFiltration = 4;
    }
    var grossFiltrationPastSixHoursInLiters = (_currentOrders["grossUF"]/1000)*totalHoursOfFiltration;
    var filtrationRate = (grossFiltrationPastSixHoursInLiters - fluidInPastSixHoursInLiters)*1000;

    if (filtrationRate > 1500) {
      console.log("checkGrossUltrafiltration() : > 200 ", filtrationRate);
      var msg = "The patient's pressor requirements are increasing, and the team is concerned that the high rate of ultrafiltration is causing hemodynamic instability. Please reduce your ultrafiltration rate";
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
    }

    _points.grossUltrafiltrationInRange.push(totalPoints);
  }

  function checkFilterClottingCase1() {
    var totalPoints = 0;
    var currentFiltrationFraction = _currentOrders.filtrationFraction;
    var didClot = false;

    if (currentFiltrationFraction < 25) {
      console.log("checkFiltrationFraction() : within bounds ", currentFiltrationFraction);
      totalPoints = totalPoints + 5;
    }

    if (currentFiltrationFraction > 25 && currentFiltrationFraction <= 30 && _currentOrders.anticoagulation === 'none') {
      var msg = "The patient’s filter clotted once, and was replaced.";
      _numFiltersUsed = _numFiltersUsed + 1;
      _newMessages.push(msg);
      totalPoints = totalPoints - 50;
      didClot = true;
    }

    if (currentFiltrationFraction > 30 && _currentOrders.anticoagulation === 'none') {
      // TODO: effluent is divided by 3, gross UF for 4 hours will be 0 (Not sure what to do if BFR is also modifying effluent rate and UF time)
      var msg = "The patient’s filter clotted twice, and was replaced.";
      _numFiltersUsed = _numFiltersUsed + 2;
      _newMessages.push(msg);
      totalPoints = totalPoints - 100;
      ditClot = true;
    }

    _points.filtrationFractionInRange.push(totalPoints);
    return didClot;
  }
  function checkFilterClottingCase2(startingWeight, effluentFlowRate, ionizedCalcium) {
    var totalPoints = 0;
    var currentFiltrationFraction = _currentOrders.filtrationFraction;
    var didClot = false;

    var initialCitrateResults = runCitrateCalculations(startingWeight, effluentFlowRate, ionizedCalcium);
    var initialPostFilterIonizedCalcium = initialCitrateResults["calciumFinalPostFilter"];

    if (_currentOrders.anticoagulation === 'none') {
      var msg = "The filter clotted once, and was replaced.  The nurse reports that the access does not seem to be pulling well.  She has reversed the lines and positioned the patient appropriately.  The primary team does not feel a new access placement is currently possible given the highly elevated INR.";
      _numFiltersUsed = _numFiltersUsed + 1;
      _newMessages.push(msg);
      // For the first filter, we don't detract points for a clotted filter. For future filters, we subtract 100 points.
      //

      if (_numFiltersUsed !== 1){
        totalPoints = totalPoints - 100;

      }
      didClot = true;
    }

    if ( (initialPostFilterIonizedCalcium >= 0.3 ) && (initialPostFilterIonizedCalcium <=0.4) ) {
      // 10% chance of a clot
      var d = Math.Random();
      if (d < 0.10 ){
        didClot = true;
        totalPoints = totalPoints -50;
      }
    }

    if ( (initialPostFilterIonizedCalcium > 0.4 ) && (initialPostFilterIonizedCalcium <=0.5) ) {
      // 50% chance of a clot
      var d = Math.Random();
      if (d < 0.50 ){
        didClot = true;
        totalPoints = totalPoints -50;
      }
    }

    if (initialPostFilterIonizedCalcium > 0.5 ) {
      didClot = true;
      totalPoints = totalPoints -50;
    }

    if (currentFiltrationFraction < 25) {
      totalPoints = totalPoints + 5;
    }

    _points.filtrationFractionInRange.push(totalPoints);
    return didClot;
  }

  function checkDose(effluentFlowRate) {
    var dose;
    var effluentFlowRate = effluentFlowRate*1000;
    var totalPoints;
    switch(_currentOrders["modality"]) {
      case "pre-filter-cvvh":
        dose = (_currentOrders["BFR"] * 60/1000) / ((_currentOrders["BFR"] * 60/1000) + _currentOrders["Qr"] ) * effluentFlowRate / _currentCaseStudy.startingData.usualWeight;
        break;
      case "post-filter-cvvh":
        dose = effluentFlowRate / _currentCaseStudy.startingData.usualWeight;
        break;
      case "cvvhd":
        dose = effluentFlowRate / _currentCaseStudy.startingData.usualWeight;
        break;
    }

    if (dose >= 20 && dose <= 40) {
      totalPoints = 10;
    }

    if (dose >= 20 && dose <= 25) {
      // TODO: Ben didn't delineate how many extra points should be given
      // for dose values between 20 and 25. I set it to ten extra points (for
      // a total of 20), but should check with him.
      totalPoints = 20;
    }

    if ((dose < 20) || (dose > 40)) {
      totalPoints = -50;
    }
    _points.doseInRange.push(totalPoints);
    // NOTE: Set dose so we have access to it in the future
    _currentDose = excelRound(dose,1);
    _historicalDose.push(dose)

    return dose;
  }

  function handleSimulationCompletion() {
    // TODO:
    // * check to see if patient has died
    // * check to see if time limit has been reached
    // * handle simulation completion 
    //   - show results
    //   - disable orders/etc.
    var currentWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];
    var currentPH = _historicalLabs["pH"][_historicalLabs["pH"].length-1];
    var resultsOverview;
    var caseEndingTime = 90;

    console.log("handleSimulationCompletion : currentTime", _currentTime);

    if (currentPH < 7.0) {
      console.log("checkSimulationCompletion() : Patient has expired.");
      resultsOverview = "Your patient died of overwhelming acidosis and infection.  Mortality is high in critically ill patients who require dialysis, but your patient would have benefitted from more efficient CRRT.  Try increasing the bicarbonate concentration in the replacement or  dialysate fluid, or using more effective anticoagulation.  Restart the case and see if you can improve the outcome!";
      _caseOver = true;
    } else if (_currentTime === 72 && currentWeight < 98) {
      console.log("checkSimulationCompletion() : You won!");
      resultsOverview = "Your patient survived her episode of sepsis due to pneumonia, complicated by severe AKI requiring CRRT.";
      setResultsTableVariables();
      $("#resultsTable").show();
      _caseOver = true;
    } else if (_currentTime === 90) {
      console.log("checkSimulationCompletion() : Patient has expired.");
      resultsOverview = "Your patient developed a secondary infection in the ICU, and subsequently died of overwhelming sepsis.  Mortality is high in critically ill patients who require dialysis, but your patient would have benefitted from more aggressive fluid removal.  Try the case again and see if you can improve the outcome!";
      setResultsTableVariables();
      $("#resultsTable").show();
      _caseOver = true;
    }

    if (_caseOver) {
      console.log("case over!");
      $('#resultsOverview').text(resultsOverview);
      $('#resultsModal').modal('show');
      $('#ordersButton').hide();
      $('#resultsButton').show();
    }
  }

  function setResultsTableVariables() {
    console.log("setResultsTableVariables()");
    var numRounds = _currentTime/6;
    console.log("numRounds :", numRounds);

    var dosePointsEarned = sum(_points.doseInRange);
    var dosePointsMaxBonus = 350;
    var dosePointsPossible = (_points.maxPointsPerCycle["doseInRange"]*numRounds)+dosePointsMaxBonus;
    var doseAverageDelivered = excelRound(average(_historicalDose),2);
    var doseBonus = 0;
    if (doseAverageDelivered >= 20 && doseAverageDelivered <= 40) {
      doseBonus += 100;
    }

    if (doseAverageDelivered >= 20 && doseAverageDelivered <= 25) {
      doseBonus += 250;
    }

    var totalDosePoints = dosePointsEarned + doseBonus;

    var filterPointsEarned = sum(_points.filtrationFractionInRange);
    var filterPointsMaxBonus = 300;
    var filterPointsPossible = (_points.maxPointsPerCycle["filtrationFractionInRange"]*numRounds)+filterPointsMaxBonus;
    var filterNumberUsed = _numFiltersUsed;
    var filterAverageFilterLife = excelRound(_currentTime/_numFiltersUsed, 2);
    var filterAverageFiltrationFraction = excelRound(average(_historicalLabs["filtrationFraction"]),2);
    var filterBonus = 0;

    if(filterNumberUsed === 1) {
      filterBonus += 250;
    }

    if(filterAverageFiltrationFraction < 25) {
      filterBonus += 50;
    }

    var totalFilterPoints = filterPointsEarned+filterBonus;

    var finalSodiumScore = sum(_points.sodiumInRange);
    var finalPotassiumScore = sum(_points.potassiumInRange);
    var finalCalciumScore = sum(_points.calciumInRange);
    var finalMagnesiumScore = sum(_points.magnesiumInRange);
    var finalPhosphorousScore = sum(_points.phosphorousInRange);
    var electrolyteBonus = 0;
    var electrolytePointsMaxBonus = 200;
    var electrolytePointsEarned = finalSodiumScore+finalPotassiumScore+finalCalciumScore+finalMagnesiumScore+finalPhosphorousScore;
    var electrolytePointsPossible =
      (_points.maxPointsPerCycle["sodiumInRange"]*6)+
      (_points.maxPointsPerCycle["potassiumInRange"]*6)+
      (_points.maxPointsPerCycle["calciumInRange"]*6)+
      (_points.maxPointsPerCycle["magnesiumInRange"]*6)+
      (_points.maxPointsPerCycle["phosphorousInRange"]*6)+electrolytePointsMaxBonus;

    if (electrolytePointsEarned === electrolytePointsPossible) {
      electrolyteBonus += 200;
    }

    var totalElectrolytePoints = electrolytePointsEarned+electrolyteBonus;

    var acidBasePointsEarned = sum(_points.pHInRange);
    var acidBasePointsPossible = _points.maxPointsPerCycle["pHInRange"]*numRounds;
    var finalPH = _historicalLabs["pH"][_historicalLabs["pH"].length-1];
    var lowestPH = min(_historicalLabs["pH"]);
    var highestPH = max(_historicalLabs["pH"]);
    var acidBaseBonus = 0;

    if (_historicalLabs["pH"].every(pHInRange)) {
      acidBaseBonus += 250;
    }

    var totalAcidBasePoints = acidBasePointsEarned+acidBaseBonus;

    if (checkIfUsedCitrate()) {
      var citrateBonus = 0;
      var citratePointsEarned;
      var citratePointsMaxBonus = 150
      var citratePointsPossible = citratePointsMaxBonus;
      var citrateAveragePostFilterIonizedCalcium = average(_historicalLabs["calciumFinalPostFilter"]);

      if (_usedCitrate) {
        citrateBonus += 50;
      }

      if (_usedCitrateFirst) {
        citrateBonus += 100;
      }

      var totalCitratePoints = citrateBonus;
      $("#citrateSection").show();

    }

    var volumePointsEarned = 0;
    var volumePointsPossible = 200;
    var initialWeight = _historicalVitals["weight"][0];
    var finalWeight = _historicalVitals["weight"][_historicalVitals["weight"].length-1];

    var volumeCumulativeChange = excelRound(Math.abs(initialWeight-finalWeight),2);
    var volumeOverloadInitial = _historicalOverload[0];
    var volumeOverload48Hours = _historicalOverload[48/6];
    var volumeOverload72Hours = _historicalOverload[72/6];

    if (volumeOverload48Hours < 15){
      volumePointsEarned += 100;
    }

    if (volumeOverload72Hours < 10){
      volumePointsEarned += 100;
    } else {
      volumePointsEarned += -1000;
    }

    var totalVolumePoints = volumePointsEarned;

    var totalScore = totalDosePoints+totalFilterPoints+totalElectrolytePoints+totalAcidBasePoints+totalCitratePoints+totalVolumePoints;
    $("#totalDosePoints").text(totalDosePoints);
    $("#dosePointsPossible").text(dosePointsPossible);
    $("#doseAverageDelivered").text(doseAverageDelivered);
    $("#totalFilterPoints").text(totalFilterPoints);
    $("#filterPointsPossible").text(filterPointsPossible);
    $("#filterNumberUsed").text(filterNumberUsed);
    $("#filterAverageFilterLife").text(filterAverageFilterLife);
    $("#filterAverageFiltrationFraction").text(filterAverageFiltrationFraction);
    $("#totalElectrolytePoints").text(totalElectrolytePoints);
    $("#electrolytePointsPossible").text(electrolytePointsPossible);
    $("#finalSodiumScore").text(finalSodiumScore);
    $("#finalPotassiumScore").text(finalPotassiumScore);
    $("#finalCalciumScore").text(finalCalciumScore);
    $("#finalMagnesiumScore").text(finalMagnesiumScore);
    $("#finalPhosphorousScore").text(finalPhosphorousScore);
    $("#totalAcidBasePoints").text(totalAcidBasePoints);
    $("#acidBasePointsPossible").text(acidBasePointsPossible);
    $("#finalPH").text(finalPH);
    $("#lowestPH").text(lowestPH);
    $("#highestPH").text(highestPH);
    $("#totalCitratePoints").text(totalCitratePoints);
    $("#citratePointsPossible").text(citratePointsPossible);
    $("#citrateAveragePostFilterIonizedCalcium").text(citrateAveragePostFilterIonizedCalcium);
    $("#totalVolumePoints").text(totalVolumePoints);
    $("#volumePointsPossible").text(volumePointsPossible);
    $("#volumeCumulativeChange").text(volumeCumulativeChange);
    $("#volumeOverloadInitial").text(volumeOverloadInitial);
    $("#volumeOverload48Hours").text(volumeOverload48Hours);
    $("#volumeOverload72Hours").text(volumeOverload72Hours);
    $("#volumeInitialWeight").text(initialWeight);
    $("#volumeFinalWeight").text(finalWeight);
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

  function processMessages(){
    var newMessages = _newMessages;
    var messageContainer = $('<p></p>').addClass('card-text');
    var time = $('<p></p>').addClass('case-time').text(currentTimeToTimestamp(false, 0));
    messageContainer.append(time);

    for (var i=0; i<newMessages.length;i++){
      var message = $('<samp></samp>').text(newMessages[i]);
      messageContainer.append(message);
      messageContainer.append("<hr>");
    }

    if (newMessages.length === 0) {
      var message = $('<samp></samp>').text("CRRT is running smoothly. There were no reported issues since the previous update.");
      messageContainer.append(message);
      messageContainer.append("<hr>");
    }

    if (newMessages.length > 0) {
      _messages.push(newMessages);
      _newMessages = [];
    }

    $("#message-box").prepend(messageContainer);
  }

  function currentTimeToTimestamp(showTimeElapsed, additionalOffsetInHours=0) {
    var timestamp = moment(_startingTime).add(_currentTime, 'hours').add(additionalOffsetInHours, 'hours').format("H:mm");
    var currentDay = Math.floor(_currentTime/24)+1;

    if (showTimeElapsed === true) {
      timestamp += " (T+" + _currentTime + "hrs)";
    } 

    timestamp += " Day " + currentDay;

    return timestamp;
  }

  function pHInRange(element, index, array) {
    return (element >= 7.2 && element <= 7.45);
  }

  function sum(array) {
    var sum = array.reduce(function(previousValue, currentValue){
        return currentValue + previousValue;
    });
    return sum;
  }

  function average(array) {
    return (sum(array) / array.length);
  }

  function min(array) {
    return Math.min.apply(Math,array);
  }

  function max(array) {
    return Math.max.apply(Math,array);
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
    return (Math.round(val * coef))/coef;
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
