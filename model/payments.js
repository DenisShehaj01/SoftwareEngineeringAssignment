currentBal = 0;

exports.setInit=()=>{
    currentBal = 0;
}

exports.getBal=()=>{
    return currentBal;
}

exports.addBal=(credit)=>{
    currentBal += credit;
    return currentBal;
}

exports.chargeFee=(fee)=>{
    currentBal -= fee;
    return currentBal;
}