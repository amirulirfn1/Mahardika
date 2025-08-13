type Dict = Record<string, unknown>;

function redact(obj?: Dict) {
	if (!obj) return undefined;
	return JSON.parse(
		JSON.stringify(obj, (key, value) => (/pass|secret|key|token/i.test(key) ? "[redacted]" : value)),
	);
}

export function logError(err: unknown, context?: Dict) {
	const safe = redact(context);
	if (process.env.SENTRY_DSN) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const S = require("@sentry/nextjs");
			if (S && typeof S.captureException === "function") {
				S.captureException(err, { extra: safe });
			}
		} catch (_e) {
			void 0;
		}
	}
	// eslint-disable-next-line no-console
	console.error("[error]", err, safe);
}


