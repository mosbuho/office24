alter session set "_ORACLE_SCRIPT" = true;

create user office24 identified by office24
	default tablespace users
	temporary tablespace temp;

grant connect,resource,dba to office24;