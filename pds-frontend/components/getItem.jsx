import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { unescapeHTML } from "./utils";

export function GetItem() {
  const [itemID, setItemID] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [itemData, setItemData] = useState({
    iDescription : "",
    color : "",
    material : "",
    isNew : "",
    hasPieces : "",
    itemCategory : ""
  });
  const [itemPieces, setItemPieces] = useState([]);
  const [itemIamge, setItemImage] = useState(null);

  const checkItemID = (itemID) => {
    const itemRegex = /^\d+$/;
    return itemRegex.test(itemID);
  };

  const handleClick = async () => {
    let isvalid = checkItemID(itemID);
    setLoading(true);
    setItemData({
      iDescription : "",
      color : "",
      material : "",
      isNew : "",
      hasPieces : "",
      itemCategory : ""
    });
    setItemPieces([]);
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
          console.log(response.data);
        setItemData((currentState) => ({
          ...currentState,
          iDescription : response.data.iDescription,
          material : response.data.material ? response.data.material: "",
          color : response.data.color ? response.data.color : "",
          itemCategory : response.data.Category,
          isNew : !!response.data.isNew,
          hasPieces : !!response.data.hasPieces
          
        }));

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
        (itemData.itemCategory && itemData.iDescription ) && (
            <div>
        <div>Item ID : {itemID}</div>
        <div>Category : {itemData.itemCategory}</div>
        <div>Item Description : {unescapeHTML(itemData.iDescription)}</div>
        <div>Item Color : {unescapeHTML(itemData.color)}</div>
        <div>Item Material : {unescapeHTML(itemData.material )}</div>
        <div>Item is New : {itemData.isNew ? (<>Yes</>) : (<>No</>)}</div>
        <div>Item has more than 1 Pieces : {itemData.hasPieces ? (<>Yes</>) : (<>No</>)}</div>
        <br />
        <div>Pieces:</div>
        {itemPieces.map((piece, index) => {
          return (
            <div key={index}>
              <div>Piece Number : {piece.pieceNum}</div>
              <div>Piece Description: {unescapeHTML(piece.pDescription)}</div>
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
