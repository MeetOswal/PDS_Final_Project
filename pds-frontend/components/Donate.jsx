import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { unescapeHTML } from "./utils";

export function Donate() {
  const [itemData, setItemData] = useState({
    donor: "",
    iDescription: "",
    color: "",
    isNew: null,
    hasPieces: null,
    material: "",
    image: null,
  });
  const empty = [
    {
      donor: itemData.donor,
      iDescription: "",
      color: "",
      isNew: null,
      hasPieces: null,
      material: "",
      image: null,
    },
    [
      {
        pieceNum: 1,
        pDescription: "",
        Length: "",
        width: "",
        height: "",
        roomNum: "",
        shelfNum: "",
        pNotes: "",
      },
    ],
  ];
  const [error, setError] = useState(null);
  const [isDonor, setIsDonor] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mainCategory, setMainCategory] = useState({
    options: [],
    selected: "",
  });
  const [subCategory, setSubCategory] = useState({
    options: [],
    selected: "",
  });
  const [pieceFields, setPieceFields] = useState([
    {
      pieceNum: 1,
      pDescription: "",
      Length: "",
      width: "",
      height: "",
      roomNum: "",
      shelfNum: "",
      pNotes: "",
    },
  ]);
  const nav = useNavigate();

  useEffect(() => {
    const checkStaff = async () => {
      try {
        await axios.get(`http://127.0.0.1:5000/api/check/staff`, {
          withCredentials: true,
        });

        setIsStaff(true);
      } catch (error) {
        if (error.response) {
          setError(error.response.data.error);
        } else {
          nav("/");
        }
      }
    };
    checkStaff();
  }, []);

  const checkDonor = async (e) => {
    e.preventDefault();
    if (itemData.donor.length > 0) {
      try {
        await axios.get(
          `http://127.0.0.1:5000/api/check/donator/${unescapeHTML(
            itemData.donor
          )}`,
          {
            withCredentials: true,
          }
        );
        setIsDonor(true);
        try {
          const response = await axios.get(
            `http://127.0.0.1:5000/api/getcategory`,
            {
              withCredentials: true,
            }
          );

          setMainCategory((currentState) => ({
            ...currentState,
            options: response.data.categories.map((category) => {
              return category.category;
            }),
          }));

          setSubCategory((currentState) => ({
            ...currentState,
            options: response.data.categories.reduce((acc, obj) => {
              acc[obj.category] = obj.sub_category;
              return acc;
            }, {}),
          }));
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        setIsDonor(false);
        if (error.response) {
          setError(error.response.data.error);
        } else {
          nav("/");
        }
      }
    }
  };

  const handleCategoryChange = (e) => {
    setMainCategory((currentState) => ({
      ...currentState,
      selected: e.target.value,
    }));

    setSubCategory((currentState) => ({
      ...currentState,
      selected: "",
    }));
  };

  const addPieceField = () => {
    setPieceFields((currentstate) => [
      ...currentstate,
      {
        pieceNum: currentstate.length + 1,
        pDescription: "",
        Length: "",
        width: "",
        height: "",
        roomNum: "",
        shelfNum: "",
        pNotes: "",
      },
    ]);
  };

  const isNumber = (value) => {
    const phoneRegex = /^\d+(\.\d+)?$/;
    return phoneRegex.test(value);
  };

  const validateNumbers = () => {
    let validationError = null;

    pieceFields.forEach((piece) => {
      if (!isNumber(piece.Length)) {
        validationError = `Piece number with ID ${piece.pieceNum} has invalid Length`;
      } else if (!isNumber(piece.width)) {
        validationError = `Piece number with pieceNum ${piece.pieceNum} has invalid. wpieceNumth`;
      } else if (!isNumber(piece.height)) {
        validationError = `Piece number with pieceNum ${piece.pieceNum} has invalid. height`;
      } else if (!isNumber(piece.roomNum)) {
        validationError = `Piece number with pieceNum ${piece.pieceNum} has invalid. Room Number`;
      } else if (!isNumber(piece.roomNum)) {
        validationError = `Piece number with pieceNum ${piece.pieceNum} has invalid. Room Number`;
      } else if (!isNumber(piece.shelfNum)) {
        validationError = `Piece number with ID ${piece.pieceNum} has invalid. Shelf Number`;
      }
    });

    if (validationError) {
      setError(validationError);
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const removePieceField = (pieceNum) => {
    setPieceFields(pieceFields.filter((field) => field.pieceNum !== pieceNum));
  };

  const onPieceChange = (id, attribute, value) => {
    setPieceFields(
      pieceFields.map((field) =>
        field.pieceNum == id ? { ...field, [attribute]: value } : field
      )
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const isValid = validateNumbers();
    if (
      isValid &&
      itemData.donor &&
      itemData.iDescription &&
      itemData.image &&
      mainCategory.selected &&
      subCategory.selected &&
      pieceFields &&
      itemData.isNew !== null &&
      itemData.hasPieces !== null
    ) {
      setLoading(true);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split("T")[0];
      const formData = new FormData();
      formData.append("donor", unescapeHTML(itemData.donor));
      formData.append("iDescription", unescapeHTML(itemData.iDescription));
      formData.append("color", unescapeHTML(itemData.color));
      formData.append("isNew", itemData.isNew);
      formData.append("hasPieces", itemData.hasPieces);
      formData.append("material", unescapeHTML(itemData.material));
      formData.append("mainCategory", mainCategory.selected);
      formData.append("subCategory", subCategory.selected);
      formData.append("donateDate", formattedDate);
      formData.append("photo", itemData.image);
      formData.append("pieces", JSON.stringify(pieceFields));
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/api/donate",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        setResult(response.data.message);
        setImagePreview(null);
        setItemData(empty[0]);
        setMainCategory((currentState) => ({...currentState, selected : ""}))
        setSubCategory((currentState) => ({...currentState, selected : ""}))
        setImagePreview(null);
        setPieceFields(empty[1]);
      } catch (error) {
        console.log(error);
        if (error.response) {
          setError(error.response.data.error);
        } else {
          setError("Something Went Wrong / Some Requierd Fields Missing");
        }
      } finally {
        setLoading(false);
      }
    }
    setLoading(false);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setError(null);

    if (!file) {
      setError("No File Selected");
      setItemData((currentState) => ({ ...currentState, image: null }));
      return;
    }

    if (file.size > 1024 * 1024) {
      setError("File size must be less than 1 MB");
      setItemData((currentState) => ({ ...currentState, image: null }));
      return;
    }
    setItemData((currentDate) => ({
      ...currentDate,
      image: file,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  if (!isStaff) {
    return (
      <div>
        <Link to="/">Home</Link>
        <div>{error}</div>
      </div>
    );
  }

  return (
    <>
      <Link to="/">Home</Link>
      <form onSubmit={handleSubmit}>
        <label htmlFor="donor">Donator </label>
        <input
          type="text"
          value={itemData.donor}
          onChange={(e) =>
            setItemData((currentState) => ({
              ...currentState,
              donor: e.target.value,
            }))
          }
          required
        />
        <button onClick={(e) => checkDonor(e)}>Enter Donor</button>
        <br />
        {isDonor && (
          <>
            <label htmlFor="iDescription">Item Description </label>
            <input
              type="text"
              value={itemData.iDescription}
              onChange={(e) =>
                setItemData((currentState) => ({
                  ...currentState,
                  iDescription: e.target.value,
                }))
              }
              required
            />
            <br />
            <label htmlFor="color">Item Color </label>
            <input
              type="text"
              value={itemData.color}
              onChange={(e) =>
                setItemData((currentState) => ({
                  ...currentState,
                  color: e.target.value,
                }))
              }
            />

            <div>
              <div>Item Is New?</div>
              <label htmlFor="isNew">Yes</label>
              <input
                type="checkBox"
                onChange={() =>
                  setItemData((currentState) => ({ ...currentState, isNew: 1 }))
                }
                checked={itemData.isNew == 1}
              />
              <label htmlFor="isNew">No</label>
              <input
                type="checkBox"
                onChange={() =>
                  setItemData((currentState) => ({ ...currentState, isNew: 0 }))
                }
                checked={itemData.isNew == 0}
              />
            </div>

            <div>
              <div>Has Pieces (More than 1)</div>
              <label htmlFor="hasPieces">Yes</label>
              <input
                type="checkBox"
                onChange={() =>
                  setItemData((currentState) => ({
                    ...currentState,
                    hasPieces: 1,
                  }))
                }
                checked={itemData.hasPieces == 1}
              />
              <label htmlFor="hasPieces">No</label>
              <input
                type="checkBox"
                onChange={() =>
                  setItemData((currentState) => ({
                    ...currentState,
                    hasPieces: 0,
                  }))
                }
                checked={itemData.hasPieces == 0}
              />
            </div>

            <label htmlFor="material">Item material</label>
            <input
              type="text"
              value={itemData.material}
              onChange={(e) =>
                setItemData((currentState) => ({
                  ...currentState,
                  material: e.target.value,
                }))
              }
            />
            <br />
            <label htmlFor="mainCategory">Category</label>
            <select
              id="mainCategory"
              value={mainCategory.selected}
              onChange={(e) => handleCategoryChange(e)}
            >
              <option value="">--Select--</option>
              {mainCategory.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <br />
            <label htmlFor="subCategory">Sub Category</label>
            <select
              id="subCategory"
              value={subCategory.selected}
              onChange={(e) =>
                setSubCategory((currentState) => ({
                  ...currentState,
                  selected: e.target.value,
                }))
              }
              disabled={!mainCategory.selected}
            >
              <option value="">--Select--</option>
              {subCategory.options[mainCategory.selected]?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <br />
            <br />
            <div>Pieces</div>
            {pieceFields.map((field) => {
              return (
                <div key={field.pieceNum}>
                  <label htmlFor={`piece-${field.pieceNum}-pDescription`}>
                    Piece Description
                  </label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-pDescription`}
                    value={field.pDescription}
                    onChange={(e) =>
                      onPieceChange(
                        field.pieceNum,
                        "pDescription",
                        e.target.value
                      )
                    }
                    required
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>
                    Piece Length
                  </label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-Length`}
                    value={field.Length}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "Length", e.target.value)
                    }
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>Piece Width</label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-width`}
                    value={field.width}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "width", e.target.value)
                    }
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>
                    Piece Height
                  </label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-height`}
                    value={field.height}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "height", e.target.value)
                    }
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>
                    Piece Room Location
                  </label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-roomNum`}
                    value={field.roomNum}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "roomNum", e.target.value)
                    }
                    required
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>
                    Piece Shelf Location
                  </label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-shelfNum`}
                    value={field.shelfNum}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "shelfNum", e.target.value)
                    }
                    required
                  />

                  <br />
                  <label htmlFor={`piece-${field.pieceNum}`}>Piece Notes</label>
                  <input
                    type="text"
                    id={`piece-${field.pieceNum}-pNotes`}
                    value={field.pNotes}
                    onChange={(e) =>
                      onPieceChange(field.pieceNum, "pNotes", e.target.value)
                    }
                  />

                  {field.pieceNum !== 1 && (
                    <a onClick={() => removePieceField(field.pieceNum)}>
                      Delete
                    </a>
                  )}
                  <br />
                  <br />
                </div>
              );
            })}

            <div>
              <a onClick={addPieceField}>Add Piece</a>
            </div>
            <div>
              <label htmlFor="image">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {imagePreview && (
                <div>
                  <div htmlFor="imagePreview">Image Preview</div>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ width: "300px", height: "auto" }}
                  />
                </div>
              )}
            </div>
            <button type="submit"> {!loading ? "Register" : "Sending"}</button>
          </>
        )}
      </form>
      {error && <div>{error}</div>}
      {result && <div>{result}</div>}
    </>
  );
}
