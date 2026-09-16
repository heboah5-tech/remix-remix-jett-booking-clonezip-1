import type { Request } from "express";

export type IpDataLookup = {
  ip: string | null;
  country: string | null;
  countryCode: string | null;
};

type IpDataResponse = {
  ip?: string;
  country_name?: string;
  country_code?: string;
};

function firstHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0]?.trim() || null;
  }

  return value?.split(",")[0]?.trim() || null;
}

function getClientIp(req: Request): string | null {
  return (
    firstHeaderValue(req.headers["x-forwarded-for"]) ||
    firstHeaderValue(req.headers["x-real-ip"]) ||
    req.ip?.replace(/^::ffff:/, "") ||
    null
  );
}

export async function lookupClientIpData(req: Request): Promise<IpDataLookup> {
  const clientIp = getClientIp(req);
  const apiKey = process.env.IPDATA_API_KEY?.trim();

  if (!apiKey) {
    return {
      ip: clientIp,
      country: null,
      countryCode: null,
    };
  }

  const lookupPath = clientIp ? `/${encodeURIComponent(clientIp)}` : "";
  const url = `https://api.ipdata.co${lookupPath}?api-key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return {
        ip: clientIp,
        country: null,
        countryCode: null,
      };
    }

    const data = (await response.json()) as IpDataResponse;

    return {
      ip: data.ip || clientIp,
      country: data.country_name || null,
      countryCode: data.country_code || null,
    };
  } catch {
    return {
      ip: clientIp,
      country: null,
      countryCode: null,
    };
  }
}