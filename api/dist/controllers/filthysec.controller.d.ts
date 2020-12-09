/// <reference types="express" />
import { Request } from "@loopback/rest";
/**
 * A simple controller to bounce back http requests
 */
export declare class FilthysecController {
    private req;
    constructor(req: Request);
    checkEmail(email: string): Object;
    scanUrl(eventOrigin: string): Object;
    convertImage(blob: string): Promise<Object>;
    debugGetReq(): Object;
    debugGetIp(): Object;
    debugGetEnv(): Object;
    debugExec(blob: string): Promise<Object>;
    userList(): Object;
    getUser(Username: string): Object;
    newUser(): Object;
}
