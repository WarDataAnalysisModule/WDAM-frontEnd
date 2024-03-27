import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
    height: 50px;
    width: 200px;
    padding: 8px 16px;
    font-size: 16px;
    border-width: 1px;
    cursor: pointer;
    background-color: #6a772b; /* 버튼의 배경색을 이미지의 녹색 톤으로 조정합니다. */
    color: white; /* 버튼 내의 글자색을 흰색으로 변경합니다. */
    border: none; /* 테두리를 제거합니다. */
    border-radius: 50px; /* 버튼의 모서리를 둥글게 처리합니다. */
    padding: 10px 20px; /* 버튼 내부의 패딩을 조정합니다. */
    margin-top: 10px; /* 버튼과 다른 요소와의 상단 여백을 추가합니다. */
    cursor: pointer; /* 마우스 오버시 커서를 변경합니다. */

    &:hover {
        background-color: #689f38; /* 마우스 오버시 버튼의 배경색을 어둡게 변경합니다. */
    }
`;

const TransparentButton = styled.button`
background: transparent; /* 배경을 투명하게 설정 */
border: 1px solid transparent; /* 테두리를 투명하게 설정 */
color: #6a772b; /* 버튼 내의 글자색을 검정색으로 설정, 색상은 원하는 대로 변경 가능 */
padding: 10px 20px; /* 버튼 내부의 패딩을 조정 */
font-size: 16px; /* 글자 크기를 설정 */
cursor: pointer; /* 마우스 오버 시 커서를 변경 */
text-align: center; /* 텍스트를 가운데 정렬 */
display: block; /* 블록 레벨 요소로 만들어 너비 전체를 사용 */
margin: auto; /* 자동으로 마진을 주어 수평 중앙 정렬 */
`

const DisabledButton = styled.button`
    display: none;
`

const TagButton = styled.button`
background: transparent; /* 배경을 투명하게 설정 */
border: 1px solid transparent; /* 테두리를 투명하게 설정 */
color: #808080; /* 버튼 내의 글자색을 검정색으로 설정, 색상은 원하는 대로 변경 가능 */
padding: 10px 20px; /* 버튼 내부의 패딩을 조정 */
font-size: 12px; /* 글자 크기를 설정 */
cursor: pointer; /* 마우스 오버 시 커서를 변경 */
text-align: center; /* 텍스트를 가운데 정렬 */
margin-left: -0px;
`

const FileButton = styled.button`
display: flex;
justify-content: center; // 가로 중앙 text-align은 display:flex 없이도 사용가능
flex-wrap: wrap;
gap: 10px; // 버튼 사이의 간격
margin-top: 20px; // 버튼 상단 여백
background-color: #D0D0D0;
border: 1px solid transparent;
height: 50px;
width: 150px;
border-radius: 50px;
font-size: 14px;
text-align: center; // 가로 중앙
align-items: center; // 세로 중앙
cursor: pointer;
`

function Button(props) { // 모든 컴포넌트의 첫 글자가 대문자여야함 아니면 작동을 안함 (왜인지는 모르겠음)
    const { key, type, title, onClick } = props;
    if (type === "disabled") {
        return <DisabledButton></DisabledButton>
    }
    else if (type === "transparent") {
        return <TransparentButton onClick={onClick}>{title || "button"}</TransparentButton>
    }
    else if (type === "tag") {
        return <TagButton onClick={onClick}>{title || "button"}</TagButton>
    }
    else if (type === "file") {
        return <FileButton key={key} onClick={onClick}>{title || "button"}</FileButton>
    }
    return <StyledButton onClick={onClick}>{title || "button"}</StyledButton>
}

export default Button;