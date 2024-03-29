import React, {useEffect, useRef, useState} from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Button from '../ui/Button';
import data from '../../data.json';
import TextInput from '../ui/TextInput';
import icon from '../../wdam.png'
import Log from '../ui/Log';
import TextBox from '../ui/TextBox';

const ButtonContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 20px;
`

const ButtonContainer2 = styled.div`
  position: absolute;
  left: 240px; // 사이드바의 너비에 맞춰서 조정
`

const Container = styled.div`
    display: flex;
    margin-left: 220px;
    margin-top: 20px;
    position: fixed;
    //position: relative;
    
    padding-left: 20px;
    width: calc(100% - 240px);
`

const PropContainer = styled.div`
display: flex;
justify-content: left;
flex-wrap: wrap;
gap: 10px; // 버튼 사이의 간격
margin-top: 20px; // 버튼 상단 여백
margin-left: 220px;
padding-left: 20px;
`

const ExplainFeature = [
    "부대 이동 속도 / 위치 변화 설명",
    "인원/장비 수량 변화 설명",
    "개체 탐지 설명",
    "부대의 전투력 설명",
    "부대의 행동 설명",
    "부대의 피해 상황 설명",
    "부대 정보 설명",
    "부대 상태 및 지원 설명"
]

function Analysis(props) {
    const navigate = useNavigate();
    const [logTime, setLogTime] = useState([]); // 추후에 이 변수를 api로 계속 업데이트
    const [selectedLog, setSelectedLog] = useState(-1);
    let currentTime = new Date(); // using test
    const [simulTime, setSimulTime] = useState(''); // using test
    const [chooseExplain, setChooseExplain] = useState(-1);
    const [showExplain, setShowExplain] = useState(true);

    const renderContent = () => {
        return (
            <Button title="파일 업로드로" onClick={()=>navigate('/fileupload')} />

        );
    }

    useEffect(() => {
        if (!localStorage.getItem('userId')) navigate('/');
    }, [navigate])
    const LogList = () => {
        return logTime.map((log, index) => (
            <Button type="log" isSelected={selectedLog === index} title={log} key={index} onClick={()=>
            {setSelectedLog(index)
            setSimulTime(log)}} /> // using test
        ));
    }


    return (
    <div>
        <div style={{position: "fixed", width: "200px", height: "100%", 
        backgroundColor: "#F0F0F0", color: "black",
        fontSize: "17px", overflowY: "auto"}}><div style={{padding: "15px", textAlign: "center", fontWeight: "Bold", 
        marginBottom: "20px"}}>분석 로그</div><Log />{LogList()}</div>
        <ButtonContainer>
            <ButtonContainer2>{renderContent()}</ButtonContainer2>
            <Button type="tag" title="로그아웃" onClick={()=> {
                localStorage.setItem('userId', '');
                navigate('/');
            }}/>
            <p style={{fontSize: "15px", color: '#808080', marginLeft: '-12px', marginRight: '-12px'}}>|</p>
            <Button type="tag" title={"마이페이지"} onClick={()=> {
                navigate('/mypage');
            }}/>
            <Button title="test" type="tag" onClick={()=> {
                setLogTime(logTime => [...logTime, 
                    `${currentTime.getHours()}:${currentTime.getMinutes()}:${currentTime.getSeconds()}`]) // using test
            }}/>
        </ButtonContainer>
        <Container>
            <Button type="square" title={`파일 업로드 시간 : ${simulTime}`} />
            {/* api로 시간 가져와야함 */}
        </Container>
        <div style={{overflowY: "auto"}}>
        <p style={{marginLeft: '240px', marginTop: '120px'}}>분석 특성은 무엇입니까? 아래 메뉴에서 선택해주세요.</p>
        <PropContainer>
            <Button type="file" title="부대 이동 속도 / 위치 변화"
            onClick={()=>setChooseExplain(0)}/>
            <Button type="file" title="인원/장비 수량 변화"
            onClick={()=>setChooseExplain(1)}/>
            <Button type="file" title="개체 탐지"
            onClick={()=>setChooseExplain(2)}/>
            <Button type="file" title="부대의 전투력"
            onClick={()=>setChooseExplain(3)}/>
            <Button type="file" title="부대의 행동"
            onClick={()=>setChooseExplain(4)}/>
            <Button type="file" title="부대의 피해 상황"
            onClick={()=>setChooseExplain(5)}/>
            <Button type="file" title="부대 정보"
            onClick={()=>setChooseExplain(6)}/>
            <Button type="file" title="부대 상태 및 지원"
            onClick={()=>setChooseExplain(7)}/>
        </PropContainer>
        <TextBox 
        showExplain={showExplain}
        setShowExplain={setShowExplain}
        text={chooseExplain >= 0 ? ExplainFeature[chooseExplain] : ""}
        />

        </div>  
    </div>
    );
}

export default Analysis;