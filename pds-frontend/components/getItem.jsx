import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export function GetItem() {
  const [itemID, setItemID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [itemCategory, setItemCategory] = useState(null);
  const [itemDescription, setItemDescription] = useState(null);
  const [itemPieces, setItemPieces] = useState([]);
  const [itemIamge, setItemImage] = useState(null);

  const checkItemID = (itemID) => {
    const itemRegex = /^\d+$/;
    return itemRegex.test(itemID);
  };

  const handleClick = async () => {
    let isvalid = checkItemID(itemID);
    setLoading(true);
    setItemCategory(null);
    setItemDescription(null);
    setItemPieces(null);
    setItemImage(null);
    setError(null);
    if (isvalid) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/getitem/${itemID}`,
          {
            withCredentials: true,
          }
        );
        setItemCategory(response.data.Category);
        setItemDescription(response.data.iDescription);
        setItemPieces(response.data.pieces);
        
        setItemImage(`data:image/jpeg;base64,${response.data.photo}`);

      } catch (error) {
        console.log("error", error.response.data.error);
        setError(error.response.data.error);
      }finally{
        setLoading(false);
      }
    }
    else{
      setLoading(false);
      setError("Invalid Item Id");
    }
    
  };

  return (
    <>
      <Link to="/">Home</Link>
      <div>
        <label htmlFor="item"></label>
        <input
          type="text"
          value={itemID}
          placeholder="Enter ItemID"
          onChange={(e) => setItemID(e.target.value)}
        />
        <button onClick={handleClick}>
            {loading ? 
                ("Loading..." ) : ("Get Item")
            }
        </button>
      </div>
      {error && (
        <div>
            {error}
        </div>
      )}

      {
        (itemCategory && itemDescription ) && (
            <div>
        <div>Item ID : {itemID}</div>
        <div>Category : {itemCategory}</div>
        <div>Item Description : {itemDescription}</div>
        <br />
        <div>Pieces:</div>
        {itemPieces.map((piece, index) => {
          return (
            <div key={index}>
              <div>Piece Number : {piece.pieceNum}</div>
              <div>Piece Description: {piece.pDescription}</div>
              <div>
                Piece Location:
                <div>Room Number: {piece.roomNum}</div>
                <div>Shelf Number: {piece.shelfNum}</div>
              </div>
              <br />
            </div>
          );
        })}
      </div>
        )
      }
      {itemIamge && (
        <img src={itemIamge}/>
      )}
    </>
  );
}
