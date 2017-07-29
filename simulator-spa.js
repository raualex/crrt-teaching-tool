$( document  ).ready(function() {
  CRRTApp.run();
});


var CRRTApp = (function() {

  var _caseStudies;
  var _currentCaseStudyId;
  var _currentCaseStudy;
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
      "intakeOutput": {
        "fentanyl": [
          5,  //1
          5,  //2
          5,  //3
          5,  //4
          5,  //5
          5,  //6
          5,  //7
          5,  //8
          5,  //9
          5,  //10
          5,  //11
          5,  //12
          5,  //13
          5,  //14
          5,  //15
          5,  //16
          5,  //17
          5,  //18
          5,  //19
          5,  //20
          5,  //21
          5,  //22
          5,  //23
          5,  //24
          5,  //25
          5,  //26
          5,  //27
          5,  //28
          5,  //29
          5,  //30
          5,  //31
          5,  //32
          5,  //33
          5,  //34
          5,  //35
          5,  //36
          5,  //37
          5,  //38
          5,  //39
          5,  //40
          5,  //41
          5,  //42
          5,  //43
          5,  //44
          5,  //45
          5,  //46
          5,  //47
          5,  //48
          5,  //49
          5,  //50
          5,  //51
          5,  //52
          5,  //53
          5,  //54
          5,  //55
          5,  //56
          5,  //57
          5,  //58
          5,  //59
          5,  //60
          5,  //61
          5,  //62
          5,  //63
          5,  //64
          5,  //65
          5,  //66
          5,  //67
          5,  //68
          5,  //69
          5,  //70
          5,  //71
          5,  //72
          5,  //73
          5,  //74
          5,  //75
          5,  //76
          5,  //77
          5,  //78
          5,  //79
          5,  //80
          5,  //81
          5   //82
          5,  //83
          5,  //84
          5,  //85
          5,  //86
          5,  //87
          5,  //88
          5,  //89
          5   //90
        ],
        "vasopressin": [
          6,  // 1
          6,  // 2
          6,  // 3
          6,  // 4
          6,  // 5
          6,  // 6
          6,  // 7
          6,  // 8
          6,  // 9
          6,  // 10
          6,  // 11
          6,  // 12
          6,  // 13
          6,  // 14
          6,  // 15
          6,  // 16
          6,  // 17
          6,  // 18
          6,  // 19
          6,  // 20
          6,  // 21
          6,  // 22
          6,  // 23
          6,  // 24
          6,  // 25
          6,  // 26
          6,  // 27
          6,  // 28
          6,  // 29
          6,  // 30
          6,  // 31
          6,  // 32
          6,  // 33
          6,  // 34
          6,  // 35
          6,  // 36
          6,  // 37
          6,  // 38
          6,  // 39
          6,  // 40
          6,  // 41
          6,  // 42
          6,  // 43
          6,  // 44
          6,  // 45
          6,  // 46
          6,  // 47
          6,  // 48
          6,  // 49
          6,  // 50
          6,  // 51
          6,  // 52
          6,  // 53
          6,  // 54
          6,  // 55
          6,  // 56
          6,  // 57
          6,  // 58
          6,  // 59
          6,  // 60
          6,  // 61
          6,  // 62
          6,  // 63
          6,  // 64
          6,  // 65
          6,  // 66
          6,  // 67
          6,  // 68
          6,  // 69
          6,  // 70
          6,  // 71
          6,  // 72
          6,  // 73
          6,  // 74
          6,  // 75
          6,  // 76
          6,  // 77
          6,  // 78
          6,  // 79
          12, // 80
          12, // 81
          12, // 82
          12, // 83
          12, // 84
          12, // 85
          12, // 86
          12, // 87
          12, // 88
          12, // 89
          6  // 90
        ],
        "cisatracurium" : [
          20,    //1
          20,    //2
          25,    //3
          25,    //4
          30,    //5
          30,    //6
          30,    //7
          30,    //8
          22,    //9
          22,    //10
          22,    //11
          22,    //12
          22,    //13
          22,    //14
          22,    //15
          22,    //16
          22,    //17
          22,    //18
          22,    //19
          22,    //20
          22,   //21
          22,   //22
          22,   //23
          22,   //24
          22,   //25
          22,   //26
          22,   //27
          22,   //28
          22,   //29
          22,   //30
          22,   //31
          22,   //32
          22,   //33
          22,   //34
          22,   //35
          22,   //36
          22,   //37
          22,   //38
          22,   //39
          22,   //40
          14,   //41
          14,   //42
          14,   //43
          14,   //44
          10,   //45
          7,    //46
          0,    //47
          0,    //48
          0,    //49
          0,    //50
          0,    //51
          0,    //52
          0,    //53
          0,    //54
          0,    //55
          0,    //56
          0,    //57
          0,    //58
          0,    //59
          0,    //60
          0,    //61
          0,    //62
          0,    //63
          0,    //64
          0,    //65
          0,    //66
          0,    //67
          0,    //68
          0,    //69
          0,    //70
          0,    //71
          0,    //72
          0,    //73
          0,    //74
          0,    //75
          0,    //76
          0,    //77
          0,    //78
          0,    //79
          0,    //80
          0,    //81
          0,    //82
          0,    //83
          0,    //84
          0,    //85
          0,    //86
          0,    //87
          0,    //88
          0,    //89
          0     //90
        ],
        "midazolam" : [
          5,    //1
          5,    //2
          5,    //3
          5,    //4
          5,    //5
          5,    //6
          5,    //7
          5,    //8
          5,    //9
          5,    //10
          5,    //11
          5,    //12
          5,    //13
          5,    //14
          5,    //15
          5,    //16
          5,    //17
          5,    //18
          5,    //19
          5,    //20
          5,    //21
          5,    //22
          5,    //23
          5,    //24
          5,    //25
          5,    //26
          5,    //27
          5,    //28
          5,    //29
          5,    //30
          5,    //31
          5,    //32
          5,    //33
          5,    //34
          5,    //35
          5,    //36
          5,    //37
          5,    //38
          5,    //39
          5,    //40
          5,    //41
          5,    //42
          5,    //43
          5,    //44
          5,    //45
          5,    //46
          2,    //47
          2,    //48
          2,    //49
          2,    //50
          2,    //51
          0,    //52
          0,    //53
          0,    //54
          0,    //55
          0,    //56
          0,    //57
          0,    //58
          0,    //59
          0,    //60
          0,    //61
          0,    //62
          0,    //63
          0,    //64
          0,    //65
          0,    //66
          0,    //67
          0,    //68
          0,    //69
          0,    //70
          0,    //71
          0,    //72
          2,    //73
          2,    //74
          2,    //75
          0,    //76
          0,    //77
          0,    //78
          0,    //79
          0,    //80
          0,    //81
          0,    //82
          0,    //83
          0,    //84
          0,    //85
          0,    //86
          0,    //87
          0,    //88
          0,    //89
          0     //90
        ], 
        "norepinephrine" : [
          350, //1
          350,    //2
          350,    //3
          350,    //4
          150,    //5
          150,    //6
          150,    //7
          150,    //8
          115,    //9
          115,    //10
          115,    //11
          115,    //12
          150,    //13
          150,    //14
          150,    //15
          150,    //16
          90,    //17
          90,    //18
          90,    //19
          90,    //20
          90,    //21
          90,    //22
          90,    //23
          90,    //24
          50,    //25
          50,    //26
          50,    //27
          50,    //28
          50,    //29
          50,    //30
          50,    //31
          50,    //32
          40,    //33
          40,    //34
          40,    //35
          40,    //36
          40,    //37
          40,    //38
          40,    //39
          40,    //40
          20,    //41
          20,    //42
          20,    //43
          20,    //44
          20,    //45
          20,    //46
          20,    //47
          20,    //48
          20,    //49
          20,    //50
          10,    //51
          10,    //52
          10,    //53
          10,    //54
           0,    //55
           0,    //56
           0,    //57
           0,    //58
           0,    //59
           0,    //60
           0,    //61
           0,    //62
           0,    //63
           0,    //64
           0,    //65
          0   //66
        ],
        "normalSalineCarrier": [
          40, //1
          40, //2
          40, //3
          40, //4
          10, //5
          10, //6
          10, //7
          10, //8
          22, //9
          23, //10
          21, //11
          20, //12
          80, //13
          75, //14
          77, //15
          70, //16
          5,  //17
          5,  //18
          5,  //19
          5,  //20
          8,  //21
          7,  //22
          9,  //23
          6,  //24
          7,  //25
          8,  //26
          6,  //27
          6,  //28
          6,  //29
          6,  //30
          6,  //31
          6,  //32
          6,  //33
          6,  //34
          6,  //35
          6,  //36
          6,  //37
          6,  //38
          6,  //39
          6,  //40
          6,  //41
          6,  //42
          6,  //43
          6,  //44
          6,  //45
          6,  //46
          6,  //47
          6,  //48
          6,  //49
          6,  //50
          6,  //51
          6,  //52
          6,  //53
          6,  //54
          6,  //55
          6,  //56
          6,  //57
          6,  //58
          6,  //59
          6,  //60
          6,  //61
          6,  //62
          6,  //63
          6,  //64
          6,  //65
          6   //66
        ],
        "meropenem" : [
          55, //1
          17,  //2
          38,  //3
          30,  //4
          30,  //5
          57.5,  //6
          17, //7
          12, //8
          45, //9
          30, //10
          34, //11
          26, //12
          30, //13
          15, //14
          36, //15
          36, //16
          36, //17
          36, //18
          36, //19
          36, //20
          36, //21
          36, //22
          36, //23
          36, //24
          36, //25
          36, //26
          36, //27
          36, //28
          36, //29
          36, //30
          36, //31
          36, //32
          36, //33
          36, //34
          36, //35
          36, //36
          36, //37
          36, //38
          36, //39
          36, //40
          36, //41
          36, //42
          36, //43
          36, //44
          36, //45
          36, //46
          36, //47
          36, //48
          36, //49
          36, //50
          36, //51
          36, //52
          36, //53
          36, //54
          36, //55
          36, //56
          36, //57
          36, //58
          36, //59
          36, //60
          36, //61
          36, //62
          36, //63
          36, //64
          36, //65
          36  //66
        ],
        "levoflaxacin" : [
          150,      //1
          0,      //2
          0,      //3
          0,      //4
          0,      //5
          0,      //6
          0,      //7
          0,      //8
          0,      //9
          0,      //10
          0,      //11
          0,      //12
          0,      //13
          0,      //14
          0,      //15
          0,      //16
          0,      //17
          0,      //18
          0,      //19
          0,      //20
          0,      //21
          0,      //22
          0,      //23
          150,    //24
          0,     //25
          0,     //26
          0,     //27
          0,     //28
          0,     //29
          0,     //30
          0,     //31
          0,     //32
          0,     //33
          0,     //34
          0,     //35
          0,     //36
          0,     //37
          0,     //38
          0,     //39
          0,     //40
          0,     //41
          0,     //42
          0,     //43
          0,     //44
          0,     //45
          0,     //46
          0,     //47
          150,   //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ],
          "calciumGluconate" : [
                //1
                //2
                //3
                //4
                //5
                //6
                //7
                //8
                //9
                //10
                //11
                //12
                //13
                //14
                //15
                //16
                //17
                //18
                //19
                //20
                //21
                //22
                //23
                //24
                //25
                //26
                //27
                //28
                //29
                //30
                //31
                //32
                //33
                //34
                //35
                //36
                //37
                //38
                //39
                //40
                //41
                //42
                //43
                //44
                //45
                //46
                //47
                //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ],
          "albumin" : [
                //1
                //2
                //3
                //4
                //5
                //6
                //7
                //8
                //9
                //10
                //11
                //12
                //13
                //14
                //15
                //16
                //17
                //18
                //19
                //20
                //21
                //22
                //23
                //24
                //25
                //26
                //27
                //28
                //29
                //30
                //31
                //32
                //33
                //34
                //35
                //36
                //37
                //38
                //39
                //40
                //41
                //42
                //43
                //44
                //45
                //46
                //47
                //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ],
          "vancomycin" : [
                //1
                //2
                //3
                //4
                //5
                //6
                //7
                //8
                //9
                //10
                //11
                //12
                //13
                //14
                //15
                //16
                //17
                //18
                //19
                //20
                //21
                //22
                //23
                //24
                //25
                //26
                //27
                //28
                //29
                //30
                //31
                //32
                //33
                //34
                //35
                //36
                //37
                //38
                //39
                //40
                //41
                //42
                //43
                //44
                //45
                //46
                //47
                //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ],
          "tubeFeeds" : [
                //1
                //2
                //3
                //4
                //5
                //6
                //7
                //8
                //9
                //10
                //11
                //12
                //13
                //14
                //15
                //16
                //17
                //18
                //19
                //20
                //21
                //22
                //23
                //24
                //25
                //26
                //27
                //28
                //29
                //30
                //31
                //32
                //33
                //34
                //35
                //36
                //37
                //38
                //39
                //40
                //41
                //42
                //43
                //44
                //45
                //46
                //47
                //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ],
          "totalStatic" : [
                //1
                //2
                //3
                //4
                //5
                //6
                //7
                //8
                //9
                //10
                //11
                //12
                //13
                //14
                //15
                //16
                //17
                //18
                //19
                //20
                //21
                //22
                //23
                //24
                //25
                //26
                //27
                //28
                //29
                //30
                //31
                //32
                //33
                //34
                //35
                //36
                //37
                //38
                //39
                //40
                //41
                //42
                //43
                //44
                //45
                //46
                //47
                //48
                //49
                //50
                //51
                //52
                //53
                //54
                //55
                //56
                //57
                //58
                //59
                //60
                //61
                //62
                //63
                //64
                //65
                //66

          ]


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
            10-20/LPF, // initial 1
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
            5-10/HPF, // initial 1
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
  }

  function setPageLabs(){
    for(var i = 0; i < _labs.length; i++) {
      $("#previous"+_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-2]);
      $("#current" +_labs[i].capitalize()).text(_historicalLabs[_labs[i]][_historicalLabs[_labs[i]].length-1]);
    }
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
    for(var i = 0; i < _labs.length; i++) {
      _historicalLabs[_labs[i]].push(_currentCaseStudy.startingData[_labs[i]+"Starting"]);
    }
    for(var i = 0; i < _vitals.length; i++) {
      _historicalVitals[_vitals[i]].push(_currentCaseStudy.startingData.vitalSigns[_vitals[i]+"Starting"]);
    }
    // Set initial pH
    var pH = calculatePH(_historicalLabs["bicarbonate"][_historicalLabs["bicarbonate"].length-1]);
    _historicalLabs["PH"][0] = pH;

    console.log("_currentCaseStudyId : ", _currentCaseStudyId);
    console.log("_currentCaseStudy : ", _currentCaseStudy);
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
      var ionizedCalciumFinal = calculateLab(ionizedCalciumInitial, ionizedCalciumTotal, effluentFlowRate, orders["timeToNextLabs"], currentWeight, currentWeight*0.6, 0);
      var bicarbonateWithCitrateDialysate = 25+(((citratFinalPostFilter+caCitFinalPostFilter)*3)*citrateMetabolismFactor);
      var bicarbonateWithCitrateFinal = calculateLab(bicarbonateWithCitrateInitial, bicarbonateWithCitrateDialysate, effluentFlowRate, orders["timeToNextLabs"], currentWeight, currentWeight*0.6, -10);
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
    setPageVariables();
  }

  function incrementTime(time) {
    _currentTime = _currentTime + time;
  }

  function calculateCurrentWeight(orders) {
    // TODO: We are currently ignoring fluid in for our calculations, need to ask ben how it should be calculated
    // old weight + difference between input and output
    // 1L = 1Kg
    // output = ultrafiltration rate = Gross fluid removal = Gross ultrafiltration 
    var fluidIn = 0;
    var previousWeight = _historicalVitals['weight'][_historicalVitals['weight'].length-1];
    var currentWeight = previousWeight + (fluidIn - orders["grossUF"]/1000);
    return currentWeight;
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

