------------------------------------------------------------------------------------------------------------------------------

drop table member;
drop table manager;
drop table admin;
drop table office;
drop table office_image;
drop table notice;
drop table wish;
drop table review;
drop table booking;
drop table member_statistics;
drop table manager_statistics;
drop table office_statistics;
drop table review_statistics;
drop table booking_statistics;
drop table sales_statistics;

------------------------------------------------------------------------------------------------------------------------------

drop sequence member_seq;
drop sequence manager_seq;
drop sequence admin_seq;
drop sequence office_seq;
drop sequence office_image_seq;
drop sequence notice_seq;
drop sequence review_seq;
drop sequence wish_seq;
drop sequence booking_seq;

------------------------------------------------------------------------------------------------------------------------------

insert into admin (id, pw, lv) values ('admin', '$2a$10$FgmS9NEBxDdbUfWjsqiGDesNfltpXEa6u..EQc1Ehh6mO7aBeNccq', 1);

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO member (id, pw, name, phone, email, birth, gender)
        VALUES (
            'user' || LPAD(i, 4, '0'), 
            '$2a$10$FgmS9NEBxDdbUfWjsqiGDesNfltpXEa6u..EQc1Ehh6mO7aBeNccq',
            'Name' || LPAD(i, 4, '0'),
            '0101234567',
            'user' || LPAD(i, 4, '0') || '@example.com',
            ADD_MONTHS(SYSDATE, - (80 - i) * 12),
            CASE 
                WHEN TRUNC(DBMS_RANDOM.VALUE(0, 2)) = 0 THEN 'M'
                ELSE 'W'
            END
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO manager (id, pw, name, phone, email)
        VALUES (
            'manager' || LPAD(i, 3, '0'),
            '$2a$10$FgmS9NEBxDdbUfWjsqiGDesNfltpXEa6u..EQc1Ehh6mO7aBeNccq',
            'Manager' || LPAD(i, 2, '0'),
            '0101234567',
            'manager' || LPAD(i, 2, '0') || '@example.com'
        );
    END LOOP;
END;
/


------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO notice (title, content)
        VALUES (
            'Notice Title ' || LPAD(i, 3, '0'),
            'This is the content of notice number ' || i
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO office (title, manager_no, address, zip_code, latitude, longitude, content, price, capacity, title_img, availability, sido)
        VALUES (
            '오피스 ' || i,
            1,
            '주소 ' || i,
            LPAD(i, 5, '0'),
            TRUNC(DBMS_RANDOM.VALUE(33.0, 38.0), 4),
            TRUNC(DBMS_RANDOM.VALUE(126.0, 129.0), 4),
            '오피스 ' || i || ' 설명',
            TRUNC(DBMS_RANDOM.VALUE(100000, 2000000)),
            i * 10,
            'img' || i || '.jpg',
            TRUNC(DBMS_RANDOM.VALUE(0, 3)),
            CASE 
                WHEN FLOOR(DBMS_RANDOM.VALUE(1, 5)) = 1 THEN '서울'
                WHEN FLOOR(DBMS_RANDOM.VALUE(1, 5)) = 2 THEN '부산'
                WHEN FLOOR(DBMS_RANDOM.VALUE(1, 5)) = 3 THEN '대구'
                WHEN FLOOR(DBMS_RANDOM.VALUE(1, 5)) = 4 THEN '인천'
                ELSE '경기'
            END
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO review (member_no, office_no, rating, content)
        VALUES (
            1,  
            1, 
            TRUNC(DBMS_RANDOM.VALUE(0, 6)),  
            'Review content for office ' || i
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO wish (member_no, office_no)
        VALUES (
            1, 
            1  
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR i IN 1..100 LOOP
        INSERT INTO booking (office_no, member_no, name, phone, payment, price, start_date, end_date)
        VALUES (
            1,  
            1, 
            'Booking ' || LPAD(i, 3, '0'),
            '01051341847',
            CASE
                WHEN MOD(i, 2) = 0 THEN 'Credit Card'
                ELSE 'Cash'
            END,
            TRUNC(DBMS_RANDOM.VALUE(5000, 10000)),  
            SYSDATE + i,  
            SYSDATE + i + 1
        );
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO member_statistics (report_date, member_create, member_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(0, 20)),
                    TRUNC(DBMS_RANDOM.VALUE(0, 10))
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO manager_statistics (report_date, manager_create, manager_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(0, 10)),
                    TRUNC(DBMS_RANDOM.VALUE(0, 5))
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO office_statistics (report_date, office_create, office_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(0, 15)),
                    TRUNC(DBMS_RANDOM.VALUE(0, 8))
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO booking_statistics (report_date, booking_create, booking_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(0, 100)),
                    TRUNC(DBMS_RANDOM.VALUE(0, 50))
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO sales_statistics (report_date, sales_create, sales_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(10000, 50000)),
                    TRUNC(DBMS_RANDOM.VALUE(5000, 25000))  
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

BEGIN
    FOR month IN 1..7 LOOP
        FOR day IN 1..31 LOOP
            BEGIN
                INSERT INTO review_statistics (report_date, review_create, review_delete)
                VALUES (
                    TO_DATE('2024-' || LPAD(month, 2, '0') || '-' || LPAD(day, 2, '0'), 'YYYY-MM-DD'),
                    TRUNC(DBMS_RANDOM.VALUE(0, 10)),
                    TRUNC(DBMS_RANDOM.VALUE(0, 5))
                );
            EXCEPTION
                WHEN OTHERS THEN
                    NULL;
            END;
        END LOOP;
    END LOOP;
END;
/

------------------------------------------------------------------------------------------------------------------------------

commit;