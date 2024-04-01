import React, {useState} from 'react';
import styled from 'styled-components';
import Button from './Button';

// 스타일이 적용된 div 컴포넌트 생성
const Box = styled.div`
  padding: 20px;
  //margin: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  color: #333;
  font-size: 16px;
  //margin-left: 240px;
  margin-top: 20px;
  width: calc(100% - 320px);
`;

const TextBox = ({ text, showExplain, setShowExplain }) => {
  const toggleVisibility = () => {
      setShowExplain(!showExplain);
  }
  const title = showExplain ? "▼설명" : "▶설명";
  return (
  <div style={{marginLeft: "240px"}}>
    <Button type="explain" title={title} onClick={toggleVisibility}></Button>
    {showExplain && 
      <Box>
        {text.map((feature, index) => (
          <p key={index}>{feature}</p>
        ))}
      </Box>
    }
  </div>
  );
};

export default TextBox;
