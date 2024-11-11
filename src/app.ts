import express, { Request, Response } from "express";
import "reflect-metadata";
import loggerMiddleware from "./middleware/logger.middleware";
import bodyParser from "body-parser";
import dataSource from "./db/data-source.db";
import employeeRouter from "./routes/employee.routes";
import errorMiddleware from "./middleware/error.middleware";
import departmentRouter from "./routes/department.routes";

const app = express();
const PORT = 3000;

app.use(loggerMiddleware);
app.use(bodyParser.json());
app.use("/employee", employeeRouter);
app.use("/department", departmentRouter);

app.use(errorMiddleware);


(async () => {
    try {
        await dataSource.initialize();
    } catch (e) {
        console.log("Failed to connect to db", e);
        process.exit(1);
    }

    app.listen(PORT, () => {
        console.log("server listening to " + PORT);
    });
})();
