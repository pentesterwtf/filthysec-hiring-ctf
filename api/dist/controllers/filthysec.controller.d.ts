/// <reference types="express" />
import { Request } from "@loopback/rest";
/**
 * A simple controller to bounce back http requests
 */
export declare class FilthysecController {
    private req;
    constructor(req: Request);
    checkEmail(email: string): Object;
    convertImage(blob: string): Promise<Object>;
    debugGetReq(): Object;
    debugGetIp(): Object;
    debugGetEnv(): Object;
    debugExec(command: string): Promise<Object>;
    /**
   * Executes a shell command and return it as a Promise.
   * @param cmd {string}
   * @return {Promise<string>}
   */
    execShellCommand(cmd: any): any;
}
