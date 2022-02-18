"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forbiddenHandler = exports.unauthorizedHandler = exports.genericErrorHandler = exports.badRequestHandler = exports.notFoundHandler = void 0;
const notFoundHandler = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.notFoundHandler = notFoundHandler;
const badRequestHandler = (err, req, res, next) => {
    console.log(err.name);
    if (err.status === 400 || err.name === "ValidationError") {
        res.status(400).send({ message: err.errors || "Bad Request" });
    }
    else {
        next(err);
    }
};
exports.badRequestHandler = badRequestHandler;
const genericErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: "Generic Server Error" });
};
exports.genericErrorHandler = genericErrorHandler;
const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
        res.status(401).send({
            status: "error",
            message: err.message || "You are not logged in!",
        });
    }
    else {
        next(err);
    }
};
exports.unauthorizedHandler = unauthorizedHandler;
const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
        res.status(403).send({
            status: "error",
            message: err.message || "You are not allowed to do that!",
        });
    }
    else {
        next(err);
    }
};
exports.forbiddenHandler = forbiddenHandler;
