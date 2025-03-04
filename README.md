# 빠른 시작
- npm install
- docker-compose -f docker-compose.dev.yml -p recipot api up -d
- npm run start:dev

# 마이그레이션
- 1. npm run migration:create 명령어를 통해 /database/migrations에 마이그레이션 파일 생성
- 2. 스키마 up/down 정의
- 3. npm run migration:run 명령어를 통해 스키마 적용