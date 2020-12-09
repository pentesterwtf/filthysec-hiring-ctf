import {
  Request,
  RestBindings,
  get,
  ResponseObject,
  param,
  post,
} from "@loopback/rest";
import { inject } from "@loopback/context";

import nodeHtmlToImage from "node-html-to-image";
import { exec } from "child_process";
import { isPrimitive } from "util";

/**
 * A simple controller to bounce back http requests
 */
export class FilthysecController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get("/checkemail/{email}", {
    responses: {
      "200": {
        description:
          "Validates if an email address is a valid email address. Super stringent check",
      },
    },
  })

  /*
   * This is probably not exploitable
   * Maybe a DoS
   */
  checkEmail(@param.path.string("email") email: string): Object {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return {
      response: re.test(String(email).toLowerCase()),
    };
  }

  /*
   * *should* only be SSRF, file origin isn't on by default
   * if it gets used for LFI, cool
   */
  @get("/convert/{blob}", {
    responses: {
      "200": {
        description: "Converts a base64 encoded HTML blob into an image",
      },
    },
  })
  async convertImage(@param.path.string("blob") blob: string): Promise<Object> {
    let buf = Buffer.from(blob, "base64");
    let text = buf.toString("ascii");
    const image = await nodeHtmlToImage({
      html: text,
    });

    return image;
  }

  @get("/debug/req", {
    responses: {
      "200": {
        description: "Debugging use only!",
      },
    },
  })
  /*
   * Dumps environment variables
   */
  debugGetReq(): Object {
    return this.req.headers;
  }
  @get("/debug/ip", {
    responses: {
      "200": {
        description: "Debugging use only!",
      },
    },
  })
  /*
   * Dumps environment variables
   */
  debugGetIp(): Object {
    return this.req.ip;
  }

  @get("/debug/env", {
    responses: {
      "200": {
        description: "Debugging use only!",
      },
    },
  })
  /*
   * Dumps environment variables
   */
  debugGetEnv(): Object {
    return process.env;
  }
  

  @get("/debug/exec/{command}", {
    responses: {
      "200": {
        description: "Executes a command",
      },
    },
  })
  async debugExec(
    @param.path.string("command") command: string
  ): Promise<Object> {
    if (
      ["::1", "localhost", "127.0.0.1"].indexOf(this.req.ip.toString()) >= 0
    ) {
      const x = await this.execShellCommand(command);
      return x;
    } else {
      return "Must come from localhost!";
    }
  }

  /**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
execShellCommand(cmd: any): any {
  const exec = require('child_process').exec;
  return new Promise((resolve, reject) => {
   exec(cmd, (error: any, stdout: any, stderr: any) => {
    if (error) {
     console.warn(error);
    }
    resolve(stdout? stdout : stderr);
   });
  });
 }

}
