import React from "react";
import styled from "styled-components"
import Spinner from '../../Spinner.gif';

const Background = styled.div`
position: fixed;
width: 100%;
height: 100%;
top: 0;
left: 0;
background: #ffffffe0;
z-index: 999;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
`;

const LoadingText = styled.div`
font: 1rem 'Noto Sans KR';
text-align: center;
font-size: 30px;
`;

export const Loading = () => {
    return (
        <Background>
            <LoadingText>처리 중입니다...</LoadingText>
            <img src={Spinner} alt="로딩 중" width="20%" />
        </Background>
    )
};

export default Loading;