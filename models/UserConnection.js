var connection, rsvp;

module.exports=class UserConnection{
  constructor(connection, rsvp){
    this.connection= connection;
    this.rsvp=rsvp;
  }

  get getConnection(){
      return this.connection;
  }

  set setConnection(value){
      this.connection = value;
  }

  get getRvsp(){
      return this.rsvp;
  }

  set setRvsp(value){
      this.rsvp = value;
  }
}
