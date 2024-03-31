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
    position: absolute;
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

const Feature = [
    "부대 이동 속도 / 위치 변화",
    "인원/장비 수량 변화",
    "개체 탐지",
    "부대의 전투력",
    "부대의 행동",
    "부대의 피해 상황",
    "부대 정보",
    "부대 상태 및 지원"
]

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

const TestObject = [ // api로 받아오는 걸로 바꿀 예정
    "A-1-1중대",
    "A-1-2중대",
    "A-2-1중대",
    "A-2-2중대",
    "B-1-1중대"
]

const ObjectContainer = styled.div`
margin-left: 240px;
margin-bottom: 200px;
padding: 20px;
//margin: 20px;
border: 1px solid #ccc;
border-radius: 4px;
background-color: #f8f8f8;
color: #333;
font-size: 16px;
//margin-left: 240px;
//margin-top: 20px;
width: calc(50% - 320px);
`

const Container3 = styled.div`
    margin-left: 240px;
    margin-top: -150px;
    margin-bottom: 100px;
`

function Analysis(props) {
    const navigate = useNavigate();
    const [logTime, setLogTime] = useState([]); // 추후에 이 변수를 api로 계속 업데이트
    const [analysisResult, setAnalysisResult] = useState([]);
    
    const [showExplain, setShowExplain] = useState(true);

    const [chooseExplain, setChooseExplain] = useState(-1);
    const [selectedLog, setSelectedLog] = useState(-1);
    const [selectedFeature, setSelectedFeature] = useState(-1);
    const [selectedArmyUnit, setSelectedArmyUnit] = useState(-1);

    let currentTime = new Date(); // using test 나중에 api 되면 변경 예정
    const [simulTime, setSimulTime] = useState(''); // using test 나중에 api 되면 변경 예정

    const renderContent = () => {
        return (
            <Button title="파일 업로드로" onClick={()=>navigate('/fileupload')} />
        );
    }

    const renderObject = () => {
        return TestObject.map((obj, index) => ( // 추후에 api로 해당 TestObject를 받아옴
            <Button type="armyunit" isSelected={selectedArmyUnit === index} title={TestObject[index]} 
            key={index} onClick={()=>{setSelectedArmyUnit(index)}}/>
        ))
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
    const ExplainList = () => {
        return Feature.map((feat, index) => (
            <Button type="file" isSelected={selectedFeature === index} title={Feature[index]} key={index}
            onClick={()=>{setChooseExplain(index)
            setSelectedFeature(index)}} />
        ));
    }

    const submitAnalysis = async() => {
        try {
            if (selectedLog === -1 || selectedFeature === -1 || selectedArmyUnit === -1) {
                alert("시뮬레이션 날짜, 분석 특성, 분석 대상을 확인해주세요.")
                return;
            }
            const response = await fetch('http://localhost:8080/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trait: Feature[selectedFeature],
                    unit: TestObject[selectedArmyUnit],
                    // logtime: logTime[selectedLog]
                })
            });

            const data = await response.json();

            if (response.ok) {
                const response2 = await fetch('http://localhost:8080/api/analyze/result', {
                method: 'GET',
                headers: {
                    'Accept' : 'application/json', 
                }
                });

                if (response2.ok) {
                    const analysisData = await response2.json();
                    setAnalysisResult(...analysisResult, analysisData);
                }
                else {
                    console.error('분석 결과 가져오기 실패');
                }
            }
            else {
                console.error('분석 업로드 실패:', data);
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
        }
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
            {ExplainList()}
        </PropContainer>
        <TextBox 
        showExplain={showExplain}
        setShowExplain={setShowExplain}
        text={chooseExplain >= 0 ? ExplainFeature[chooseExplain] : ""}
        />
        <p style={{marginLeft: '240px', marginTop: '120px'}}>분석대상을 선택해주세요.</p>
        <ObjectContainer>
            {renderObject()}
        </ObjectContainer>
        <p style={{marginLeft: '240px'}}>{`${logTime[selectedLog]}
         ${Feature[selectedFeature]} ${TestObject[selectedArmyUnit]}`}</p>
        {/* 테스트용 문구 (api 연결 시 지워야함) */}
        <Container3><Button title={"분석하기"} onClick={submitAnalysis}></Button></Container3>
        
        <p style={{marginLeft: '240px', marginTop: '0px'}}>분석 결과</p>
        {/*밑의 TextBox에 모듈의 분석 결과를 출력해줌. 그리고 그에 맞는 분석 특성과 대상을 같이 보여줘야함. */}
        <TextBox
        title={Feature[selectedFeature]}
        showExplain={showExplain}
        setShowExplain={setShowExplain}
        text={chooseExplain >= 0 ? ExplainFeature[chooseExplain] : ""}
        />
        
        </div>
    </div>
    );
}

export default Analysis;