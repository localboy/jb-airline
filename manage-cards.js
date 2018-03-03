(function(){
    'use strict';

    const FileSystemCardStore = require('composer-common').FileSystemCardStore;
    const cardStore = new FileSystemCardStore();
    
    return cardStore.getAll()
    .then(function(cardMap){
        console.log(cardMap.keys());

        let firstCard = cardMap.keys().next().value;
        console.log(firstCard);

        return cardStore.get(firstCard);
    })
    .then(function(idCard){
        console.log('Pull firstCard from file system: ', idCard.getUserName(),'@',idCard.getBusinessNetworkName());
        console.log('Connection profile name: ',idCard.getConnectionProfile().name);
        console.log('Credential', idCard.getCredentials());
        console.log('Role', idCard.getRoles());
    })
    .catch((error)=>{
        console.log('error',error);
    });
})();
