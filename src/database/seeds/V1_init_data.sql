-- ================================
-- 1. 로그인 테이블 (login) 초기 데이터
-- ================================
INSERT IGNORE INTO logins (passid, password, state, createdAt, updatedAt)
VALUES ('admin', 'recipot1!11', 'Activation', NOW(), NOW());

-- ================================
-- 2. 유저 테이블 (users) 초기 데이터
-- ================================
INSERT IGNORE INTO users (name, email, phone, gender, state, login_id, createdAt, updatedAt)
VALUES ('admin', 'admin@example.com', '01012345678', 'Unknown', 'Activation', 1, NOW(), NOW());

-- ================================
-- 3. 공통 코드 그룹 (common_code_group) 초기 데이터
-- ================================
INSERT IGNORE INTO common_code_group (group_code, group_name, remark, use_yn, created_by, created_at, updated_at)
VALUES ('C01', 'COOKING_LEVEL', '요리 실력 구분', 'Y', 'SYSTEM', NOW(), NOW()),
       ('H01', 'HOUSEHOLD_TYPE', '가구 형태 구분', 'Y', 'SYSTEM', NOW(), NOW()),
       ('J01', 'JOB', '직업 분류', 'Y', 'SYSTEM', NOW(), NOW());

-- ================================
-- 4. 공통 코드 (common_code) 초기 데이터
-- ================================
INSERT IGNORE INTO common_code (code, group_code, name, remark, sort_order, use_yn, depth, created_by, created_at, updated_at)
VALUES ('C01001', 'C01', '초보자', '요리 실력', 1, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('C01002', 'C01', '숙련자', '요리 실력', 2, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('C01003', 'C01', '전문가', '요리 실력', 3, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('H01001', 'H01', '1인 가구', '가구 형태', 4, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('H01002', 'H01', '2인 가구', '가구 형태', 5, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('H01003', 'H01', '3인 이상', '가구 형태', 6, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('H01004', 'H01', '기타', '가구 형태', 7, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01001', 'J01', '학생', '직업', 8, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01002', 'J01', '주부', '직업', 9, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01003', 'J01', '직장인', '직업', 10, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01004', 'J01', '무직', '직업', 11, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01005', 'J01', '자영업자', '직업', 12, 'Y', 1, 'SYSTEM', NOW(), NOW()),
       ('J01006', 'J01', '기타', '직업', 13, 'Y', 1, 'SYSTEM', NOW(), NOW());