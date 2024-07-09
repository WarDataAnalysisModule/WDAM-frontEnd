import styled from "styled-components";

export const Wrapper = styled.div`
    padding: 16px;
    width: calc(100% - 32px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const Container = styled.div`
    width: 100%;
    max-width: 720px;

    :not(:last-child) {
        margin-bottom: 16px;
    }
    
    padding: 24px;
    border-radius: 8px; // 테두리 둥글게
    margin-bottom: 24px; // 마진 변경
`;

export const Container2 = styled.div`
    width: 100%;
    max-width: 720px;
    display: flex; // Flex 컨테이너로 만듭니다
    justify-content: center; // 수평 중앙 정렬
    align-items: center; // 수직 중앙 정렬
    border-radius: 8px;
    margin-top: 40px;
`;

export const StyledButtonContainer = styled.div`
    display: flex; // Flexbox 레이아웃 사용
    justify-content: center; // 자식 요소들을 수평 중앙으로 정렬
    gap: 16px; // 버튼 사이에 간격 추가
    margin-top: 20px; // 상단 여백 추가
    min-width: 120px;
    padding: 10px 20px;
`;

export const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;

`

export const FileButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px; // 버튼 사이의 간격
  margin-top: 20px; // 버튼 상단 여백
`;

export const InputsContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0;
`;

export const ButtonContainer2 = styled.div`
    position: absolute;
    left: 240px; // 사이드바의 너비에 맞춰서 조정
`

export const PropContainer = styled.div`
    display: flex;
    justify-content: left;
    flex-wrap: wrap;
    gap: 10px; // 버튼 사이의 간격
    margin-top: 20px; // 버튼 상단 여백
    margin-left: 220px;
    padding-left: 20px;
    width: 700px;
`

export const ObjectContainer = styled.div`
    margin-left: 240px;
    margin-bottom: 200px;
    padding: 20px;
    //margin: 20px;
    border: none;
    border-radius: 20px;
    background-color: #F1F7Ff;
    color: #333;
    font-size: 16px;
    //margin-left: 240px;
    //margin-top: 20px;
    width: calc(50% - 320px);
`

export const Container3 = styled.div`
    margin-left: 240px;
    margin-top: -150px;
    margin-bottom: 100px;
`

export const ContainerAnalysis = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 220px;
    margin-top: 30px;
    position: absolute;
    //position: relative;
    
    padding-left: 20px;
    width: calc(100% - 240px);
`

export const ResultContainer = styled.div`
    margin-left: 240px;
    margin-bottom: 80px;
    padding: 20px;
    //margin: 20px;
    border: none;
    border-radius: 20px;
    background-color: #F1F7Ff;
    color: #333;
    font-size: 16px;
    //margin-left: 240px;
    //margin-top: 20px;
    width: calc(100% - 320px);
`