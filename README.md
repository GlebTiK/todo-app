# Simple Todo app

The backend uses [**NestJS**](https://nestjs.com/) with [**TypeORM**](https://github.com/typeorm/typeorm), [**PostgreSQL**](https://www.postgresql.org/), and [**JWT**](https://en.wikipedia.org/wiki/JSON_Web_Token) to provide authentication and management of user created to-do tasks.

The frontend utilizes [**ReactJS**](https://react.dev/) and [**hello-pangea/dnd**](https://github.com/hello-pangea/dnd) in order to make the task list reorderable.

## Screenshots of the frontend

![Login](docs/screenshots/login.png)
![Task create](docs/screenshots/task_create.png)
![Index](docs/screenshots/index.png)

## Local development

```bash
# frontend
cd frontend
npm install
cp .env.example .env
npm start

# backend
cd backend
npm install
cp .env.example .env
npm run start:dev
````

[MIT](LICENSE)