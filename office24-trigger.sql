CREATE OR REPLACE TRIGGER trg_member_insert
AFTER INSERT ON member
FOR EACH ROW
BEGIN
    MERGE INTO member_statistics mc
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (mc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mc.member_create = mc.member_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, member_create)
        VALUES (d.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_member_delete
AFTER DELETE ON member
FOR EACH ROW
BEGIN
    MERGE INTO member_statistics mc
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (mc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mc.member_delete = mc.member_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, member_delete)
        VALUES (d.report_date, 1);
END;
/

----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_manager_insert
AFTER INSERT ON manager
FOR EACH ROW
BEGIN
    MERGE INTO manager_statistics mc
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (mc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mc.manager_create = mc.manager_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, manager_create)
        VALUES (d.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_manager_delete
AFTER DELETE ON manager
FOR EACH ROW
BEGIN
    MERGE INTO manager_statistics mc
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (mc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET mc.manager_delete = mc.manager_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, manager_delete)
        VALUES (d.report_date, 1);
END;
/

----------------------------------------------------------------------------

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

----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_booking_insert
AFTER INSERT ON booking
FOR EACH ROW
BEGIN
    MERGE INTO booking_statistics bc
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (bc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET bc.booking_create = bc.booking_create + 1,
                   bc.total_amount = bc.total_amount + :NEW.price
    WHEN NOT MATCHED THEN
        INSERT (report_date, booking_create, total_amount)
        VALUES (d.report_date, 1, :NEW.price);
END;
/

CREATE OR REPLACE TRIGGER trg_booking_delete
AFTER DELETE ON booking
FOR EACH ROW
BEGIN
    MERGE INTO booking_statistics bc
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (bc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET bc.booking_delete = bc.booking_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, booking_delete)
        VALUES (d.report_date, 1);
END;
/

----------------------------------------------------------------------------

CREATE OR REPLACE TRIGGER trg_review_insert
AFTER INSERT ON review
FOR EACH ROW
BEGIN
    MERGE INTO review_statistics rc
    USING (SELECT TRUNC(:NEW.reg_date) AS report_date FROM dual) d
    ON (rc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET rc.review_create = rc.review_create + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, review_create)
        VALUES (d.report_date, 1);
END;
/

CREATE OR REPLACE TRIGGER trg_review_delete
AFTER DELETE ON review
FOR EACH ROW
BEGIN
    MERGE INTO review_statistics rc
    USING (SELECT TRUNC(:OLD.reg_date) AS report_date FROM dual) d
    ON (rc.report_date = d.report_date)
    WHEN MATCHED THEN
        UPDATE SET rc.review_delete = rc.review_delete + 1
    WHEN NOT MATCHED THEN
        INSERT (report_date, review_delete)
        VALUES (d.report_date, 1);
END;
/