## frame-typeorm
### 1. 빠른 시작
```sh
npm install
docker-compose -f docker-compose.dev.yml -p recipot up -d
docker network create docker-network
```
```sh
npm run start:dev
```

### 2. NestJS + TypeORM 마이그레이션 적용
1. src/database/migrations 폴더에 새로운 마이그레이션 파일을 생성합니다.
```sh
npm run migration:create
```
2. 생성된 마이그레이션 파일을 열어 up과 down 메서드를 정의합니다. 
3. 마이그레이션 파일을 적용합니다.
```sh
npm run migration:run
```

### 3. EsLint 자동 적용
```sh
npm run lint
```