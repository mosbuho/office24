import React from "react";
import { OfficeItemListMock } from "../mocks/OfficeItemListMock";
import OfficeItem from "./OfficeItem";

const OfficeList = () => {
  return (
    <div className="office-list">
      {OfficeItemListMock.map((officeItem) => (
        <OfficeItem officeItem={officeItem} />
      ))}
    </div>
  );
};

export default OfficeList;
