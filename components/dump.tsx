import React from "react";
import { Table } from "react-bootstrap";

type RenderType = "simple-value" | "object" | "array";

export function Dump(props: { value: unknown }) {
    const o = props.value;
    const info = getRenderType(o);
    switch (info.type) {
        case 'simple-value':
            return <div>{info.value}</div>;
        case 'object':
            const keyValues = getKeyValues(info.value);
            return <Table striped bordered hover>
                {keyValues.map(kv => {
                    const { key, value } = kv;
                    return <tr>
                        <th>{key}</th>
                        <td>
                            <Dump value={value}></Dump>
                        </td>
                    </tr>
                })}
            </Table>
        case 'array':
            const rows = info.value as Record<string, unknown>[];
            if (info.keys) {
                const keys = info.keys as string[];
                return <table>
                    <thead>
                        <tr>
                            {info.keys.map(key => <th>{key}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map(row => <tr>
                            {keys.map(key => <td>
                                <Dump value={row[key]}></Dump>
                            </td>)}
                        </tr>)}
                    </tbody>
                </table>
            }
            return <table>
                <tbody>
                    {rows.map(row => <tr>
                        <Dump value={row}></Dump>
                    </tr>)}
                </tbody>
            </table>
    }
}

function getRenderType(
    value: any
): { type: RenderType; value: any; keys?: string[] } {
    const type = typeof value;
    switch (type) {
        case "string":
        case "number":
        case "bigint":
        case "boolean":
        case "symbol":
        case "undefined":
            return { type: "simple-value", value: `${value}` };
        case "object":
            if (value === null) return { type: "simple-value", value: "null" };
            if (Array.isArray(value)) {
                const keys = getCommonKeys(value);
                return { type: "array", value, keys };
            }
            return { type: "object", value: value };
        default:
            throw new Error("Unsupported type");
    }
}

function getKeyValues(value: object) {
    if (!value) {
        return [];
    }
    return Object.entries(value).map(([key, value]) => ({ key, value }));
}

function getCommonKeys(value: object[]): string[] {
    if (!value) {
        return [];
    }
    const keys = new Set<string>([]);
    for (const row of value) {
        for (const key of Object.keys(row)) {
            keys.add(key);
        }
    }
    return Array.from(keys);
}