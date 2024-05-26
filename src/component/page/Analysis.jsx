import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import Log from '../ui/Log';
import TextBox from '../ui/TextBox';
import Loading from '../content/Loading';
import {
    ButtonContainer,
    ButtonContainer2,
    PropContainer,
    ObjectContainer,
    Container3,
    ContainerAnalysis,
    ResultContainer
} from '../style/StyleComponent';

const Feature = [
    "부대 이동 속도 / 위치 변화",
    "인원/장비 수량 변화",
    "개체 탐지",
    "부대의 전투력",
    "부대 행동",
    "부대의 피해 상황",
    "부대 정보",
    "부대 상태 및 지원"
]

const ExplainFeature = [
    "- 부대 이동 속도 / 위치 변화 : 출발지, 목적지 위치까지의 거리와 걸린 시간을 이용하여 속도를 계산한다.",
    "- 인원 / 장비 수량 변화 : 사격 이벤트 발생 후 분석 대상의 인원 / 장비 수량을 비율로 비교한다.",
    "- 개체 탐지 : 분석 대상이 감지한 적이 감지된 시점, 거리, 피해량 등을 분석한다.",
    "- 부대의 전투력 : 분석 대상의 피해상태, 화력을 분석한다.",
    "- 부대의 행동 : 분석 대상이 행하고 있는 동작을 출력한다.",
    "- 부대의 피해 상황 : 분석 대상의 인원, 장비 수량 변화와 피해 상태, 화력을 분석한다.",
    "- 부대 정보 : 모든 부대의 이름, 상태, 구성인원, 장비, 무기를 이름별로 출력한다.",
    "- 부대 상태 및 지원 : 피해 상태가 Moderate Damaged인 모든 부대의 시뮬레이션 시간, 부대 이름, 화력을 분석한다."
]

