import React from "react";

const NOCItem = ({ noc, handleDelete, handleEdit }) => {
  return (
    <div>
      <h3>{noc.title}</h3>
      <p>{noc.description}</p>
      <button onClick={() => handleEdit(noc)}>Edit</button>
      <button onClick={() => handleDelete(noc._id)}>Delete</button>
    </div>
  );
};

export default NOCItem;
