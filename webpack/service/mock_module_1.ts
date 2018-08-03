import express, { Request, Response, NextFunction } from 'express';

module.exports = (app: express.Application): void => {
    app
        .get('/mock/test', (req: Request, res: Response, next: NextFunction) => {
            res.json({ status: 1, data: { name: 'webpack.before.service.mock_module_1' } });
        })
        .get('/mock/ping', (req: Request, res: Response, next: NextFunction) => {
            res.json({ status: 1, data: { name: 'webpack.before.service.mock_module_1.ping' } });
        });
};
