const fs = require('fs');
const bcrypt = require('bcrypt');

// Function to hash passwords in a JSON object
async function hashPasswords(jsonData) {
    for (let key in jsonData) {
        if (jsonData.hasOwnProperty(key) && typeof jsonData[key] === 'object') {
            const user = jsonData[key];
            if (user.hasOwnProperty('password')) {
                
                const hashedPassword = await bcrypt.hash(user.password, 10);
                
                user.password = hashedPassword;
            }
        }
    }
    return jsonData;
}


fs.readFile('userdb.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const updatedData = await hashPasswords(jsonData);
        
        
        fs.writeFile('userdb.json', JSON.stringify(updatedData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('Passwords hashed and saved successfully.');
        });
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
});