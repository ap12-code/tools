import { error, json, type RequestHandler } from "@sveltejs/kit";
import { promisify } from "util";
import { exec } from "child_process";
import { xml2json } from "xml-js";
import { verifyAddress } from "$lib/server/verifier";

const execAsync = promisify(exec);

const keys1 = ["Registrant", "Admin", "Tech", "Registry", "Billing", "Registrar"];
const keys2 = ["Domain Name", "WHOIS Server", "Updated Date", "Creation Date", "DNSSEC", "Domain Status"];

type Domain = {
    name: string;
    attributes: {
        name: string;
    };
    elements: {
        name: string;
        attributes: {
            host: string;
        };
    }[];
};

const fix = (propName: string) => {
    return propName.toLowerCase().replaceAll(/[\s\/]/, "_");
};

export const POST: RequestHandler = async ({ request, fetch }) => {
    const body = await request.json();
    if (!body || !body.address) throw error(400);
    if (body.address.includes(" ")) throw error(403);
    if (!verifyAddress(body.address)) throw error(403);
    const servers = JSON.parse(xml2json(await (await fetch("/whois-servers.xml")).text())).elements[0].elements;
    try {
        let whoisServer = "";
        const tld = body.address.split(".")[1];
        servers.forEach((element: Domain) => {
            if (element.attributes && element.attributes.name == tld) {
                whoisServer = element.elements.find((p: any) => p.name == "whoisServer")?.attributes.host ?? "";
            }
        });
        const { stdout } = await execAsync(`whois ${body.address} ${whoisServer}`);
        const splited = stdout.split("\n");
        let result: Record<string, any> = {};

        for (const r of splited) {
            const sp = r.trim().split(": ");
            if (keys2.includes(sp[0])) {
                let k = fix(sp[0].split(" ").slice(-1).join(""));
                k = fix(sp[0]);
                result[k] = sp[1];
            } else if (sp[0] == "Name Server") {
                if (!result["name_servers"]) result["name_servers"] = [];
                if (result["name_servers"].includes(sp[1].toLowerCase())) continue;
                result["name_servers"].push(sp[1].toLowerCase());
            } else if (sp[0].includes(" ")) {
                const n = sp[0].split(" ");
                if (keys1.includes(n[0])) {
                    const k = fix(n[0]);
                    if (!result[k]) result[k] = {};
                    const c = n.slice(1).join(" ");
                    result[k][fix(c)] = sp[1];
                }
            }
        }

        return json(result);
    } catch (e: any) {
        return new Response(e.stderr);
    }
};
