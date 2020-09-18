# How to get this to work

- Install Node if you don't have it.
- Create a `.env` file on the root folder containing the variables like in the example below:
  ```
  PORT=3000
  SERVER_URL=http://localhost:8000
  ```
  where `PORT` is the port you want to run this client at in your localhost, and `SERVER_URL` is the root address of your matching server.
- Run `npm install` on the root folder.
- Run `npx http-server`.
- Open your browser to your localhost with the port you did setup, in this example it would be `http://localhost:3000`.
