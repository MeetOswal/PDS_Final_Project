import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export function Category() {
    const [categories, setCategories] = useState([]);
    const [selectCategories, setSelectCategories] = useState({});
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);
    const nav = useNavigate(); 

    useEffect(() => {
        const getCategory = async() => {
            try {
                const response = await axios.get(
                `http://127.0.0.1:5000/api/getcategory`,
                {
                  withCredentials: true,
                })
                setCategories(response.data.categories);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.error)
                }
                else {
                    nav("/")
                }
            }finally {
                setLoading(false);
              }
        }
        getCategory();
    },[])

    const handleCategoryChange = (category) => {
        setSelectCategories((currentState) =>  {
            const newState =  {
                ...currentState, 
                [category]: currentState[category] ? undefined : []
            };
        
            if(!newState[category]){
                delete newState[category];
            }
            return newState
        });

    };

    const handleSubcategoryChange = (category, subCategory) => {
        setSelectCategories((currentState) => ({
            ...currentState,
            [category] : currentState[category]?.includes(subCategory) 
            ? currentState[category].filter((sub) => sub !== subCategory)
            : [...(currentState[category] || []), subCategory]
        }));
    };

    const handleSubmt = () => {
            nav("/filter", {state : selectCategories});
        
    }

    if (loading) {
        return <div>Loading...</div>
      }
    

    return (
        <>
        <Link to="/">Home</Link>
        <div>Select Categories</div>
        {categories && (
            <>
            {
                categories.map((category) => {
                    return(
                        <div key = {category.category}>
                            <input 
                            type="checkbox"
                            onChange={() => handleCategoryChange(category.category)}
                            checked = {!!selectCategories[category.category]}
                            />
                            <label>{category.category}</label>
                            {
                                selectCategories[category.category] !== undefined && 
                                category.sub_category?.map((sub_category) => {
                                    return(
                                    <div key = {sub_category} style={{ marginLeft: '20px' }}>
                                        <input type="checkbox"
                                        onChange={() => handleSubcategoryChange(category.category, sub_category)}
                                        checked = {selectCategories[category.category].includes(sub_category)} 
                                        />
                                        <label>{sub_category}</label>
                                        <br />
                                    </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
                
            }
            <button onClick={handleSubmt}
                >
                    Sumbit
            </button>
            </>
        )}
        {error && (
            <div>
                {error}
            </div>
        )}
        </>
        
    )
}