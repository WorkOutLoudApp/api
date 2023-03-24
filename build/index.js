"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const middlewares_1 = require("./middlewares");
const api_router_1 = __importDefault(require("./routes/api.router"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
// Middlewares
app.use((0, helmet_1.default)());
if (dev)
    app.use((0, morgan_1.default)('dev'));
// Routes
app.use('/api', api_router_1.default);
// For AWS ECS to know health of API
app.get('/api/healthcheck', (req, res) => { res.sendStatus(200); });
app.use((req, res) => {
    res.status(404).send('Not Found');
});
app.use(middlewares_1.errorHandler);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);
});
