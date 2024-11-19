import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export function Filter(){

    const { state } = useLocation();
    const [fetchResponse, setFetchResponse] = useState(null);
    const [error, setError] = useState(null);
    const nav = useNavigate();

    useEffect(() => {
        const fetchItems = async(formData) => {
            try {
                const response = await axios.post(`http://127.0.0.1:5000/api/category`, formData,
                {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                })

                setFetchResponse(response.data)

            } catch (error) {
                
                if (error.response){
                    setError(error.response.data.error)
                }else{
                    nav("/")
                }
            }
        }

        if (state){
            console.log(state);
            const formData = new FormData();
            formData.append("data", JSON.stringify(state))
            fetchItems(formData);
        }
        else{
            const formData = new FormData();
            formData.append("data", JSON.stringify({}))
            fetchItems(formData);
        }
         
   
    }, [state]);

    return (
        <div>
            <Link to ="/">Home</Link>
            <br />
            <Link to ="/categories">Select Categories</Link>
            <h3>Items</h3>
            {error && (
                <div>{error}</div>
            )}
            {fetchResponse && 
            fetchResponse.map((item) => (
                <div key = {item.ItemID}>
                    <div>Item ID: {item.ItemID}</div>
                    <div>Color : {item.color}</div>
                    <div>Has Pieces: {Boolean(item.hasPeces) ? "True" : "False"}</div>
                    <div>Is New: {Boolean(item.isNew) ? "True" : "False"}</div>
                    <div>Material : {item.material}</div>
                    <div>Category: {item.mainCategory}</div>
                    <div>Sub Category : {item.subCategory}</div>
                    <img src={`data:image/jpeg;base64,${item.photo}`}/>
                </div>
            )
            )} 
        </div>
    )

}