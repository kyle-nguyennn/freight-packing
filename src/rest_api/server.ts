import express, { NextFunction, Request, Response } from "express";
import { OrderHandler } from "../orderHandler";

const app = express();
const port = 8080; // default port to listen

app.use(express.json());
// define a route handler for the default home page
app.get( "/", (req: Request, res: Response) => {
    res.send("Welcome to Freight Packer!!");
});
app.get( "/api", (req: Request, res: Response) => {
    res.send("API is working.");
});
app.get("/api/v1/packing", (req: Request, res: Response) => {
    console.log(req.query);
    res.send("Done");
});
app.post("/api/v1/packing", (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    const containerSpecs = req.body.containerSpecs;
    const orderHandler = new OrderHandler({ containerSpecs });
    const orderRequest = req.body.orderRequest;
    res.json(orderHandler.packOrder(orderRequest));
});

// start the express server
app.listen( port, () => {
    // tslint:disable-next-line:no-console
    console.log( `server started at http://localhost:${ port }` );
} );