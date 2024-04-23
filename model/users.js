const fs = require('fs');
const userInfo = JSON.parse(fs.readFileSync('../userdb.json', 'utf-8'));
//**  you may need to change file path to absolute instead of relative


exports.getUsers=()=>{
    return userInfo;
}

exports.checkloginDetails = (username, password)=>{
    var check = false;
    for (var i=0; i < userInfo.length; i++) {
        if (userInfo[i].username == username && userInfo[i].password == password)   {
            check = true;
        }
    }
    return check;
}

exports.addNewUser = (username, password)=> {
    var jsonObj = {
        
        account_type: 0,
        username: "",
        password: ""
        
    }

    jsonObj.username = username;
    jsonObj.password = password;

    console.log(jsonObj);

    var data = JSON.stringify(jsonObj, null, 2);

    var count = Object.keys(userInfo).length;
    
    console.log(count);

    fs.appendFileSync("../userdb.json", ", " + data + "]");

}