- [ ] add hypotonic saline calculations (just bite the bullet)
- [ ] finish checkDose() method
- [ ] add CRRT screen
- [ ] pH - use PC02 from labs
- [ ] calcWeight - factor in additional fluids
- [ ] calcFiltFract - dynamically set HCT (in labs data)
- [ ] checkCalcium - update to use iCal values when using citrate
- [ ] checkPhosphorous - update to use modified diaylsate when using Sodium Phosphate
- [ ] add case ending logic
- [ ] add results page 
- [ ] add scoring page
- [ ] add Q&A page
- [ ] add written material page
- [ ] add calculater page
- [ ] setup Google Sheets proxy
- [ ] add case #2
- [X] calcWeight - add case where citrate is in use / filter clots
- [X] checkFilterClotting - add case where citrate is in user / filter clots (run iCal calculation first, then run all labs with new effluent value)


preLabChecks()
 - set EFR for labs
runLabs()
  initialEFR = calculateEFR
  adjustedEFR = calculateAdjustedEFR(initialEFR)
    if citrate
      postFilterIonizedCalcium


  
