import React, {useState, useEffect} from 'react';
import axios from 'axios';
import UserForm from './Components/UserForm';
import './App.css';
import UserDetails from './Components/UserDetails';
import Loader from './Components/Loader';


function App() {
  let[showForm, setShowForm] = useState(false);
  let[users, setUsers] = useState([]);
  let[loading, setLoading] = useState(false);
  let[errorMessage, setErrorMessage] = useState(null);
  let[editMode, setEditMode] = useState(false);
  let[userToedit, setUser] = useState(null);

  //when ever the page load first time then this useEffect will run, with the help of these all user we can display in the home screen
  useEffect(() => {
    fetchUsers();
  }, []);


  function addUserHandler(){
    setEditMode(false);
    setShowForm(true);
  }


  function closeForm(){
    setShowForm(false)
  }


  function onCreateUser(user){

    //how to send POST request with the help of fetch
    // in this users is a collection whcih we created through this link 

    // fetch('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users.json', {
    //   method: 'POST',
    //   body: JSON.stringify(user),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })

    // fetch API will return a promise to with the help of then callback we use
    // .then((resp) => {
    //   console.log(resp)
    // })


    // with the use of axios 
    if(!editMode){
      axios.post('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users.json', user)
      
      // axios also return promise
      .then((response) => {
        console.log(response);

        // when click on create user button then this fetch user instant fetch that user to homescreen
        fetchUsers();
      })
    }
    else{
      console.log(user)
      console.log(userToedit);

      // with the help of put an updated details are stored into database 
      axios.put('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users/'+userToedit.id+'.json', user)
      .then((response) => {
        console.log(response);
        fetchUsers();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
    }

    //fetchUsers();
    setShowForm(false);
  }

  function fetchUsers(){

    //With the help of this function spinniner loading will be enabled
    setLoading(true);

    setErrorMessage(null);      // set error message state to null initially

    // fetch('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users.json')
    // .then((response) => {

    //    in fetch we didn't use catch match method so we need to throw error manually
    //   if(!response.ok){
    //     throw new Error("Something went wrong!");
    //   }
      
        //with the help of that data stored in collection will get  
    //   return response.json();
    // })
    
    // this promise will receive which data which then promise return above
    // .then((data) => {
    //   let userData = [];

    //   for(let key in data){

    //     push the data into a userData array
    //     userData.push({...data[key], id: key})
    //   }

    //   console.log(userData);

    //   with the help of that a setUsers will receive the updated data 
    //   setUsers(userData);
    // })
    // .catch((error) => {
    //   setErrorMessage(error.message);
    //   setLoading(false);
    // })
    
    axios.get('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users.json')
    .then((response) => {
      console.log(response);
      return response.data;
    })
    .then((data) => {
      let userData = [];

      for(let key in data){
        userData.push({...data[key], id: key})
      }
      //console.log(userData);
      setUsers(userData);

      // now we fetch data so we need to setLoading to false
      setLoading(false);
    })

    // with the help of catch handling the error 
    .catch((error) => {
      setErrorMessage(error.message);     // update the error state to error message 
      setLoading(false);
    })
  }

  function onEditUser(user){
    setEditMode(true);
    setUser(user);
    setShowForm(true);
    console.log(user);
  }

  // Delete button functionality
  function onDeleteUser(user){

    // with the help of this when user click on delete button it will ask you really want to delete
    let del = window.confirm("Do you really want to delete the record of " +user.firstName + " " +user.lastName);
    if(del){
      axios.delete('https://react-http-tutorial-828b4-default-rtdb.firebaseio.com/users/'+user.id+'.json')
      .then((response) => {
        console.log(response);
        fetchUsers();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      })
    }
    //console.log(user);
  }

  return (
      <div>
        <div className='page-header'>
          <button className='btn btn-success' onClick={addUserHandler}>Add User</button>
          <button className='btn btn-normal' onClick={fetchUsers}>Get Users</button>
        </div>
        
        {/* when loading detail will be false then show UserDetail components */}
        {!loading && !errorMessage && <UserDetails users={users} onEditUser={onEditUser} onDeleteUser={onDeleteUser}>
          </UserDetails>}

        {/* with the help of that error messege showed at  homescreen */}
        {errorMessage && <h3 style={{textAlign: 'center'}}>{errorMessage}</h3>}

        {/* when loading will be true then loader component will work */}
        {loading && <Loader></Loader>}

        {showForm && <UserForm closeForm={closeForm} onCreateUser={onCreateUser} editMode={editMode} user={userToedit}>
          </UserForm>}
      </div>
  );
}

export default App;
