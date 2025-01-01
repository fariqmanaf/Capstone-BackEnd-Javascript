const HttpRequestError = require("../utils/error");
module.exports = {
    makeTopic : async (nama, deskripsi) => {
        console.log(nama, deskripsi);
        
  

}, makeTopicDetail : async (data) => {
    const { nama, nim, prodi, role1, role2, noHp } = data;
  
  if (!nama || typeof nama !== 'string') {
    throw new HttpRequestError('Nama is required and must be a string');
  }
  
  if (!nim || typeof nim !== 'string') {
    throw new HttpRequestError('NIM is required and must be a string');
  }
  
  if (!prodi || typeof prodi !== 'string') {
    throw new HttpRequestError('Prodi is required and must be a string');
  }
  
  if (!role1 || typeof role1 !== 'string') {
    throw new HttpRequestError('Role1 is required and must be a string');
  }
  
  if (!role2 || typeof role2 !== 'string') {
    throw new HttpRequestError('Role2 is required and must be a string');
  }
  
  if (!noHp || typeof noHp !== 'string') {
    throw new HttpRequestError('No HP is required and must be a string');
  }
}
};