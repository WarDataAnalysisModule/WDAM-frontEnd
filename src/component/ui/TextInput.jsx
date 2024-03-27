import React from "react";
import styled from "styled-components";
import iconId from '../../id.png'
import iconPassword from '../../password.jpg'
import iconPhone from '../../phone.png'
import iconEmail from '../../email.png'

const iconMap = {
  ID: iconId,
  password: iconPassword,
  phone: iconPhone,
  email: iconEmail
}

const StyledTextarea = styled.textarea`
    width: calc(100% - 32px);
    ${(props) =>
        props.height &&
        `
        height: ${props.height}px;
    `}
    padding: 16px;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 16px; // 마진 추가
    border: 1px solid #6a772b; // 테두리 색 변경
    border-radius: 4px; // 테두리 둥글게


    &:focus {
        border-color: #4a90e2; // 포커스시 테두리 색 변경
    }
`;

const StyledInput = styled.input`
width: 70%;
height: ${props => props.height || 30}px;
padding: 0 12px;
padding-left: 44px; //

font-size: 16px;
border: 1px solid #6a772b; // 테두리 색상 조정
//border-top: none; // 모든 입력 필드의 상단 테두리 제거
box-sizing: border-box;
margin: 0px;
margin-left: 115px;

background-image: url(${props => iconMap[props.icon]}); /* 배경 이미지로 아이콘 추가 */
  background-repeat: no-repeat;
  background-position: 12px center; /* 아이콘 위치 조정 */
  background-size: 20px; /* 아이콘 크기 조정 */

&:focus {
  border-color: #6a772b;
  outline: none;
}

// 첫 번째 입력 필드의 상단 테두리를 추가
&:first-child {
  border-top: 1px solid #6a772b;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

// 마지막 입력 필드의 하단 테두리를 추가
// &:last-child {
//   border-bottom: 1px solid #6a772b;
//   border-bottom-left-radius: 8px;
//   border-bottom-right-radius: 8px;
// }


&:nth-child(2) {
  border-top: 1px solid #6a772b;
  margin-top: -20px;
}

&:nth-child(3) {
  border-top: 1px solid #6a772b;
  margin-top: -20px;
}

&:nth-child(4) {
  border-top: 1px solid #6a772b;
  margin-top: -20px;
}

&:last-child {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  margin-top: -20px;
}

&::placeholder {
  color: ${props => props.readOnly ? 'black' : 'gray'};
}

`;


function TextInput(props) {
    const { type, height, value, onChange, placeHolder, icon, disabled } = props;

    return <StyledInput icon={icon} type={type || "text"} height={height} value={value} 
    onChange={onChange} placeholder={placeHolder} readOnly={disabled ? true : false}/>;
}

export default TextInput;
    