function Analysis(props) {
    let Allunit = false; // 모든 부대를 대상으로 하는지 안하는지 확인
    // useState를 통해서 다른 요소가 바뀌면 재렌더링될때마다 false로 값이 바뀜
    const location = useLocation();
    const simulationTimeArray = location.state.uploadedData.data;//[];
    const navigate = useNavigate();
    const [logTime, setLogTime] = useState([]); // 추후에 이 변수를 api로 계속 업데이트
    const [analysisResult, setAnalysisResult] = useState([]);
    const [unitList, setUnitList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const [showSelected, setShowSelected] = useState(true);
    const selectedTitle = showSelected ? "▼ 분석 특성은 무엇입니까? 아래 메뉴에서 선택해주세요." : "▶ 분석 특성은 무엇입니까? 아래 메뉴에서 선택해주세요.";
    const [showExplain, setShowExplain] = useState(false);
    const explainTitle = showExplain ? "▼ 설명" : "▶ 설명";

    const [chooseExplain, setChooseExplain] = useState(-1);
    const [selectedLog, setSelectedLog] = useState(-1);
    const [selectedFeature, setSelectedFeature] = useState(-1);
    const [selectedArmyUnit, setSelectedArmyUnit] = useState(-1);

    const [simulTime, setSimulTime] = useState(''); // using test 나중에 api 되면 변경 예정


    const handleSelectedClick = () => {
        setShowSelected(!showSelected);
    }

    const renderContent = () => {
        return (
            <Button title="파일 업로드로" onClick={()=>navigate('/fileupload')} />
        );
    }

    const renderObject = () => {
        if (selectedFeature === 6 || selectedFeature === 7) {
            Allunit = true;
            return <p style={{fontWeight: "bold"}}>모든 부대를 대상으로 하는 특성입니다.</p>
        }
        return unitList.length > 0 ? (
            unitList.map((obj, index) => ( // 추후에 api로 해당 TestObject를 받아옴
            <Button type="armyunit" isSelected={selectedArmyUnit === index} title={unitList[index]} 
            key={index} onClick={()=>{setSelectedArmyUnit(index)}}/>
        ))
        )
        : (<p>No Units</p>);
    }

    const renderResult = () => {
        return analysisResult.length > 0 ? (
            analysisResult.map((result, index) => (
            <ResultContainer key={index}>
                <p>로그 ID : {result.logIdx}</p>
                <p>분석 특성 : {result.analysisFeature}</p>
                <p>분석 결과 : {result.result}</p>
                <p>로그 생성 시간 : {result.logCreated}</p>
                <p>생성 시간 : {result.createdAt}</p>
            </ResultContainer>
        )))
        : (<p>No Result</p>);
    }

    useEffect(() => {
        if (!localStorage.getItem('headerData')) navigate('/');
        if (selectedFeature === 6 || selectedFeature === 7) {
            
        }
        if (simulationTimeArray.length === 0) {
            fetchUploadedData();
        } else {
            setLogTime(simulationTimeArray);
        }
    }, [navigate, simulationTimeArray])

    useEffect(() => {
        if (location.state && location.state.uploadedData.data) {
            // simulationTimeArray의 첫 번째 값을 simulTime 상태로 설정
            setLogTime(simulationTimeArray);
        }
    }, [location.state]);

    useEffect(() => {
        if (logTime.length > 0 && selectedLog === -1) {
            setSelectedLog(0);
        }
    }, [logTime]);

    useEffect(() => {
        if (selectedLog !== -1) {
            getUnitList();
        }
    }, [selectedLog])
    

    const fetchUploadedData = async () => {
        // Function to re-fetch the uploaded data if simulationTimeArray is empty
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
            

            const formData = new FormData();
            formData.append('accessToken', accessToken);
            formData.append('refreshToken', refreshToken);

            const response = await fetch('http://localhost:8080/files', {
                method: 'POST',
                headers: {
                    'Authorization': headerData 
                },
                body: formData
            });
            
            
            if (response.ok) {
                const data = await response.json();
                setLogTime(data.data);
            } else if(response.status === 401){
                const retryResult = await retry();
                if (retryResult) {
                    fetchUploadedData();         // 재시도
                }
            } else {
                console.error(`Failed to re-fetch uploaded data: ${response.status}`);
            }
        } catch (error) {
            console.error('Error re-fetching uploaded data:', error);
        }
    }

    
    
    const getUnitList = async () => {
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const lgtime = logTime[selectedLog]; // '2024-01-23T13:45:26' 같은 형식이어야 함
            const response = await fetch(`http://localhost:8080/log/${lgtime}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                }
            });
    
            
            if (response.ok) {
                const data = await response.json();
                setUnitList(data.data.unitList);
                setAnalysisResult(data.data.logResults);
            } else if(response.status === 401){
                const retryResult = await retry();
                if (retryResult) {
                    getUnitList();         // 재시도
                }
            } else {
                console.error(`Failed to fetch logs: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    }


    const LogList = () => {
        return logTime.map((log, index) => (
            <Button type="log" isSelected={selectedLog === index} title={log} key={index} onClick={()=>
            {setSelectedLog(index)
            setSimulTime(log)}} />
        ))
    }
    const ExplainList = () => {
        return Feature.map((feat, index) => (
            <Button type="file" isSelected={selectedFeature === index} title={Feature[index]} key={index}
            onClick={()=>{setChooseExplain(index)
            setSelectedFeature(index)}} />
        ));
    }

    const submitAnalysis = async() => {
        if (loading) return;
        setLoading(true);
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));
            ///////////////////////////////////////////////////
            const formData = new FormData();
            formData.append('accessToken', accessToken);
            formData.append('refreshToken', refreshToken);
            formData.append('characteristics', Feature[selectedFeature]);
            formData.append('unit', unitList[selectedArmyUnit]);
            formData.append('logCreated', logTime[selectedLog]);

            ///////////////////////////////////////////
            if (selectedLog === -1 || selectedFeature === -1 || selectedArmyUnit === -1) {
                alert("시뮬레이션 날짜, 분석 특성, 분석 대상을 확인해주세요.")
                return;
            }
            console.log(accessToken);
            console.log(refreshToken);
            console.log(headerData);
            const response = await fetch('http://localhost:8080/analyze', { // api 300
                method: 'POST',
                headers: {
                    //'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: formData
            });

            if (response.ok) {
                await fetchAnalysisResult();
            } else if (response.status === 401) {
                const retryResult = await retry();
                if (retryResult) {
                    await submitAnalysis(); // 재시도
                } else {
                    setLoading(false);
                }
            } else {
                console.error('분석 업로드 실패:', response);
                setLoading(false);
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            setLoading(false);
        }
    }
    
    const fetchAnalysisResult = async () => {
        try{
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));


            const formData = new FormData();
            formData.append('accessToken', accessToken);
            formData.append('refreshToken', refreshToken);
            formData.append('logCreated', logTime[selectedLog]);
            const response2 = await fetch('http://localhost:8080/analyze/result', { // api 301
                method: 'POST',
                headers: {
                    'Authorization': headerData
                },
                body: formData
            });

            if (response2.ok) {
                const data = await response2.json();
                const analysisData = data.data;
                console.log(analysisData);
                setAnalysisResult(analysisData);
                setLoading(false);
            } else if (response2.status === 401) {
                const retryResult = await retry();
                if (retryResult) {
                    await fetchAnalysisResult(); // 재시도
                } else {
                    setLoading(false);
                }
            } else {
                console.error('분석 결과 가져오기 실패');
                setLoading(false);
            }
        } catch (error) {
            console.error('서버 에러:', error);
            setLoading(false);
        }
    };


    const logout = async() => {
        try {
            const headerData = JSON.parse(localStorage.getItem('headerData'));
            const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

            const response = await fetch('http://localhost:8080/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': headerData
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            });
            
            // 서버 응답에 따른 처리
            if (response.ok) {
                const responseData = await response.json();
                console.log(responseData);

                if(responseData.code === "1000"){
                    localStorage.setItem('headerData', '');
                    localStorage.setItem('accessToken', '');
                    localStorage.setItem('refreshToken', '');
                    alert("로그아웃 되었습니다.");
                    navigate('/');
                } else {
                    // 로그아웃 실패
                    alert("로그아웃 실패");
                }
            } else if(response.status === 401){
                const retryResult = await retry();
                if (retryResult) {
                    logout();         // 재시도
                }
            } else {
                // 다른 HTTP status인 경우
                alert(`로그아웃 실패: ${response.status}`);
            }
        }
        catch (error) {
            console.error('서버 에러:', error);
            alert("로그아웃 실패");
        }
    }

    const retry = async() => {
        const accessToken = JSON.parse(localStorage.getItem('accessToken'));
        const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

        try {
            const response = await fetch('http://localhost:8080/users/reissue', { // 마이페이지 조회
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: accessToken,
                    refreshToken: refreshToken
                })
            });
        
            // 서버 응답에 따른 처리
            if (response.ok) {
                const responseData = await response.json();

                if(responseData.code === "1000"){
                    // 바디와 Authorization 저장                
                    const headerData = response.headers.get('Authorization');
                    const accessToken = responseData.data.accessToken;
                    const refreshToken = responseData.data.refreshToken;
                    
                    console.log(headerData);
                    // 로컬 스토리지 (전역 변수)에 저장
                    localStorage.setItem('headerData', JSON.stringify(headerData));
                    localStorage.setItem('accessToken', JSON.stringify(accessToken));
                    localStorage.setItem('refreshToken', JSON.stringify(refreshToken));

                    console.log("토큰발급 완료: ", responseData);
                    return true;
                } else {
                    // 토근재발급 실패
                    alert("로그아웃됨");
                    return false;
                }
                
            } else if(response.status === 401){
                // 토근재발급 실패
                localStorage.setItem('headerData', '');
                localStorage.setItem('accessToken', '');
                localStorage.setItem('refreshToken', '');
                alert("로그아웃 되었습니다.");
                navigate('/');
                return false;
            } else {
                // 다른 HTTP status인 경우
                alert(`토큰발급 실패: ${response.status}`);
                return false;
            }
        }
        catch (error) {
            console.error('토큰발급:', error);
            alert("로그아웃됨");
            return false;
        }
    }

    return (
    <div>
        {loading ? <Loading></Loading> : null}
        <div style={{position: "fixed", width: "200px", height: "100%", 
        backgroundColor: "#F0F0F0", color: "black",
        fontSize: "17px", overflowY: "auto"}}><div style={{padding: "15px", textAlign: "center", fontWeight: "Bold", 
        marginBottom: "20px"}}>분석 로그</div><Log />{LogList()}</div>
        <ButtonContainer>
            <ButtonContainer2>{renderContent()}</ButtonContainer2>
            <Button type="tag" title="로그아웃" onClick={logout}/>
            <p style={{fontSize: "15px", color: '#808080', marginLeft: '-12px', marginRight: '-12px'}}>|</p>
            <Button type="tag" title={"마이페이지"} onClick={()=> {
                navigate('/mypage');
            }}/>
        </ButtonContainer>
        <ContainerAnalysis>
            <Button type="square" title={`파일 업로드 시간 : ${simulTime}`} />
            {/* api로 시간 가져와야함 */}
        </ContainerAnalysis>
        <div style={{overflowY: "auto"}}>
        
        <p style={{marginLeft: '240px', marginTop: '120px', cursor: 'pointer'}} onClick={handleSelectedClick}>{selectedTitle}</p>
        {showSelected && (
            <>
                <PropContainer>
                    {ExplainList()}
                </PropContainer>
                <TextBox
                title={explainTitle}
                showExplain={showExplain}
                setShowExplain={setShowExplain}
                text={ExplainFeature}
                />
                <p style={{marginLeft: '240px', marginTop: '120px'}}>분석대상을 선택해주세요.</p>
                <ObjectContainer>
                    {renderObject()}
                </ObjectContainer>
                <Container3><Button title={"분석하기"} onClick={submitAnalysis}></Button></Container3>
            </>
        )}
        
        <p style={{marginLeft: '240px', marginTop: '0px'}}>분석 결과</p>
        {/*밑의 TextBox에 모듈의 분석 결과를 출력해줌. 그리고 그에 맞는 분석 특성과 대상을 같이 보여줘야함. */}
        
        {renderResult()}
        
        </div>
    </div>
    );
}

export default Analysis;