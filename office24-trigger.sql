CREATE OR REPLACE TRIGGER trg_member_insert
AFTER INSERT ON member
FOR EACH ROW
BEGIN
    MERGE INTO statistics s
    USING (SELECT TRUNC(:new.reg_date) AS report_date FROM dual) d
    ON (s.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET s.member_count = s.member_count + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, member_count)
        VALUES (d.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_manager_insert
AFTER INSERT ON manager
FOR EACH ROW
DECLARE
    v_date VARCHAR2(7) := TO_CHAR(SYSDATE, 'YYYY-MM');
BEGIN
    MERGE INTO statistics a
    USING (SELECT v_date AS report_date FROM dual) s
    ON (a.report_date = s.report_date)
    WHEN MATCHED THEN
        UPDATE SET a.manager_count = a.manager_count + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, manager_count)
        VALUES (s.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_office_insert
AFTER INSERT ON office
FOR EACH ROW
DECLARE
    v_date VARCHAR2(7) := TO_CHAR(SYSDATE, 'YYYY-MM');
BEGIN
    MERGE INTO statistics a
    USING (SELECT v_date AS report_date FROM dual) s
    ON (a.report_date = s.report_date)
    WHEN MATCHED THEN
        UPDATE SET a.office_count = a.office_count + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, office_count)
        VALUES (s.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_booking_insert
AFTER INSERT ON booking
FOR EACH ROW
DECLARE
    v_date VARCHAR2(7) := TO_CHAR(SYSDATE, 'YYYY-MM');
BEGIN
    MERGE INTO statistics a
    USING (SELECT v_date AS report_date FROM dual) s
    ON (a.report_date = s.report_date)
    WHEN MATCHED THEN
        UPDATE SET a.booking_count = a.booking_count + 1, 
                   a.total_amount = a.total_amount + :NEW.price
    WHEN NOT MATCHED THEN
        INSERT (report_date, booking_count, total_amount)
        VALUES (s.report_date, 1, :NEW.price);
END;
/

CREATE OR REPLACE TRIGGER trg_review_insert
AFTER INSERT ON review
FOR EACH ROW
DECLARE
    v_date VARCHAR2(7) := TO_CHAR(SYSDATE, 'YYYY-MM');
BEGIN
    MERGE INTO statistics a
    USING (SELECT v_date AS report_date FROM dual) s
    ON (a.report_date = s.report_date)
    WHEN MATCHED THEN
        UPDATE SET a.review_count = a.review_count + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, review_count)
        VALUES (s.report_date, 1);
END;
/