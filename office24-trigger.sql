CREATE OR REPLACE TRIGGER trg_member_insert
AFTER INSERT ON member
FOR EACH ROW
BEGIN
    MERGE INTO member_statistics ms
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (ms.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET ms.member_create = ms.member_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, member_create)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_member_delete
AFTER DELETE ON member
FOR EACH ROW
BEGIN
    MERGE INTO member_statistics ms
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (ms.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET ms.member_delete = ms.member_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, member_delete)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_manager_insert
AFTER INSERT ON manager
FOR EACH ROW
BEGIN
    MERGE INTO manager_statistics mg
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (mg.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mg.manager_create = mg.manager_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, manager_create)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_manager_delete
AFTER DELETE ON manager
FOR EACH ROW
BEGIN
    MERGE INTO manager_statistics mg
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (mg.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mg.manager_delete = mg.manager_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, manager_delete)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_office_insert
AFTER INSERT ON office
FOR EACH ROW
BEGIN
    MERGE INTO office_statistics oc
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (oc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET oc.office_create = oc.office_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, office_create)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_office_delete
AFTER DELETE ON office
FOR EACH ROW
BEGIN
    MERGE INTO office_statistics oc
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (oc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET oc.office_delete = oc.office_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, office_delete)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_booking_insert
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    MERGE INTO booking_statistics bk
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (bk.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET bk.booking_create = bk.booking_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, booking_create)
        VALUES (d.report_date, 1);
    MERGE INTO sales_statistics ss
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (ss.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET ss.sales_create = ss.sales_create + :NEW.price
    WHEN NOT MATCHED THEN
        INSERT (report_date, sales_create)
        VALUES (d.report_date, :NEW.price);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_booking_delete
AFTER DELETE ON booking
FOR EACH ROW
DECLARE
    v_refund_amount NUMBER;
    v_days_diff     NUMBER;
BEGIN
    v_days_diff := :OLD.start_date - TRUNC(SYSDATE);

    IF v_days_diff >= 5 THEN
        v_refund_amount := :OLD.price;
    ELSIF v_days_diff >= 3 THEN
        v_refund_amount := :OLD.price * 0.7;
    ELSIF v_days_diff >= 1 THEN
        v_refund_amount := :OLD.price * 0.5;
    ELSE
        v_refund_amount := :OLD.price * 0.0;
    END IF;

    MERGE INTO booking_statistics bk
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (bk.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET bk.booking_delete = bk.booking_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, booking_delete)
        VALUES (d.report_date, 1);

    MERGE INTO sales_statistics ss
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (ss.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET ss.sales_delete = ss.sales_delete + v_refund_amount
    WHEN NOT MATCHED THEN
        INSERT (report_date, sales_delete)
        VALUES (d.report_date, v_refund_amount);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_review_insert
AFTER INSERT ON review
FOR EACH ROW
BEGIN
    MERGE INTO review_statistics rv
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (rv.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET rv.review_create = rv.review_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, review_create)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_review_delete
AFTER DELETE ON review
FOR EACH ROW
BEGIN
    MERGE INTO review_statistics rv
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (rv.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET rv.review_delete = rv.review_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, review_delete)
        VALUES (d.report_date, 1);
END;
/

-----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_booking_before_delete
BEFORE DELETE ON booking
FOR EACH ROW
DECLARE
    v_refund_amount NUMBER;
    v_days_diff     NUMBER;
BEGIN
    v_days_diff := :OLD.start_date - TRUNC(SYSDATE);

    IF v_days_diff >= 5 THEN
        v_refund_amount := :OLD.price;
    ELSIF v_days_diff >= 3 THEN
        v_refund_amount := :OLD.price * 0.7;
    ELSIF v_days_diff >= 1 THEN
        v_refund_amount := :OLD.price * 0.5;
    ELSE
        v_refund_amount := :OLD.price * 0.0;
    END IF;

    INSERT INTO refund (
        no, office_no, member_no, name, phone, 
        price, refund_amount, payment, start_date, 
        end_date, booking_date, reg_date
    ) VALUES (
        refund_seq.NEXTVAL, :OLD.office_no, :OLD.member_no, :OLD.name, :OLD.phone, 
        :OLD.price, v_refund_amount, :OLD.payment, :OLD.start_date, 
        :OLD.end_date, :OLD.reg_date, SYSDATE
    );
END;
/

-----------------------------------------------------------------------------