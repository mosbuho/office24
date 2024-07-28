------------------------------------------sequence--------------------------------------

create sequence member_seq start with 1 increment by 1 nocache nocycle;
create sequence manager_seq start with 1 increment by 1 nocache nocycle;
create sequence admin_seq start with 1 increment by 1 nocache nocycle;
create sequence office_seq start with 1 increment by 1 nocache nocycle;
create sequence office_image_seq start with 1 increment by 1 nocache nocycle;
create sequence notice_seq start with 1 increment by 1 nocache nocycle;
create sequence review_seq start with 1 increment by 1 nocache nocycle;
create sequence wish_seq start with 1 increment by 1 nocache nocycle;
create sequence booking_seq start with 1 increment by 1 nocache nocycle;

-------------------------------------------table-----------------------------------------

create table member (
    no       number default member_seq.nextval primary key,             -- 구분 코드
    id       varchar2(12) check ( length(id) >= 6 ) not null unique,    -- 아이디 (6자 이상 12자 이하 한글x)
    pw       varchar2(100) not null,           							-- 비밀번호 (8자 이상 16자 이하 한글x, 영문 대문자, 소문자, 숫자, 특수문자 각 1개씩 포함)
    name     varchar2(12) check ( length(name) >= 2 ) not null,         -- 이름 (2자 이상 12자 이하 영어x)
    phone    char(14) not null,                                         -- 번호 (번호, 이메일 둘 중 하나만 필수)
    email    varchar2(32) default null,                                 -- 이메일 (번호, 이메일 둘 중 하나만 필수)
    birth    date not null,                                             -- 생일
    gender   varchar2(1) default null,                                  -- 성별 ('M', 'W' // 선택)
    reg_date date default systimestamp                                  -- 가입일
);

-----------------------------------------------------------------------------------------

create table manager (
    no       number default manager_seq.nextval primary key,            -- 구분 코드
    id       varchar2(12) check ( length(id) >= 6 ) not null unique,    -- 오피스 관리자 아이디 (6자 이상 12자 이하 한글x)
    pw       varchar2(100) not null,   								    -- 오피스 관리자 비밀번호 (8자 이상 16자 이하 한글x, 영문 대문자, 소문자, 숫자, 특수문자 각 1개씩 포함)
    name     varchar2(12) check ( length(name) >= 2 ) not null,         -- 오피스 관리자 이름 (2자 이상 12자 이하 영어x)
    phone    char(11) not null,                                         -- 오피스 관리자 번호 (번호, 이메일 둘 중 하나만 필수)
    email    varchar2(32) default null,                                 -- 오피스 관리자 이메일 (번호, 이메일 둘 중 하나만 필수)
    reg_date date default systimestamp                                  -- 가입일
);

-----------------------------------------------------------------------------------------

create table admin (
    no       number default admin_seq.nextval primary key,              -- 구분 코드
    id       varchar2(12) not null unique,  	                        -- 총 관리자 아이디 (6자 이상 12자 이하 한글x)
    pw       varchar2(100) not null,         							-- 총 관리자 비밀번호 (8자 이상 16자 이하 한글x, 영문 대문자, 소문자, 숫자, 특수문자 각 1개씩 포함)
    lv       number(1) not null,                                      	-- 총 관리자 권한 레벨
    reg_date date default systimestamp                                	-- 가입일
);

-----------------------------------------------------------------------------------------

create table office (
    no           number default office_seq.nextval primary key,         -- 구분 코드
    manager_no   number not null
        references manager ( no )
            on delete cascade,           			                    -- 담당 관리자
    title        varchar2(255) not null,     	 	                    -- 이름 (6자 이상 12자 이하 한글x)
    address      varchar2(255) not null,     	 	                    -- 주소
    zip_code     varchar2(20) not null,      		                    -- 우편 번호
    latitude     float not null,             	 	                    -- 좌표 (위도)
    longitude    float not null,              		                    -- 좌표 (경도)
    content      varchar2(4000) not null,              		            -- 상세설명
    price        number(10) not null,       		                    -- 가격
    capacity     number not null,             		                    -- 수용 가능 인원
    title_img    char(41) not null,       		                        -- 대표 이미지
    availability number(1) default 1,         		                    -- 사용 가능 여부 (가능 1, 불가능 0)
    reg_date     date default systimestamp    		                    -- 생성일
);

-----------------------------------------------------------------------------------------

create table office_image (
    no        number default office_image_seq.nextval primary key,      -- 구분 코드
    office_no number
        references office ( no )
            on delete cascade,					                        -- 오피스 번호
    name      char(41) not null                                         -- 사진 이름
);

-----------------------------------------------------------------------------------------

create table notice (
    no         number default notice_seq.nextval primary key,           -- 구분 코드
    title      varchar2(100) not null,                                  -- 제목
    content    varchar2(4000) not null,                                 -- 내용
    view_count number not null,            		                        -- 조회 수
    reg_date   date default systimestamp                                -- 생성일
);

-----------------------------------------------------------------------------------------

create table review (
    no        number default review_seq.nextval primary key,            -- 구분 코드
    member_no number												    -- 작성자
        references member ( no )
            on delete cascade,
    office_no number												    -- 오피스
        references office ( no )
            on delete cascade,
    rating    number check ( rating between 0 and 5 ) not null, 	    -- 점수
    content   varchar2(4000) not null,         						    -- 내용
    reg_date  date default systimestamp        						    -- 생성일
);

-----------------------------------------------------------------------------------------

create table wish (
    no        number default wish_seq.nextval primary key,              -- 구분 코드
    member_no number
        references member ( no )
            on delete cascade,               	                        -- 작성자
    office_no number
        references office ( no )
            on delete cascade,               	                        -- 오피스
    reg_date  date default systimestamp                                 -- 생성일
);

-----------------------------------------------------------------------------------------

create table booking (
    no         number default booking_seq.nextval primary key,          -- 구분 코드
    office_no  number
        references office ( no )
            on delete cascade,					                        -- 오피스 번호
    member_no  number
        references member ( no )
            on delete cascade,					                        -- 멤버
    name       varchar2(12) not null,			                        -- 예약자
    payment    varchar2(20) not null,			                        -- 결제 수단
    start_date date not null,               	                        -- 예약 시작일
    end_date   date not null,               	                        -- 예약 종료일
    price      number(10) not null,        		                        -- 예약 금액
    reg_date   date default systimestamp, 		                        -- 예약일
    constraint chk_date check ( start_date <= end_date )                -- 예약 조건
);