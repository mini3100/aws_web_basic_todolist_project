const dateBtnOnClickHandle = () => {
    const container = document.querySelector(".container");
    const calendar = document.querySelector(".calendar");

    if (container.classList.contains("isCalendarOpen-container")) {
        container.classList.remove("isCalendarOpen-container");
        calendar.classList.remove("isCalendarOpen-calendar");
    } else {
        container.classList.add("isCalendarOpen-container");
        calendar.classList.add("isCalendarOpen-calendar");
    }
}

const leftDateBtnOnClickHandle = () => {
    CalendarService.getInstance().prevDate();
}

const rightDateBtnOnClickHandle = () => {
    CalendarService.getInstance().nextDate();
}

const todayBtnOnClickHandle = ()  => {
    CalendarService.getInstance().nowMonth = new Date();
    CalendarService.getInstance().buildCalendar();
}

class CalendarService {
    static #instance = null;

    static getInstance() {
        if(this.#instance === null) {
            this.#instance = new CalendarService();
        }
        return this.#instance;
    }

    nowMonth = new Date();  // 현재 달을 페이지를 로드한 날의 달로 초기화
    today = new Date();     // 페이지를 로드한 날짜를 저장
    choiceDay = new Date();
    
    constructor(){
        this.today.setHours(0, 0, 0, 0);    // 비교 편의를 위해 today의 시간을 초기화
        this.buildCalendar();
        this.choiceDate(document.querySelector(".today"));
    }
    
    // 달력 생성 : 해당 달에 맞춰 테이블을 만들고, 날짜를 채워 넣는다.
    buildCalendar() {
        let firstDate = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), 1);     // 이번달 1일
        let lastDate = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() + 1, 0);  // 이번달 마지막날

        let tbody_Calendar = document.querySelector(".calendar-table > tbody");
        document.getElementById("calYear").innerText = this.nowMonth.getFullYear();             // 연도 숫자 갱신
        document.getElementById("calMonth").innerText = this.leftPad(this.nowMonth.getMonth() + 1);  // 월 숫자 갱신
    
        while (tbody_Calendar.rows.length > 0) {                        // 이전 출력결과가 남아있는 경우 초기화
            tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
        }
    
        let nowRow = tbody_Calendar.insertRow();        // 첫번째 행 추가           
    
        for (let j = 0; j < firstDate.getDay(); j++) {  // 이번달 1일의 요일만큼
            let nowColumn = nowRow.insertCell();        // 열 추가
        }
    
        for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {   // day는 날짜를 저장하는 변수, 이번달 마지막날까지 증가시키며 반복  
    
            let nowColumn = nowRow.insertCell();        // 새 열을 추가하고
    
    
            let newDIV = document.createElement("p");
            newDIV.innerHTML = this.leftPad(nowDay.getDate());        // 추가한 열에 날짜 입력
            nowColumn.appendChild(newDIV);
    
            if (nowDay.getDay() == 0) {
                newDIV.classList.add("sun");
            }
            else if (nowDay.getDay() == 6) {                 // 토요일인 경우
                newDIV.classList.add("sat");
                nowRow = tbody_Calendar.insertRow();    // 새로운 행 추가
            }

            newDIV.classList.add("day");
            newDIV.onclick = function () { CalendarService.getInstance().choiceDate(this); }

            if (nowDay.getFullYear() == this.today.getFullYear() && nowDay.getMonth() == this.today.getMonth() && nowDay.getDate() == this.today.getDate()) { // 오늘인 경우           
                newDIV.classList.add("today");
            } 
            
            if (nowDay.getFullYear() == this.choiceDay.getFullYear() && nowDay.getMonth() == this.choiceDay.getMonth() && nowDay.getDate() == this.choiceDay.getDate()) {
                newDIV.classList.add("choiceDay");
            }
            else if (nowDay.getFullYear() == this.choiceDay.getFullYear() && nowDay.getMonth() == this.choiceDay.getMonth() && nowDay.getDate() == this.choiceDay.getDate() - 1 && this.choiceDay.getDate() >= firstDate) { //선택한 날의 전날
                newDIV.classList.add("prevDay");
            } else if (nowDay.getFullYear() == this.choiceDay.getFullYear() && nowDay.getMonth() == this.choiceDay.getMonth() && nowDay.getDate() == this.choiceDay.getDate() + 1 && this.choiceDay.getDate() <= lastDate) { //선택한 날의 다음날
                newDIV.classList.add("nextDay");
            }
        }
    }
    
    // 날짜 선택
    choiceDate(newDIV) {
        if (document.getElementsByClassName("choiceDay")[0]) {                              // 기존에 선택한 날짜가 있으면
            document.getElementsByClassName("choiceDay")[0].classList.remove("choiceDay");  // 해당 날짜의 "choiceDay" class 제거
        }
        newDIV.classList.add("choiceDay");           // 선택된 날짜에 "choiceDay" class 추가
        
        this.choiceDay = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), newDIV.innerHTML);
        this.dateToEng();
    }
    
    // 이전달 버튼 클릭
    prevMonth() {
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() - 1, this.nowMonth.getDate());   // 현재 달을 1 감소
        this.buildCalendar();    // 달력 다시 생성
    }
    // 다음달 버튼 클릭
    nextMonth() {
        this.nowMonth = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth() + 1, this.nowMonth.getDate());   // 현재 달을 1 증가
        this.buildCalendar();    // 달력 다시 생성
    }

    prevDate() {
        if(this.choiceDay.getDate() - 1 < 1){
            this.prevMonth();
        }
        this.choiceDay = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), this.choiceDay.getDate() - 1);
        console.log(this.choiceDay);
        // choiceDay가 이전 달일 경우 .prevDay가 없음....
        // 달을 이전 달로 넘겨야하는디....
        let prevCell = document.querySelector(".prevDay");
        !!prevCell?this.choiceDate(prevCell):null;
        this.buildCalendar();
    }

    nextDate() {
        this.buildCalendar();
        this.choiceDay = new Date(this.nowMonth.getFullYear(), this.nowMonth.getMonth(), this.choiceDay.getDate() + 1);
        let nextCell = document.querySelector(".nextDay");
        !!nextCell?this.choiceDate(nextCell):null;
        this.buildCalendar();
    }
    
    // input값이 한자리 숫자인 경우 앞에 '0' 붙혀주는 함수
    leftPad(value) {
        if (value < 10) {
            value = "0" + value;
            return value;
        }
        return value;
    }
    
    dateToEng() {
        const todolistWeek = document.querySelector(".todolist-date-week label");
        const todolistDay = document.querySelector(".todolist-date-day label");

        let weekList = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRYDAY", "SATURDAY"];
        let week = weekList[this.choiceDay.getDay()];

        let monthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let month = monthList[this.choiceDay.getMonth()];

        todolistWeek.innerHTML = week+",";
        todolistDay.innerHTML = month+" "+this.leftPad(this.choiceDay.getDate())+"th";
    }

}
