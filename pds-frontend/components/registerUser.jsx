import { useState } from "react";
import axios from "axios";
import validator from "validator";
import {Link, useNavigate } from "react-router-dom";



export function RegisterUser() {
    const [userName, setUserName] = useState("");
    const[passoword, setPasssword] = useState("");
    const[fname, setFname] = useState("");
    const[lname, setLaname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [loading, setLoading] =  useState(false);
    const [Error, setError] = useState("");
    const [phoneFields, setPhoneFields] = useState([{id : 1, value : ""}]);
    const [result, setResult] = useState(null)
    const nav = useNavigate();

    function sanitizeInput(input) {
        return validator.escape(input); 
    }

    const isPhoneNumber = (value) => {
        const phoneRegex = /^\d{10,12}$/;
        return phoneRegex.test(value);
    };

    const isEmail = (value) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(value);
    };

    const validatePhoneNumbers = () => {
        let validationError = null;
    
        phoneFields.forEach((phone) => {
          if (!isPhoneNumber(phone.value)) {
            validationError = `Phone number with ID ${phone.id} is invalid.`;
          }
        });

        if (validationError) {
            setError(validationError);
            return false;
          } else {
            setError("");
            return true; 
          }
    }

    const validateEmail = () => {
        let validationError = null;
        if (!isEmail(email)) {
            validationError = `Email is invalid.`;
          }
        
          if (validationError) {
            setError(validationError);
            return false; 
          } else {
            return true;
          }
    }

    const handleSubmit = async(event) => {
        event.preventDefault();
        setLoading(true)
        setResult("");
        
        const isValidPhone = validatePhoneNumbers();
        const isValidEmail = validateEmail();

        if (isValidPhone && isValidEmail) {
            const phoneNumbers = phoneFields.map((field) => field.value)
            const formData = new FormData();
            formData.append("username" , sanitizeInput(userName));
            formData.append("password", passoword);
            formData.append("fname", sanitizeInput(fname));
            formData.append('lname', sanitizeInput(lname));
            formData.append('email', sanitizeInput(email));
            formData.append('role', role);
            formData.append('phone', phoneNumbers);

            try {
                const response = await axios.post(
                    "http://127.0.0.1:5000/api/register",
                    formData,
                    {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    }
                );
                setResult(response.data.message);

            }catch(error) {
                setError(error.response.data.error);
            }finally {
                setLoading(false);
            }
        }

    }

    const addPhoneField = () => {
        setPhoneFields(currentstate => [...currentstate, {id : currentstate.length + 1, value : ""}]);
    }

    const removePhoneField = (id) => {
        setPhoneFields(phoneFields.filter(field => field.id !== id));
    }

    const onPhoneChange = (id, value) => {
        setPhoneFields(
        phoneFields.map((field) => 
            field.id == id ? {...field, value} : field
        )
        )
    }

    return (
        <div>
            <Link to = "/">Home</Link>
            <form onSubmit={handleSubmit}>
            
            <div>
                <label htmlFor="username">Username</label>
                <input 
                type="text"
                value={userName}
                placeholder="Set Username"
                onChange={(e) => setUserName(e.target.value)}
                required/>
            </div>

           <div>
                <label htmlFor="password">Password</label>
                <input 
                type="password"
                value={passoword}
                placeholder="Set Password"
                onChange={(e) => setPasssword(e.target.value)}
                required/>
           </div>

            <div>
                <label htmlFor="fname">First Name</label>
                <input 
                type="text"
                placeholder="Set First Name"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                required/>
            </div>

            <div>
                <label htmlFor="lname">Last Name</label>
                <input 
                type="text"
                placeholder="Set Last Name"
                value={lname}
                onChange={(e) => setLaname(e.target.value)}
                required/>
            </div>

            <div>
                <label htmlFor="email">Email</label>
                <input 
                type="text"
                placeholder=" Set Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required/>
            </div>

            <div>
                <div>
                    <input 
                    type="checkbox"
                    onChange={(e) => setRole("Client")}
                    checked = {role === "Client"}
                    />
                <label htmlFor="Clinet"> Clinet</label>
                </div>

                <div>
                    <input 
                    type="checkbox"
                    onChange={(e) => setRole("Donator")}
                    checked = {role === "Donator"}
                    />
                <label htmlFor="Clinet">Donator</label>
                </div>

                <div>
                    <input 
                    type="checkbox"
                    onChange={(e) => setRole("Volunteer")}
                    checked = {role === "Volunteer"}
                    />
                <label htmlFor="Clinet">Volunteer</label>
                </div>

                <div>
                    <input 
                    type="checkbox"
                    onChange={(e) => setRole("Staff")}
                    checked = {role === "Staff"}
                    />
                <label htmlFor="Staff">Staff</label>
                </div>

            </div>

            
            {
                
                phoneFields.map((field) =>{ 
                    return(
                    <div key={field.id}>
                        <label htmlFor={`phone-${field.id}`}>Phone {field.id}</label>
                        <input 
                        type ="text"
                        placeholder={` Set Phone ${field.id}`}
                        id = {`phone-${field.id}`} 
                        value = {field.value}
                        onChange={(e) => onPhoneChange(field.id, e.target.value)}/>
                        {
                            field.id !== 1 && (
                            <a onClick={() => removePhoneField(field.id)}>Delete</a>
                            )
                        }
                       
                    </div>
                )})
            }
            <div> <a onClick={addPhoneField}>Add Phone</a></div>
           
            <button type="submit">
                {!loading ? "Register" : "Sending"}
            </button>
            </form>

            {Error && (
                   <div>{Error}</div> 
            )}
            {result && (
                <div>{result}</div>
            )}
            {result == "User Registered Successfully" && (
                <Link to ="/login">Go to Login</Link>
            )}
        </div>
    )
}