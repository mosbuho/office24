import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BirthPopup,
  EmailPopup,
  NamePopup,
  PasswordDeletePopup,
  PhonePopup,
  UpdatePassword,
} from "../../components/member/Popups";
import { getNo } from "../../utils/auth";
import axios from "../../utils/axiosConfig";

function MemberMyInfo() {
  const navigate = useNavigate();
  const [activePopup, setActivePopup] = useState(null);
  const [modifiedFields, setModifiedFields] = useState({});
  const [memberData, setMemberData] = useState({
    no: "",
    id: "",
    name: "",
    phone: "",
    email: "",
    birth: "",
    gender: "",
    reg_date: "",
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const no = getNo();
        const response = await axios.get(`/member/${no}`);
        const formattedData = {
          ...response.data,
          birth: response.data.birth ? response.data.birth.split("T")[0] : "",
          reg_date: response.data.reg_date
            ? response.data.reg_date.split("T")[0]
            : "",
        };
        setMemberData(formattedData);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    fetchMemberData();
  }, []);

  //function updateLocalMemberData(field, value) {
  const updateLocalMemberData = (field, value) => {
    setMemberData((prevData) => ({
      ...prevData,
      [field]: value === "" ? null : value,
    }));
    setModifiedFields((prevFields) => ({
      ...prevFields,
      [field]: true,
    }));
  };
  //function edit handler
  const handleEdit = (field) => {
    setActivePopup(field);
  };

  //function save handler
  const handleSave = (field, value) => {
    updateLocalMemberData(field, value);
    setActivePopup(null);
  };

  //function close handler
  const handleClose = () => {
    setActivePopup(null);
  };

  //function put updatemember
  const submitMemberDataToServer = async () => {
    const no = getNo();
    console.log("Data being sent to server:", memberData);
    try {
      const response = await axios.put(`/member/${no}`, memberData);
      console.log("Server response:", response.data);
      alert("회원 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Error updating member data:", error);
      console.log("Error response from server:", error.response?.data);
      alert("회원 정보 업데이트에 실패했습니다.");
    }
  };

  return (
    <div className="info-container">
      <h2>내 정보</h2>
      <div className="info-row">
        <label>아이디</label>
        <span>{memberData.id}</span>
      </div>
      <div className="info-row bt" onClick={() => handleEdit("updatePassword")}>
        <label>비밀번호 변경</label>
      </div>
      <div
        className={`info-row ${modifiedFields.name ? "modified" : ""}`}
        onClick={() => handleEdit("name")}
      >
        <label>이름</label>
        <span>{memberData.name}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.phone ? "modified" : ""}`}
        onClick={() => handleEdit("phone")}
      >
        <label>전화번호</label>
        <span>{memberData.phone}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.email ? "modified" : ""}`}
        onClick={() => handleEdit("email")}
      >
        <label>이메일</label>
        <span>{memberData.email}</span>
        <u>수정</u>
      </div>
      <div
        className={`info-row ${modifiedFields.birth ? "modified" : ""}`}
        onClick={() => handleEdit("birth")}
      >
        <label>생년월일</label>
        <span>{memberData.birth}</span>
        <u>수정</u>
      </div>
      {Object.keys(modifiedFields).length > 0 && (
        <div className="info-row bt" onClick={submitMemberDataToServer}>
          <label>변경사항 적용</label>
        </div>
      )}
      <div className="info-row">
        <label>성별</label>
        <span>{memberData.gender === "M" ? "남성" : "여성"}</span>
      </div>
      <div className="info-row">
        <label>가입일</label>
        <span>{memberData.reg_date.split(" ")[0]}</span>
      </div>
      <div className="info-row bt" onClick={() => handleEdit("deleteUser")}>
        <label>회원 탈퇴</label>
      </div>
      {activePopup === "phone" && (
        <PhonePopup
          initialValue={memberData.phone}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "email" && (
        <EmailPopup
          initialValue={memberData.email}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "name" && (
        <NamePopup
          initialValue={memberData.name}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "birth" && (
        <BirthPopup
          initialValue={memberData.birth}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
      {activePopup === "updatePassword" && (
        <UpdatePassword onClose={handleClose} />
      )}
      {activePopup === "deleteUser" && (
        <PasswordDeletePopup onClose={handleClose} />
      )}
    </div>
  );
}

export default MemberMyInfo;
