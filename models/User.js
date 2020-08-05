var userID, firstName, lastName, email, address1, address2, city, state, zipCode, country,password;

module.exports = class User {
  constructor(userID,firstName,lastName,email,address1,address2,city,state,zipCode,country,password){
      this.userID = userID;
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.address1 = address1;
      this.address2 = address2;
      this.city = city;
      this.state = state;
      this.zipCode = zipCode;
      this.country = country;
      this.password=password;
  }

  get getUserID(){
      return this.userID;
  }

  set setUserID(value){
      this.userID = value;
  }

  get getFirstName(){
      return this.firstName;
  }

  set setFirstName(value){
      this.firstName = value;
  }

  get getLastName(){
      return this.lastName;
  }

  set setLastName(value){
      this.lastName = value;
  }

  get getEmail(){
      return this.email;
  }

  set setEmail(value){
      this.email = value;
  }

  get getAddress1(){
      return this.address1;
  }

  set setAddress1(value){
      this.address1 = value;
  }

  get getAddress2(){
      return this.address2;
  }

  set setAddress2(value){
      this.address2 = value;
  }

  get getCity(){
      return this.city;
  }

  set setCity(value){
      this.city = value;
  }

  get getState(){
      return this.state;
  }

  set setState(value){
      this.state = value;
  }

  get getZipCode(){
      return this.zipCode;
  }

  set setZipCode(value){
      this.zipCode = value;
  }

  get getCountry(){
      return this.country;
  }

  set setCountry(value){
      this.country = value;
  }

  get getPassword(){
    return this.password;
}

set setPassword(value){
    this.password = value;
}
}
