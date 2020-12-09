"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const context_1 = require("@loopback/context");
const node_html_to_image_1 = tslib_1.__importDefault(require("node-html-to-image"));
/**
 * A simple controller to bounce back http requests
 */
let FilthysecController = class FilthysecController {
    constructor(req) {
        this.req = req;
    }
    /*
     * This is probably not exploitable
     * Maybe a DoS
     */
    checkEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return {
            response: re.test(String(email).toLowerCase()),
        };
    }
    /*
     * *should* only be SSRF, file origin isn't on by default
     * if it gets used for LFI, cool
     */
    async convertImage(blob) {
        let buf = Buffer.from(blob, "base64");
        let text = buf.toString("ascii");
        const image = await node_html_to_image_1.default({
            html: text,
        });
        return image;
    }
    /*
     * Dumps environment variables
     */
    debugGetReq() {
        return this.req.headers;
    }
    /*
     * Dumps environment variables
     */
    debugGetIp() {
        return this.req.ip;
    }
    /*
     * Dumps environment variables
     */
    debugGetEnv() {
        return process.env;
    }
    async debugExec(command) {
        if (["::1", "localhost", "127.0.0.1"].indexOf(this.req.ip.toString()) >= 0) {
            const x = await this.execShellCommand(command);
            return x;
        }
        else {
            return "Must come from localhost!";
        }
    }
    /**
   * Executes a shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
    execShellCommand(cmd) {
        const exec = require('child_process').exec;
        return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.warn(error);
                }
                resolve(stdout ? stdout : stderr);
            });
        });
    }
};
tslib_1.__decorate([
    rest_1.get("/checkemail/{email}", {
        responses: {
            "200": {
                description: "Validates if an email address is a valid email address. Super stringent check",
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string("email")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "checkEmail", null);
tslib_1.__decorate([
    rest_1.get("/convert/{blob}", {
        responses: {
            "200": {
                description: "Converts a base64 encoded HTML blob into an image",
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string("blob")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FilthysecController.prototype, "convertImage", null);
tslib_1.__decorate([
    rest_1.get("/debug/req", {
        responses: {
            "200": {
                description: "Debugging use only!",
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "debugGetReq", null);
tslib_1.__decorate([
    rest_1.get("/debug/ip", {
        responses: {
            "200": {
                description: "Debugging use only!",
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "debugGetIp", null);
tslib_1.__decorate([
    rest_1.get("/debug/env", {
        responses: {
            "200": {
                description: "Debugging use only!",
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "debugGetEnv", null);
tslib_1.__decorate([
    rest_1.get("/debug/exec/{command}", {
        responses: {
            "200": {
                description: "Executes a command",
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string("command")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FilthysecController.prototype, "debugExec", null);
FilthysecController = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [Object])
], FilthysecController);
exports.FilthysecController = FilthysecController;
//# sourceMappingURL=filthysec.controller.js.map