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
            response: re.test(String(email).toLowerCase())
        };
    }
    /*
     * TODO - Put SSRF/LFI here
     * Make it a silly constraint where it reads the file origin,
     * But it'll make everything a PDF
     */
    scanUrl(eventOrigin) {
        return {
            todo: "implement me",
        };
    }
    /*
    * *should* only be SSRF, file origin isn't on by default
    * if it gets used for LFI, cool
    */
    async convertImage(blob) {
        let buf = Buffer.from(blob, 'base64');
        let text = buf.toString('ascii');
        const image = await node_html_to_image_1.default({
            html: text
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
    async debugExec(blob) {
        let buf = Buffer.from(blob, 'base64');
        let text = buf.toString('ascii');
        const image = await node_html_to_image_1.default({
            html: text
        });
        return image;
    }
    /*
     * TODO - Return with creds or something silly
     * Or a reversible password hashing scenario
     */
    /*
     * TODO - Return all the users in the system
     */
    userList() {
        return {
            todo: "implement me",
        };
    }
    /*
     * TODO - Return a given username
     */
    getUser(Username) {
        return {
            todo: "implement me",
        };
    }
    //TokenSync(): Promise<{uuid: string; status: string}[]> {
    newUser() {
        return {
            todo: "impelement me",
        };
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
    rest_1.get("/scan/{url}"),
    tslib_1.__param(0, rest_1.param.path.string("url")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "scanUrl", null);
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
    rest_1.get("/debug/exec/{blob}", {
        responses: {
            "200": {
                description: "Executes a command",
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string("blob")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], FilthysecController.prototype, "debugExec", null);
tslib_1.__decorate([
    rest_1.get("/user/list", {
        responses: {
            "200": {
                description: "Returns a list of users registered in the system",
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "userList", null);
tslib_1.__decorate([
    rest_1.get("/user/{username}"),
    tslib_1.__param(0, rest_1.param.path.string("username")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "getUser", null);
tslib_1.__decorate([
    rest_1.post("/user/", {
        responses: {
            "200": {
                description: "Creates a new user",
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Object)
], FilthysecController.prototype, "newUser", null);
FilthysecController = tslib_1.__decorate([
    tslib_1.__param(0, context_1.inject(rest_1.RestBindings.Http.REQUEST)),
    tslib_1.__metadata("design:paramtypes", [Object])
], FilthysecController);
exports.FilthysecController = FilthysecController;
//# sourceMappingURL=filthysec.controller.js.map